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
          DEFAULT: '#183B3A',
          dark: '#122C2B',
          light: '#2A6763',
          50: '#F2F6F5',
          100: '#E1ECEB',
          200: '#C3D8D6',
          300: '#96BCB9',
          400: '#5E9793',
          500: '#3B8278',
          600: '#2A6763',
          700: '#225350',
          800: '#183B3A',
          900: '#122C2B',
          950: '#0A1B1A',
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
          DEFAULT: '#3B8278',
          50: '#F0FDFB',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#3B8278',
          600: '#2A6763',
          700: '#183B3A',
          800: '#122C2B',
          900: '#0A1B1A',
        },
        background: {
          light: '#FAFAF7',
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
          light: '#E5E8E4',
          dark: '#22344D',
        },
        content: {
          DEFAULT: '#202B2A',
          dark: '#F1F5F9',
        },
        muted: {
          DEFAULT: '#66736F',
          dark: '#94A3B8',
        },
        status: {
          filed: '#64748B',
          acknowledged: '#2563EB',
          in_progress: '#B7791F',
          resolved: '#23845B',
          rejected: '#C34B4B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Manrope', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(24, 59, 58, 0.04)',
        'elevated': '0 4px 6px -1px rgba(24, 59, 58, 0.06), 0 2px 4px -2px rgba(24, 59, 58, 0.04)',
        'card': '0 1px 3px 0 rgba(24, 59, 58, 0.05), 0 1px 2px -1px rgba(24, 59, 58, 0.05)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
