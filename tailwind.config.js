/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cinema-dark': '#121212',
        'cinema-red': '#e50914',
        'cinema-text': '#ffffff',
        'cinema-text-muted': '#e0e0e0',
      },
      spacing: {
        // 8px base grid — all spacings are multiples of 8px
        // Tailwind's default spacing scale already follows this (2=8px, 4=16px, 6=24px, etc.)
        // We extend only where defaults don't cover our needs
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
        '68': '17rem',   // 272px (sidebar width)
        '72': '18rem',   // 288px
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cinema-bg': "url('/src/assets/images/Cinema.jpg')",
      },
    },
  },
  plugins: [],
}
