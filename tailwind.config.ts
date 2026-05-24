import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── Colours ────────────────────────────────────── */
      colors: {
        navy: {
          50: '#eef2ff',
          100: '#dbe4ff',
          200: '#bfcfff',
          300: '#93aeff',
          400: '#6585fc',
          500: '#3f5bf7',
          600: '#2a3aed',
          700: '#2029d9',
          800: '#1e23b0',
          900: '#1e248b',
          950: '#0C1120',
        },
        accent: {
          indigo: '#6366f1',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          pink: '#ec4899',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          'light-hover': 'rgba(255, 255, 255, 0.08)',
          'light-active': 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.12)',
          /* Light-mode glass */
          'dark': 'rgba(255, 255, 255, 0.7)',
          'dark-hover': 'rgba(255, 255, 255, 0.85)',
          'dark-border': 'rgba(0, 0, 0, 0.08)',
          'dark-border-hover': 'rgba(0, 0, 0, 0.12)',
        },
      },

      /* ── Typography ─────────────────────────────────── */
      fontFamily: {
        heading: [
          'Space Grotesk',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },

      /* ── Animations ─────────────────────────────────── */
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.6s ease-out both',
        'slide-down': 'slideDown 0.6s ease-out both',
        'slide-left': 'slideLeft 0.6s ease-out both',
        'slide-right': 'slideRight 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease-in-out infinite',
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow:
              '0 0 8px rgba(99,102,241,0.4), 0 0 24px rgba(99,102,241,0.15)',
          },
          '50%': {
            boxShadow:
              '0 0 16px rgba(99,102,241,0.6), 0 0 48px rgba(99,102,241,0.3)',
          },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      /* ── Background Images / Gradients ──────────────── */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-accent':
          'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'gradient-accent-wide':
          'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
        'gradient-dark':
          'linear-gradient(180deg, #0C1120 0%, #0a0f1a 100%)',
        'gradient-glow':
          'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
        'gradient-mesh':
          'radial-gradient(at 40% 20%, rgba(99,102,241,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6,182,212,0.08) 0px, transparent 50%)',
      },

      /* ── Backdrop Blur ──────────────────────────────── */
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },

      /* ── Box Shadow ─────────────────────────────────── */
      boxShadow: {
        glow: '0 0 20px rgba(99,102,241,0.15)',
        'glow-md': '0 0 30px rgba(99,102,241,0.2)',
        'glow-lg': '0 0 40px rgba(99,102,241,0.25)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.2)',
        'inner-glow': 'inset 0 0 20px rgba(99,102,241,0.08)',
      },

      /* ── Spacing / Sizing ───────────────────────────── */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      /* ── Z-Index ────────────────────────────────────── */
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      /* ── Border Radius ──────────────────────────────── */
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      /* ── Transition Timing ──────────────────────────── */
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};

export default config;
