import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
          hi: 'rgb(var(--c-surface-hi) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--c-line) / <alpha-value>)',
          hi: 'rgb(var(--c-line-hi) / <alpha-value>)',
        },
        fg: {
          DEFAULT: 'rgb(var(--c-fg) / <alpha-value>)',
          muted: 'rgb(var(--c-fg-muted) / <alpha-value>)',
          faint: 'rgb(var(--c-fg-faint) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          text: 'rgb(var(--c-accent-text) / <alpha-value>)',
          deep: 'rgb(var(--c-accent-deep) / <alpha-value>)',
          ink: 'rgb(var(--c-accent-ink) / <alpha-value>)',
        },
        status: {
          saved: 'rgb(var(--s-saved) / <alpha-value>)',
          applied: 'rgb(var(--s-applied) / <alpha-value>)',
          interview: 'rgb(var(--s-interview) / <alpha-value>)',
          offer: 'rgb(var(--s-offer) / <alpha-value>)',
          rejected: 'rgb(var(--s-rejected) / <alpha-value>)',
        },
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        warning: 'rgb(var(--c-warning) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.18)',
        card: '0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 8px 24px -12px rgb(0 0 0 / 0.5)',
        pop: '0 24px 48px -16px rgb(0 0 0 / 0.55), 0 2px 8px -2px rgb(0 0 0 / 0.4)',
        glow: '0 0 0 1px rgb(var(--c-accent) / 0.35), 0 8px 32px -8px rgb(var(--c-accent) / 0.4)',
        'glow-sm': '0 0 24px -6px rgb(var(--c-accent) / 0.45)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(3%,-4%,0) scale(1.12)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { opacity: '0.5', transform: 'scale(0.9)' },
          '70%, 100%': { opacity: '0', transform: 'scale(1.6)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 0.32s cubic-bezier(0.22,1,0.36,1) both',
        aurora: 'aurora 22s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [animate],
};
