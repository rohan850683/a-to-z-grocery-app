/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#eaf6f1',
          100: '#cdead9',
          200: '#9ad6b5',
          300: '#63bd8f',
          400: '#379c6d',
          500: '#0F6E51', // primary brand green
          600: '#0c5c43',
          700: '#0a4b37',
          800: '#08392a',
          900: '#062a1f',
        },
        mango: {
          50: '#fff8e6',
          100: '#ffedbf',
          200: '#ffdd85',
          300: '#ffc94a',
          400: '#ffb100', // primary CTA amber
          500: '#e69e00',
          600: '#b87e00',
        },
        chili: {
          400: '#ef6a5c',
          500: '#E1473A', // offers / accent red
          600: '#c23327',
        },
        cream: '#FAFAF7',
        mint: '#F1F7F3',
        ink: '#1C2B24',
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        blob: '30% 70% 70% 30% / 30% 30% 70% 70%',
      },
      boxShadow: {
        card: '0 4px 20px -4px rgba(15,110,81,0.15)',
        cardHover: '0 12px 30px -6px rgba(15,110,81,0.25)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,177,0,0.6)' },
          '100%': { boxShadow: '0 0 0 16px rgba(255,177,0,0)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        floaty: 'floaty 3.5s ease-in-out infinite',
        marquee: 'marquee 22s linear infinite',
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
