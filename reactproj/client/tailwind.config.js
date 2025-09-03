/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "greenpact-green": "#8BC34A", // Main green from logo
        "greenpact-green-dark": "#689F38", // Darker green for backgrounds/accents
        "greenpact-green-light": "#AED581", // Lighter green for backgrounds/gradients
        "greenpact-green-lighter": "#C5E1A5", // Even lighter green
        "greenpact-orange": "#FF7043", // Main orange from logo
        "greenpact-orange-dark": "#F4511E", // Darker orange for hover/active
        "greenpact-text": "#212121", // Dark text color, similar to logo text
      },
      keyframes: {
        // Your existing keyframes (if any)
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Add typewriter if you don't have it for the hero text
        typewriter: {
          to: {
            left: "100%",
          },
        },
        blink: {
          "0%": {
            "background-color": "transparent",
          },
          "49%": {
            "background-color": "transparent",
          },
          "50%": {
            "background-color": "currentColor",
          },
          "99%": {
            "background-color": "currentColor",
          },
          "100%": {
            "background-color": "transparent",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
        fadeInScale: "fadeInScale 0.8s ease-out forwards",
        slideInUp: "slideInUp 0.6s ease-out forwards",
        // Add typewriter animation
        typewriter:
          "typewriter 4s steps(44) 1s forwards, blink 1s steps(44) infinite",
      },
      // You can also add custom font families here if you have specific brand fonts
      // fontFamily: {
      //   sans: ['YourBrandFont', 'sans-serif'],
      // },
    },
  },
  plugins: [],
};
