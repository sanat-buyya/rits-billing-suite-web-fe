/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "3rem", 
        xl: "4rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        // 2xl: "1536px",
      },
    },
    extend: {
      // colors: {
      //   primary: {
      //     DEFAULT: "#2563eb", // blue-600
      //     light: "#3b82f6", // blue-500
      //     dark: "#1e40af", // blue-800
      //   },
      //   secondary: {
      //     DEFAULT: "#14b8a6", // teal-500
      //     light: "#2dd4bf",
      //     dark: "#0f766e",
      //   },
      //   accent: {
      //     DEFAULT: "#f59e0b", // amber-500
      //     light: "#fbbf24",
      //     dark: "#b45309",
      //   },
      //   background: "#f9fafb", // neutral background
      //   surface: "#ffffff", // card or container
      //   muted: "#6b7280", // gray-500
      //   danger: "#ef4444", // red-500
      //   success: "#22c55e", // green-500
      // },
    },
  },
  plugins: [],
};
 
 