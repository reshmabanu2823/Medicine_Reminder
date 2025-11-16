/**
 * tailwind.config.js for custom medical dark theme
 */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional, medical, dark theme palette
        background: {
          DEFAULT: '#101624', // deep blue-black
          dark: '#0a0e17',
        },
        card: {
          DEFAULT: '#182032',
          dark: '#121826',
        },
        primary: {
          DEFAULT: '#3B82F6', // medical blue
          dark: '#2563EB',
        },
        accent: {
          DEFAULT: '#22d3ee', // cyan accent
          dark: '#06b6d4',
        },
        success: {
          DEFAULT: '#22c55e',
          dark: '#15803d',
        },
        warning: {
          DEFAULT: '#facc15',
          dark: '#ca8a04',
        },
        error: {
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        border: {
          DEFAULT: '#1e293b',
          dark: '#334155',
        },
        muted: {
          DEFAULT: '#64748b',
          dark: '#94a3b8',
        },
        foreground: {
          DEFAULT: '#f1f5f9',
          dark: '#e0e7ef',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
};
