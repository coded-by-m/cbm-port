/**
 * Fonte única das cores da Coded by M.
 *
 * Cada paleta vira variáveis CSS `--cbm-<token>` com canais RGB separados por
 * espaço ("4 8 6"), o formato que o Tailwind precisa para `/<alpha-value>`.
 * O código nunca escreve a cor: usa `cbm("base")` em estilo inline, a classe
 * `cbm-*` no Tailwind ou `paletteHex("base")` onde só um hex serve (three.js).
 *
 * `ACTIVE_PALETTE` é o que o site em produção usa. As outras existem para o
 * /lab/revisao comparar ao vivo — trocar a paleta do site é trocar essa linha.
 */

/**
 * Escada de superfícies, do mais recuado ao mais destacado. A hierarquia
 * importa mais que os valores: `sunken` recua, `raised` destaca.
 */
export const SURFACE_TOKENS = [
  /** Fundo global (body, cena 3D, fog, posts). */
  "page",
  /** Cards de projeto e serviço — recuam em relação à página. */
  "sunken",
  /** Fundo da home e das seções do site. */
  "base",
  /** Fundos secundários e overlays. */
  "surface",
  /** Faixas que destacam como objeto separado. */
  "raised",
  /** Painel do menu drawer. */
  "drawer",
  /** Barra da moldura de browser. */
  "frame-bar",
  /** Corpo da moldura de browser / tela de mockup. */
  "frame",
  /** Cards elevados (serviços da experiência, molduras de case). */
  "card",
  /** Borda padrão, quase invisível. */
  "border",
  /** Borda em hover/ativo. */
  "border-active",
  /** Filetes e contornos visíveis (posts, cards). */
  "line",
] as const;
export const GRAY_TOKENS = [
  "gray-50", "gray-100", "gray-200", "gray-300", "gray-400",
  "gray-500", "gray-600", "gray-700", "gray-800", "gray-900",
] as const;
/** Estados e segundo acento. `accent-2` é para posts e gráficos, nunca ação. */
export const SUPPORT_TOKENS = ["success", "warning", "info", "accent-2"] as const;
/** Iguais em toda paleta: a marca. */
export const FIXED_TOKENS = ["white", "red", "red-dark"] as const;
export const TOKENS = [
  ...SURFACE_TOKENS,
  ...GRAY_TOKENS,
  ...SUPPORT_TOKENS,
  ...FIXED_TOKENS,
] as const;

export type Token = (typeof TOKENS)[number];
export type PaletteId = "atual" | "neutro" | "quente" | "puro";
export interface Palette {
  id: PaletteId;
  label: string;
  note: string;
  colors: Record<Token, string>;
}

const FIXED = { white: "#F5F2ED", red: "#FB3640", "red-dark": "#C42030" } as const;
const SUPPORT = {
  success: "#4CC38A",
  warning: "#F2B33D",
  info: "#5B9BF0",
  "accent-2": "#8FB3C9",
} as const;

const NEUTRAL_GRAYS = {
  "gray-50": "#F2F2F2", "gray-100": "#E5E5E5", "gray-200": "#C9C9C9", "gray-300": "#ADADAD",
  "gray-400": "#8F8F8F", "gray-500": "#737373", "gray-600": "#575757", "gray-700": "#3D3D3D",
  "gray-800": "#262626", "gray-900": "#171717",
} as const;

