import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5aacd6',
          dark: '#204668',
          light: '#d6eaf5'
        },
        neutral: {
          DEFAULT: '#334155',
          soft: '#64748B',
          border: '#E2E8F0',
          background: '#F8FAFC',
          card: '#FFFFFF'
        },
        success: '#10B981',
        danger: '#EF4444'
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 15px 35px rgba(15, 23, 42, 0.08)',
        subtle: '0 8px 20px rgba(15, 23, 42, 0.05)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/line-clamp')
  ]
};

export default config;
