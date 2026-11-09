/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#142B45',
          dark: '#0C1C2E',
          light: '#1F3F66',
          50: '#F0F4F8',
          100: '#D9E3ED',
          200: '#B3C8DC',
          300: '#8DACCB',
          400: '#5A86B2',
          500: '#2E6195',
          600: '#1F4770',
          700: '#142B45',
          800: '#0E1E31',
          900: '#08111C',
        },
        civic: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
        },
        teal: {
          DEFAULT: '#0F9D91',
          50: '#F0FDFB',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0F9D91',
          600: '#0D857B',
          700: '#0F6C64',
          800: '#11534E',
          900: '#134440',
        },
        background: {
          light: '#F6F8FA',
          dark: '#0B1320',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#131E30',
        },
        card: {
          light: '#FFFFFF',
          dark: '#172438',
        },
        border: {
          light: '#E2E8F0',
          dark: '#22344D',
        },
        content: {
          DEFAULT: '#172B3A',
          dark: '#F1F5F9',
        },
        muted: {
          DEFAULT: '#64748B',
          dark: '#94A3B8',
        },
        status: {
          pending: '#F59E0B',
          acknowledged: '#3B82F6',
          in_progress: '#8B5CF6',
          resolved: '#10B981',
          rejected: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'card': '0 10px 15px -3px rgba(15, 23, 42, 0.05), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
        'card-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
