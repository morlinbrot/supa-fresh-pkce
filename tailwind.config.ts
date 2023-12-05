import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e879f9",
        primaryStrong: "#d946ef",
        primaryLight: "#f0abfc",
      },
    },
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        div: {
          alignItems: "center",
        },
        h1: {
          fontSize: "1.5rem",
          fontWeight: "bold",
        },
        h2: {
          fontSize: "1.5rem",
          fontWeight: "bold",
        },
        p: {
          margin: "8px 0px 8px 0px",
        },
      })
    })
  ],
} satisfies Config;
