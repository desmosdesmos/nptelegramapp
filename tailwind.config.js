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
          DEFAULT: 'var(--glass-bg)',
          'border': 'var(--glass-border-color)',
          'border-selected': 'var(--glass-selected-border-color)',
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
      },
      backdropBlur: {
        'xl': 'var(--glass-backdrop-blur)',
      }
    },
  },
  plugins: [],
}
