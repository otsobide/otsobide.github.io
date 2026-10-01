#!/usr/bin/env node
/**
 * Scrapes public photos from a Flickr photostream and writes
 * data/gallery.json.
 *
 * No Flickr API key is used. The script fetches the paginated
 * photostream HTML pages, extracts each photo's id/secret/server plus
 * direct staticflickr URLs (all sizes), then fetches each individual
 * photo page in parallel batches to pick up the title and tags from
 * its OpenGraph meta tags.
 *
 * Env vars:
 *   FLICKR_USER          Photostream path alias (default: tanukifilm)
 *   FLICKR_CONCURRENCY   Parallel requests for photo pages (default: 8)
 *
 * Runs at build time only. The deployed site is fully static — Flickr's
 * CDN only serves image bytes when a visitor scrolls to them
 * (native loading="lazy" + client-side pagination).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = resolve(__dirname, '..', 'data', 'gallery.json')
const COUNTRIES = resolve(__dirname, '..', 'data', 'countries.json')

const USER = process.env.FLICKR_USER || 'tanukifilm'
const CONCURRENCY = Number(process.env.FLICKR_CONCURRENCY || 8)
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * Only tags listed in data/countries.json become filter chips on /gallery.
 * Add new countries there (tag, display name and ISO flag code) as photos
 * from new places are uploaded to Flickr.
 */
const COUNTRY_TAGS = new Set(Object.keys(JSON.parse(await readFile(COUNTRIES, 'utf8'))))

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return res.text()
}

/**
 * Extract the modelExport JSON blob that Flickr embeds in every page.
 * The blob is not a plain JSON string; it is followed by other JS
 * properties, so we progressively truncate until JSON.parse succeeds.
 */
function extractModelExport(html) {
  const start = html.indexOf('modelExport:')
  if (start === -1) return null
  const braceStart = html.indexOf('{', start)
  if (braceStart === -1) return null
  // Try shrinking until we hit valid JSON.
  for (let len = 400_000; len >= 1_000; len -= 1_000) {
    const candidate = html.slice(braceStart, braceStart + len)
    // Trim to last '}'
    const lastBrace = candidate.lastIndexOf('}')
    if (lastBrace === -1) continue
    try {
      return JSON.parse(candidate.slice(0, lastBrace + 1))
    } catch {
      /* keep trying */
    }
  }
  return null
}

function extractPhotostreamModels(model) {
  const streams = model?.main?.['photostream-models']
  if (!Array.isArray(streams) || !streams.length) return null
  return streams[0]?.data
}

function extractPhotos(model) {
  const stream = extractPhotostreamModels(model)
  const list = stream?.photoPageList?.data?._data
  if (!Array.isArray(list)) return []
  const photos = []
  for (const entry of list) {
    const d = entry?.data
    if (!d || typeof d !== 'object') continue
    const id = d.id
    const secret = d.secret
    const sizes = d.sizes?.data || {}
    const dateTaken = d.stats?.data?.dateTaken
    // Pick the largest available preview URL (prefer l/o over smaller).
    const preferred =
      sizes.l?.data?.url ||
      sizes.o?.data?.url ||
      sizes.c?.data?.url ||
      sizes.z?.data?.url ||
      sizes.m?.data?.url
    if (!id || !preferred) continue
    photos.push({
      id: String(id),
      secret,
      image: preferred.startsWith('//') ? `https:${preferred}` : preferred,
      width: sizes.l?.data?.width || sizes.o?.data?.width,
      height: sizes.l?.data?.height || sizes.o?.data?.height,
      dateTaken,
    })
  }
  return photos
}

