/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#51bae7",
        "primary-dark": "#2bb8f5",
        "primary-light": "#91d9f7",
        "primary-extra-light": "#f0fbff",
        "primary-hover": "#61c7f2",
        secondary: "#ffffff",
        "secondary-dark": "#4e4e4e",
        success: "#5cbf54",
        danger: "#f44336",
      },
      maxWidth: {
        "7xl": "80rem",
      },
      animation: {
        borderAnimation: "borderMove 3s linear infinite",
        borderGlow: "glowEffect 2s ease-in-out infinite",
      },
      keyframes: {
        borderMove: {
          "0%": { borderColor: "purple" },
          "50%": { borderColor: "blue" },
          "100%": { borderColor: "pink" },
        },
        glowEffect: {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 1 },
        },
      },
    },
    screens: {
      xsm: "380px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1580px",
    },
  },
  plugins: [
    function ({ addVariant, addUtilities }) {
      addVariant("not-hover", "&:not(:hover)");
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": { display: "none" },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
};
