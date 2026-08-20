/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: "#090D16",
          secondary: "#121824",
          tertiary: "#1C2536",
        },
        brand: {
          primary: "#E50914",
          accent: "#E50914",
          hover: "#C10711",
          gold: "#F59E0B",
        },
        seat: {
          standard: "#2D3748",
          premium: "#1E40AF",
          selected: "#10B981",
          locked: "#F59E0B",
          booked: "#1A202C",
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        seat: '6px',
        badge: '6px',
        card: '16px',
        pill: '100px',
      },
    },
  },
  plugins: [],
}
