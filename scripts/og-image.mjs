#!/usr/bin/env node
/**
 * Renders scripts/og-image.html to public/og.png (1200×630), the preview image
 * used when the site is shared. Run by hand after editing the HTML:
 *
 *   npm run og:image
 *
 * Needs a local Chrome or Chromium (set CHROME=/path/to/binary if it is not on
 * PATH) and network access for the Google Fonts.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(__dirname, 'og-image.html')
const OUTPUT = resolve(__dirname, '..', 'public', 'og.png')

const candidates = [process.env.CHROME, 'chromium', 'chromium-browser', 'google-chrome-stable', 'google-chrome'].filter(Boolean)
const chrome = candidates.find((bin) => {
  try {
    execFileSync(bin, ['--version'], { stdio: 'ignore' })
    return true
  }
  catch {
    return false
  }
})
if (!chrome) {
  console.error('[og] No Chrome/Chromium found; set CHROME=/path/to/chrome')
  process.exit(1)
}

const profile = mkdtempSync(join(tmpdir(), 'og-chrome-'))
try {
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--allow-file-access-from-files',
    `--user-data-dir=${profile}`,
    '--window-size=1200,630',
    '--virtual-time-budget=5000',
    `--screenshot=${OUTPUT}`,
    pathToFileURL(SOURCE).href,
  ], { stdio: 'ignore' })
}
finally {
  rmSync(profile, { recursive: true, force: true })
}
console.log(`[og] Wrote ${OUTPUT}`)
