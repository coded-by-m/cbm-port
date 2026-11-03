import type { Config } from "tailwindcss";
import { TOKENS } from "./lib/palette";

// Toda cor `cbm-*` lê a variável da paleta ativa (lib/palette.ts), injetada no
// layout raiz. Canais RGB soltos para o Tailwind aceitar `/<alpha-value>`.
const v = (t: string) => `rgb(var(--cbm-${t}) / <alpha-value>)`;
const cbm: Record<string, string | Record<string, string>> = Object.fromEntries(
  TOKENS.filter((t) => !t.startsWith("gray-")).map((t) => [t, v(t)]),
);
cbm.gray = Object.fromEntries(
  TOKENS.filter((t) => t.startsWith("gray-")).map((t) => [t.slice(5), v(t)]),
);
cbm.black = v("page"); // alias legado, sai na troca das cores fixas
cbm.forest = v("surface"); // alias legado, sai na troca das cores fixas

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cbm,
      },
      fontFamily: {
        display: ["Panchang", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
