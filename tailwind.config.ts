import type { Config } from "tailwindcss";

// Design tokens — "Vale a Pena?"
// Paleta pensada para decisão financeira: neutro de papel, tinta quase-preta,
// verde-esmeralda (vale a pena / positivo), âmbar (atenção / neutro),
// terracota-tijolo (não vale a pena / negativo). Evita o cliché
// creme+terracota e o roxo/laranja já saturados por fintechs brasileiras.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F5F5F2",
          raised: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#12131A",
          soft: "#4B4E5A",
          faint: "#8A8D99",
        },
        line: "#E4E3DD",
        emerald: {
          DEFAULT: "#0F7A5C",
          soft: "#E4F2ED",
          strong: "#0B5C45",
        },
        amber: {
          DEFAULT: "#C98A1F",
          soft: "#FBF0DC",
        },
        brick: {
          DEFAULT: "#B23A2E",
          soft: "#F8E7E4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,19,26,0.04), 0 8px 24px -12px rgba(18,19,26,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