export const PALETTES: Record<PaletteId, Palette> = {
  atual: {
    id: "atual",
    label: "Atual",
    note: "Produção hoje: preto com viés verde.",
    colors: {
      page: "#000F08", sunken: "#020504", base: "#040806", surface: "#070B08",
      raised: "#070C09", drawer: "#080D0A", "frame-bar": "#070D09", frame: "#0A120C",
      card: "#0E1810", border: "#111511", "border-active": "#1A2418", line: "#1A2A1E",
      "gray-50": "#F0EDE8", "gray-100": "#E8E4DE", "gray-200": "#C8C4BE", "gray-300": "#B4B0AA",
      "gray-400": "#8A8780", "gray-500": "#6E6B66", "gray-600": "#4A4844", "gray-700": "#34332F",
      "gray-800": "#1E1E1A", "gray-900": "#121210",
      ...SUPPORT, ...FIXED,
    },
  },
  neutro: {
    id: "neutro",
    label: "Neutro",
    note: "Quase preto sem matiz; cinzas neutros.",
    colors: {
      page: "#0A0A0A", sunken: "#050505", base: "#0A0A0A", surface: "#0F0F0F",
      raised: "#121212", drawer: "#141414", "frame-bar": "#121212", frame: "#171717",
      card: "#1A1A1A", border: "#1C1C1C", "border-active": "#2A2A2A", line: "#262626",
      ...NEUTRAL_GRAYS, ...SUPPORT, ...FIXED,
    },
  },
  quente: {
    id: "quente",
    label: "Quente",
    note: "Quase preto grafite-marrom; cinzas quentes como o off-white.",
    colors: {
      page: "#0C0B0A", sunken: "#070605", base: "#0C0B0A", surface: "#12100F",
      raised: "#151311", drawer: "#171513", "frame-bar": "#151311", frame: "#1B1917",
      card: "#1E1B18", border: "#1F1C19", "border-active": "#2E2A26", line: "#2A2622",
      "gray-50": "#F0EDE8", "gray-100": "#E8E4DE", "gray-200": "#C8C4BE", "gray-300": "#ABA79F",
      "gray-400": "#8F8B84", "gray-500": "#74716B", "gray-600": "#5A5752", "gray-700": "#403E3A",
      "gray-800": "#292725", "gray-900": "#181716",
      ...SUPPORT, ...FIXED,
    },
  },
  puro: {
    id: "puro",
    label: "Puro",
    note: "#000 no fundo; sunken e base achatam no mesmo preto.",
    colors: {
      page: "#000000", sunken: "#000000", base: "#000000", surface: "#0B0B0B",
      raised: "#0E0E0E", drawer: "#101010", "frame-bar": "#0E0E0E", frame: "#141414",
      card: "#161616", border: "#1A1A1A", "border-active": "#262626", line: "#222222",
      ...NEUTRAL_GRAYS, ...SUPPORT, ...FIXED,
    },
  },
};

export const ACTIVE_PALETTE: PaletteId = "atual";
/** Disparado em `window` quando o lab troca a paleta. `detail` é o PaletteId. */
export const PALETTE_EVENT = "cbm:palette";

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

/** Cor do token para estilo inline. Responde à troca de paleta. */
export function cbm(token: Token, alpha?: number): string {
  return alpha === undefined
    ? `rgb(var(--cbm-${token}))`
    : `rgb(var(--cbm-${token}) / ${alpha})`;
}

/** Bloco `:root{…}` de uma paleta. Injetado no layout raiz. */
export function paletteCss(id: PaletteId): string {
  const c = PALETTES[id].colors;
  return `:root{${TOKENS.map((t) => `--cbm-${t}:${channels(c[t])};`).join("")}}`;
}

/**
 * Hex do token no momento da chamada, para quem não aceita `var()` (three.js).
 * Não reage sozinho à troca: quem usa precisa remontar — o lab remonta a cena.
 */
export function paletteHex(token: Token): string {
  if (typeof document !== "undefined") {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(`--cbm-${token}`)
      .trim();
    const parts = v.split(/\s+/).map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n)))
      return (
        "#" +
        parts
          .map((n) => n.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );
  }
  return PALETTES[ACTIVE_PALETTE].colors[token];
}

/** Sobrescreve as variáveis no <html> (lab). `null` volta à paleta ativa. */
export function applyPalette(id: PaletteId | null): void {
  const root = document.documentElement;
  for (const t of TOKENS) {
    if (id === null) root.style.removeProperty(`--cbm-${t}`);
    else root.style.setProperty(`--cbm-${t}`, channels(PALETTES[id].colors[t]));
  }
  window.dispatchEvent(
    new CustomEvent(PALETTE_EVENT, { detail: id ?? ACTIVE_PALETTE }),
  );
}

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Razão de contraste WCAG entre dois #RRGGBB. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
