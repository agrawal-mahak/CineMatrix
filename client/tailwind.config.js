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
          primary: "#0B0F19",
          secondary: "#161F30",
          tertiary: "#1F293D",
        },
        brand: {
          primary: "#E50914",
          accent: "#6366F1",
          hover: "#DC2626",
        },
        seat: {
          standard: "#334155",
          premium: "#0284C7",
          selected: "#10B981",
          locked: "#F59E0B",
          booked: "#1E293B",
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        seat: '6px',
        badge: '6px',
        card: '12px',
        pill: '100px',
      },
    },
  },
  plugins: [],
}
