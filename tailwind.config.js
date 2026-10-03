/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#06060A',
          900: '#06060A',
          800: '#0D0D14',
          700: '#15151F',
          600: '#22222F',
        },
        chalk: {
          DEFAULT: '#F4F1EA',
          dim: '#9895A6',
          faint: '#55536180',
        },
        ember: '#FF5A1F',
        ion: '#8B6CFF',
        mint: '#3DF5B5',
      },
      fontFamily: {
        display: ['"Syne Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        mega: ['clamp(3.4rem, 12.5vw, 15rem)', { lineHeight: '0.84', letterSpacing: '-0.04em' }],
        giant: ['clamp(2rem, 9vw, 9rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        huge: ['clamp(1.9rem, 5.6vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        big: ['clamp(1.5rem, 3vw, 2.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        label: ['0.72rem', { lineHeight: '1.2', letterSpacing: '0.16em' }],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
