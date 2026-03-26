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
        // ── Dark backgrounds ──────────────────────────────
        bg: {
          DEFAULT: '#05090C',
          surface: '#0D1520',
          card:    '#101B2A',
          hover:   '#162030',
        },
        // ── Primary green (neon) ─────────────────────────
        primary: {
          50:  '#E8FFF4',
          100: '#C2FFE1',
          200: '#85FFCA',
          300: '#3DFFB0',
          400: '#00F082',
          500: '#00E676',
          600: '#00C853',
          700: '#00A040',
          800: '#007A30',
          900: '#005520',
          950: '#002E10',
        },
        // ── Accent teal / cyan ───────────────────────────
        teal: {
          400: '#26D7D7',
          500: '#00BFA5',
          600: '#00897B',
        },
        // ── Border & dividers ────────────────────────────
        border: {
          DEFAULT: '#1A2840',
          light:   '#243550',
        },
        // ── Text ────────────────────────────────────────
        content: {
          primary: '#F0F4F8',
          muted:   '#7A8FA8',
          subtle:  '#4A5E72',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:      '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(26,40,64,0.8)',
        'card-hover': '0 4px 20px rgba(0,230,118,0.08), 0 0 0 1px rgba(0,230,118,0.2)',
        glow:      '0 0 20px rgba(0,230,118,0.3)',
        'glow-sm': '0 0 10px rgba(0,230,118,0.2)',
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #00E676 0%, #00B8D4 100%)',
        'gradient-dark':  'linear-gradient(135deg, #0D1520 0%, #05090C 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(16,27,42,0.9) 0%, rgba(13,21,32,0.9) 100%)',
        'wave-green':     'radial-gradient(ellipse at top, rgba(0,230,118,0.15) 0%, transparent 60%)',
        'wave-teal':      'radial-gradient(ellipse at bottom right, rgba(0,184,212,0.1) 0%, transparent 50%)',
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
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,230,118,0.2)' },
          '50%':      { boxShadow: '0 0 25px rgba(0,230,118,0.5)' },
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
