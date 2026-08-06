import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        /* --- The palette. Each colour has exactly one job. --- */
        blush: '#FEDCE0', // page base / hero
        petal: '#F6B7D7', // soft fills behind imagery
        rose: '#DF6FA1', // accent — buttons, pills, the one saturated note
        paper: '#F2F1EF', // projects band, so thumbnails read cleanly
        cream: '#fafafa', // footer
        shell: '#F5C7CF', // about band

        /* --- The one addition: nothing in the palette is dark enough to
               read as body text, so everything sets in a deep plum drawn
               from the rose's own hue. --- */
        plum: '#3E2230',
        'plum-muted': 'rgba(62, 34, 48, 0.62)',
        'plum-faint': 'rgba(62, 34, 48, 0.40)',
        hairline: 'rgba(62, 34, 48, 0.14)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* Editorial display scale — clamped so nothing ever overflows */
        'display-xl': ['clamp(4.5rem, 19vw, 20rem)', { lineHeight: '0.82', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(3.25rem, 12vw, 11rem)', { lineHeight: '0.86', letterSpacing: '-0.005em' }],
        'display-md': ['clamp(2.5rem, 7vw, 6rem)', { lineHeight: '0.9' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.32em' }],
      },
      spacing: {
        gutter: 'clamp(1.25rem, 5vw, 5.5rem)',
        section: 'clamp(6rem, 14vh, 11rem)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        blink: {
          '0%, 45%': { opacity: '1' },
          '50%, 95%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        blink: 'blink 1.1s steps(1, end) infinite',
        drift: 'drift 7s cubic-bezier(0.45, 0, 0.55, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
