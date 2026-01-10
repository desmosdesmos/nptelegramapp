/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark-primary': 'var(--bg-dark-primary)',
        'bg-dark-secondary': 'var(--bg-dark-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          'border': 'rgba(255, 255, 255, 0.1)',
          'border-selected': 'rgba(0, 162, 255, 0.8)',
          'card-bg': 'rgba(255, 255, 255, 0.05)',
          'card-border': 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': 'var(--base-border-radius)',
        'xl': 'calc(var(--base-border-radius) - 4px)',
        'lg': 'calc(var(--base-border-radius) - 8px)',
        'full': '9999px',
      },
      boxShadow: {
        'glow': '0 0 20px 5px var(--shadow-color)',
        'glow-sm': '0 0 10px 2px var(--shadow-color)',
        'primary-button-glow': '0 10px 25px rgba(139, 92, 246, 0.4)', // New shadow
      },
      backgroundImage: {
        'gradient-primary-button': 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)', // New gradient
      },
      backdropBlur: {
        'xl': 'var(--glass-backdrop-blur)',
      }
    },
  },
  plugins: [],
}