async function fetchPhotostream() {
  console.log(`[flickr] Scraping photostream for ${USER}`)
  const rootHtml = await fetchText(`https://www.flickr.com/photos/${USER}/`)
  const rootModel = extractModelExport(rootHtml)
  if (!rootModel) throw new Error('Could not parse modelExport on photostream root')

  const stream = extractPhotostreamModels(rootModel)
  const total = stream?.totalItems || 0
  const perPage = extractPhotos(rootModel).length || 25
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  console.log(`[flickr]   totalItems=${total} perPage=${perPage} pages=${totalPages}`)

  // Dedupe by id. Flickr sometimes returns page 1 for /pageN/ requests
  // past the real last page, which used to produce duplicates.
  const seen = new Map()
  for (const p of extractPhotos(rootModel)) seen.set(p.id, p)

  for (let page = 2; page <= totalPages; page++) {
    const url = `https://www.flickr.com/photos/${USER}/page${page}/`
    console.log(`[flickr]   fetching page ${page}/${totalPages}`)
    const html = await fetchText(url)
    const model = extractModelExport(html)
    if (!model) {
      console.warn(`[flickr]   could not parse page ${page}, stopping`)
      break
    }
    const pagePhotos = extractPhotos(model)
    const before = seen.size
    for (const p of pagePhotos) if (!seen.has(p.id)) seen.set(p.id, p)
    const added = seen.size - before
    console.log(`[flickr]     +${added} new (total ${seen.size})`)
    if (added === 0) {
      console.log('[flickr]   page returned no new photos, stopping')
      break
    }
  }
  return [...seen.values()]
}

function decodeEntities(s) {
  if (!s) return ''
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function matchMeta(html, attr, value) {
  const re = new RegExp(
    `<meta\\s+[^>]*${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`,
    'i',
  )
  const alt = new RegExp(
    `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${value}["']`,
    'i',
  )
  const m = html.match(re) || html.match(alt)
  return m ? decodeEntities(m[1]) : ''
}

async function fetchPhotoDetails(photo) {
  const url = `https://www.flickr.com/photos/${USER}/${photo.id}/`
  const html = await fetchText(url)
  const title =
    matchMeta(html, 'property', 'og:title') ||
    matchMeta(html, 'name', 'title') ||
    'Untitled'
  const keywords =
    matchMeta(html, 'name', 'keywords') ||
    matchMeta(html, 'property', 'og:image:alt')
  const tags = keywords
    ? keywords
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : []
  // Flickr adds trailing " | Flickr" or " | <owner> | Flickr" noise to og:title.
  const cleanTitle = title
    .replace(/\s*\|\s*Flickr\s*$/, '')
    .replace(/\s*\|\s*[^|]+$/, '')
    .trim()
  return { title: cleanTitle || 'Untitled', tags }
}

/** Simple concurrency-limited map. */
async function pMap(items, limit, worker) {
  const out = new Array(items.length)
  let cursor = 0
  const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (true) {
      const i = cursor++
      if (i >= items.length) return
      try {
        out[i] = await worker(items[i], i)
      } catch (err) {
        console.warn(`[flickr]   details failed for #${i}:`, err.message || err)
        out[i] = null
      }
    }
  })
  await Promise.all(runners)
  return out
}

async function main() {
  const streamPhotos = await fetchPhotostream()
  console.log(`[flickr] Photostream scraped: ${streamPhotos.length} photos`)

  console.log(`[flickr] Fetching per-photo details (concurrency=${CONCURRENCY})`)
  const details = await pMap(streamPhotos, CONCURRENCY, async (p) => fetchPhotoDetails(p))

  const merged = streamPhotos.map((p, i) => {
    const det = details[i] || { title: 'Untitled', tags: [] }
    const caption = det.title && det.title !== 'Untitled' ? det.title : undefined
    const countryTags = det.tags.filter((t) => COUNTRY_TAGS.has(t))
    return {
      title: det.title,
      image: p.image,
      link: `https://www.flickr.com/photos/${USER}/${p.id}/`,
      tags: countryTags,
      caption,
      date: (p.dateTaken || '').slice(0, 10) || undefined,
      // Used by the gallery to reserve each photo's space before it loads.
      width: p.width,
      height: p.height,
    }
  })

  merged.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  await mkdir(dirname(OUTPUT), { recursive: true })
  await writeFile(OUTPUT, JSON.stringify(merged, null, 2))
  console.log(`[flickr] Wrote ${merged.length} photos to ${OUTPUT}`)
}

main().catch((err) => {
  console.error('[flickr] Failed:', err.message || err)
  process.exit(1)
})
