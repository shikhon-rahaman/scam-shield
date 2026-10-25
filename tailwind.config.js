/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // respects prefers-color-scheme
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          subtle: 'var(--color-surface-subtle)',
          hover: 'var(--color-surface-hover)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
        },
        ink: {
          DEFAULT: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          dim: 'var(--color-text-dim)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          subtle: 'var(--color-primary-subtle)',
          text: 'var(--color-primary-text)',
        },
        verdict: {
          scam: {
            DEFAULT: 'var(--color-verdict-scam)',
            subtle: 'var(--color-verdict-scam-subtle)',
            border: 'var(--color-verdict-scam-border)',
            text: 'var(--color-verdict-scam-text)',
          },
          suspicious: {
            DEFAULT: 'var(--color-verdict-suspicious)',
            subtle: 'var(--color-verdict-suspicious-subtle)',
            border: 'var(--color-verdict-suspicious-border)',
            text: 'var(--color-verdict-suspicious-text)',
          },
          fine: {
            DEFAULT: 'var(--color-verdict-fine)',
            subtle: 'var(--color-verdict-fine-subtle)',
            border: 'var(--color-verdict-fine-border)',
            text: 'var(--color-verdict-fine-text)',
          },
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      fontSize: {
        // High readability scale: body 18px minimum
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }], // 56px
        'display': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],   // 44px
        'heading-xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }], // 36px
        'heading-lg': ['1.75rem', { lineHeight: '1.25' }],                          // 28px
        'heading-md': ['1.375rem', { lineHeight: '1.35' }],                         // 22px
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],                              // 20px
        'body': ['1.125rem', { lineHeight: '1.65' }],                               // 18px (minimum standard)
        'caption': ['0.9375rem', { lineHeight: '1.5' }],                            // 15px
      },
      maxWidth: {
        'shield': '720px',
      },
      borderRadius: {
        'card-sm': '16px',
        'card': '20px',
        'card-lg': '24px',
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'card': 'var(--shadow-card)',
        'elevated': 'var(--shadow-elevated)',
      },
      transitionTimingFunction: {
        'protective': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '250ms',
      },
    },
  },
  plugins: [],
}
