// Compila o CSS real do site para um arquivo estatico que o conversor do
// design-sync consegue consumir (cfg.cssEntry).
//
// Por que existe: app/globals.css nao e CSS pronto — tem diretivas @tailwind e
// urls absolutas de fonte (/fonts/...), que so o servidor do Next resolve. O
// agente de design recebe apenas o fecho de @import do styles.css, entao o CSS
// precisa chegar la ja compilado e com caminhos relativos.
//
// Sem drift do tailwind.config.ts: ele e transpilado, nao reescrito.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const CACHE = join(HERE, ".cache");
const PKG = join(HERE, "ds-package");
mkdirSync(CACHE, { recursive: true });
mkdirSync(PKG, { recursive: true });

// 1. Config do sync: mesmo theme do repo (importado, nunca reescrito — e o que
//    garante zero drift), com o content acrescido dos previews autorados.
//    Fica em TypeScript porque o loader do Tailwind 3.4 le .ts nativamente.
writeFileSync(
  join(CACHE, "tw.sync.ts"),
  `import base from "../../tailwind.config";

export default {
  ...base,
  content: [
    ${JSON.stringify(join(ROOT, "components/**/*.{js,ts,jsx,tsx,mdx}").replace(/\\/g, "/"))},
    ${JSON.stringify(join(ROOT, "app/**/*.{js,ts,jsx,tsx,mdx}").replace(/\\/g, "/"))},
    ${JSON.stringify(join(HERE, "previews/**/*.{ts,tsx}").replace(/\\/g, "/"))},
  ],
};
`,
);

// 3. globals.css sem os @font-face — as fontes entram por cfg.extraFonts, que e
//    quem copia os .woff2 para fonts/ e reescreve os caminhos.
const globals = readFileSync(join(ROOT, "app/globals.css"), "utf8");
const src = globals.replace(/@font-face\s*\{[^}]*\}\s*/g, "");
writeFileSync(join(CACHE, "globals.src.css"), src);

// 4. Compila.
execFileSync(
  process.execPath,
  [
    join(ROOT, "node_modules/tailwindcss/lib/cli.js"),
    "-c", join(CACHE, "tw.sync.ts"),
    "-i", join(CACHE, "globals.src.css"),
    "-o", join(PKG, "styles.css"),
  ],
  { stdio: "inherit", cwd: ROOT },
);

// 5. Caminhos absolutos do Next (/fonts, /cases) nao existem no bundle: o
//    conversor emite tudo na raiz do projeto, entao viram relativos.
const out = join(PKG, "styles.css");
let css = readFileSync(out, "utf8").replace(/url\((['"]?)\/(fonts|cases)\//g, "url($1./$2/");

// 6. A base escura, com especificidade que sobrevive.
//
//    O sistema inteiro pressupoe fundo profundo: os componentes escrevem em
//    #F5F2ED e quase nenhum pinta o proprio fundo. app/globals.css ja diz isso
//    em `body { background: #000F08 }`, mas o template do card de preview emite
//    `body{background:#fff}` num <style> depois do stylesheet — e vence por
//    ordem. `html body` vence por especificidade, sem precisar de !important.
//
//    Isto nao e maquiagem de preview: e a superficie real do design system, e
//    vale igual para qualquer design que o agente montar com ele.
css += `
html body { background: #000F08; color: #F5F2ED; font-family: "Satoshi", system-ui, -apple-system, sans-serif; }
html body:has(.site-home) { background: #040806; }
`;
writeFileSync(out, css);

console.error(`[css] ${out} — ${(css.length / 1024).toFixed(1)} KB`);
