import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#1a5c38',
          dark: '#0f3d24',
        },
        oat: {
          DEFAULT: '#f0ede4',
          dark: '#e4dfd4',
        },
        butter: '#e8e4c0',
        matcha: '#8eaf5a',
        ink: '#1a1a1a',
        mid: '#5c5c5c',
        line: '#d4cfc6',
        silver: '#8a9299',
        bronze: '#a0673a',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1060px',
      },
    },
  },
  plugins: [],
}

export default config
