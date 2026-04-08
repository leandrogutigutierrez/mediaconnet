import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark navy backgrounds (USC-toned) ────────────
        bg: {
          DEFAULT: '#030A14',
          surface: '#071828',
          card:    '#0B1F34',
          hover:   '#0F2843',
        },
        // ── Primary: USC Gold ────────────────────────────
        primary: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5B800',   // ← USC Gold principal
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        // ── USC Institutional Blue ───────────────────────
        usc: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#1D6FD8',   // ← USC Blue medio
          600: '#1565C0',
          700: '#003087',   // ← USC Blue institucional
          800: '#00205B',   // ← USC Navy
          900: '#001440',
          950: '#000C28',
        },
        // ── Border & dividers ────────────────────────────
        border: {
          DEFAULT: '#0F2843',
          light:   '#163358',
        },
        // ── Text ────────────────────────────────────────
        content: {
          primary: '#EFF6FF',
          muted:   '#6B8BAE',
          subtle:  '#3D5A78',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:         '0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(15,40,67,0.9)',
        'card-hover': '0 4px 20px rgba(245,184,0,0.1), 0 0 0 1px rgba(245,184,0,0.25)',
        glow:         '0 0 22px rgba(245,184,0,0.35)',
        'glow-sm':    '0 0 10px rgba(245,184,0,0.2)',
        'glow-blue':  '0 0 18px rgba(29,111,216,0.4)',
      },
      backgroundImage: {
        'gradient-gold':  'linear-gradient(135deg, #F5B800 0%, #FBBF24 100%)',
        'gradient-dark':  'linear-gradient(135deg, #071828 0%, #030A14 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(11,31,52,0.9) 0%, rgba(7,24,40,0.9) 100%)',
        'wave-gold':      'radial-gradient(ellipse at top, rgba(245,184,0,0.12) 0%, transparent 60%)',
        'wave-blue':      'radial-gradient(ellipse at bottom right, rgba(29,111,216,0.1) 0%, transparent 50%)',
        'gradient-usc':   'linear-gradient(135deg, #00205B 0%, #003087 50%, #1D6FD8 100%)',
      },
      animation: {
        'fade-in':   'fadeIn 0.25s ease-out',
        'slide-up':  'slideUp 0.3s ease-out',
        'pulse-glow':'pulseGlow 2s ease-in-out infinite',
        'float':     'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(245,184,0,0.2)' },
          '50%':      { boxShadow: '0 0 25px rgba(245,184,0,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
