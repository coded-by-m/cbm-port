// Detector de cor escrita direto no código com viés verde.
//
// As cores vêm de lib/palette.ts (variáveis --cbm-*). Um literal escuro
// esverdeado no código é cor que não acompanha a troca de paleta — sobra do
// tempo em que a base era "preto com temperatura verde".
//
// Uso: node scripts/check-green.mjs   (sai com 1 se encontrar algo)
//
// Fora da busca: app/ui-lab (vitrine antiga, o "antes") e lib/palette.ts (a
// fonte declarada, onde a paleta "atual" ainda guarda os verdes de produção).
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["app", "components", "lib", "hooks", ".design-sync"];
const SKIP_DIRS = new Set(["node_modules", ".next", "ds-package", "ui-lab"]);
const SKIP_FILES = new Set([path.join("lib", "palette.ts")]);
const EXT = /\.(tsx?|css|mjs|glsl)$/;
const COLOR = /#([0-9a-fA-F]{6})\b|0x([0-9a-fA-F]{6})\b|rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g;

const files = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p);
    } else if (EXT.test(e.name) && !SKIP_FILES.has(p)) files.push(p);
  }
};
ROOTS.forEach(walk);

const hits = [];
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const m of line.matchAll(COLOR)) {
      const hex = m[1] || m[2];
      const [r, g, b] = hex
        ? [0, 2, 4].map((o) => parseInt(hex.slice(o, o + 2), 16))
        : [+m[3], +m[4], +m[5]];
      if (g > r && g >= b && Math.max(r, g, b) < 120)
        hits.push(`${file}:${i + 1}  ${m[0]}`);
    }
  });
}

if (hits.length) {
  console.log(hits.join("\n"));
  console.log(`\n${hits.length} cor(es) verde(s) escrita(s) direto no código.`);
  process.exit(1);
}
console.log("Nenhuma cor verde escrita direto no código.");
