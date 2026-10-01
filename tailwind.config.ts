import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

/** Colour token backed by a CSS variable from assets/css/main.css (switches with the theme). */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: v('fg'),
          soft: v('fg-soft'),
          mute: v('fg-mute'),
        },
        paper: {
          DEFAULT: v('bg'),
          soft: v('bg-soft'),
          tint: v('bg-tint'),
        },
        line: {
          DEFAULT: v('border'),
          strong: v('border-strong'),
        },
        accent: {
          DEFAULT: v('accent'),
          soft: v('accent-soft'),
        },
        'on-accent': v('on-accent'),
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Garamond', ...defaultTheme.fontFamily.serif],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      maxWidth: {
        prose: '68ch',
        page: '58rem',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--fg-soft))',
            '--tw-prose-headings': 'rgb(var(--fg))',
            '--tw-prose-links': 'rgb(var(--accent))',
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [],
} satisfies Config
