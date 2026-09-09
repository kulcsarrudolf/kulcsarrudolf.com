import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,md}"],
  theme: {
    // The defaults plus two navbar breakpoints, kept in ascending order so
    // Tailwind emits them in the right cascade order. `socials` is where the
    // call to action, the divider and the social icons fit beside the brand;
    // `nav` is where the whole link list fits and the menu button retires.
    // Both numbers were measured in a browser with Inter loaded, not guessed.
    screens: {
      socials: "546px",
      sm: "640px",
      nav: "706px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4267b2", // the bar, headings and links
          active: "#3b64b8", // the current-page pill, and hover on the bar
          hover: "#365899", // filled buttons on white
        },
        surface: "#e9ebee", // the page behind the cards
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [typography({ target: "modern" })],
};
