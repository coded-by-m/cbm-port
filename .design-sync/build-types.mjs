// Emite uma arvore .d.ts real a partir do codigo do site.
//
// O conversor do design-sync extrai o contrato de props (<Name>Props, que e o
// que o agente de design le) com ts-morph, e o projeto dele so enxerga .d.ts.
// O cbm-port e um app Next com "noEmit": true — sem uma arvore de tipos, todo
// componente saia com `[key: string]: unknown`, ou seja, sem contrato nenhum.
//
// Saida em .design-sync/ds-package/, que tem package.json proprio: e o diretorio
// que o conversor enxerga como "o pacote", isolado do app.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PKG = join(HERE, "ds-package");
const TYPES = join(PKG, "types");

rmSync(TYPES, { recursive: true, force: true });
mkdirSync(TYPES, { recursive: true });

// O barrel do pacote sintetico. Ele existe so para que o conversor, ao subir a
// partir do --entry procurando um package.json com nome, pare AQUI e nao na
// raiz do repo: e isso que faz PKG_DIR ser este diretorio isolado, com entry de
// tipos proprio. O conteudo real continua em .design-sync/entry.tsx.
writeFileSync(join(PKG, "entry.tsx"), 'export * from "../entry";\n');

// tsconfig de emissao: mesmas paths do sync (shims incluidos), so declaracoes.
const tsconfig = join(HERE, ".cache", "tsconfig.types.json");
mkdirSync(dirname(tsconfig), { recursive: true });
writeFileSync(
  tsconfig,
  JSON.stringify(
    {
      extends: resolve(HERE, "tsconfig.sync.json").replace(/\\/g, "/"),
      compilerOptions: {
        noEmit: false,
        declaration: true,
        emitDeclarationOnly: true,
        declarationMap: false,
        skipLibCheck: true,
        strict: false,
        rootDir: ROOT.replace(/\\/g, "/"),
        outDir: TYPES.replace(/\\/g, "/"),
      },
      include: [
        join(HERE, "entry.tsx").replace(/\\/g, "/"),
        join(PKG, "entry.tsx").replace(/\\/g, "/"),
        join(HERE, "shims/**/*").replace(/\\/g, "/"),
        join(ROOT, "components/**/*").replace(/\\/g, "/"),
        join(ROOT, "lib/**/*").replace(/\\/g, "/"),
        join(ROOT, "data/**/*").replace(/\\/g, "/"),
        join(ROOT, "types/**/*").replace(/\\/g, "/"),
      ],
    },
    null,
    2,
  ),
);

// tsc sai != 0 em erro de tipo mesmo tendo emitido o que interessa; o que
// importa aqui e a arvore .d.ts, entao o resultado e checado pela emissao.
try {
  execFileSync(
    process.execPath,
    [join(ROOT, "node_modules/typescript/lib/tsc.js"), "-p", tsconfig],
    { stdio: "inherit", cwd: ROOT },
  );
} catch {
  console.error("[types] tsc reportou erros de tipo — seguindo com o que foi emitido");
}

// package.json do pacote sintetico: e daqui que o conversor tira PKG_DIR, o
// nome e, sobretudo, o entry de tipos.
writeFileSync(
  join(PKG, "package.json"),
  JSON.stringify(
    {
      name: "coded-by-m",
      version: "0.1.0",
      private: true,
      types: "types/.design-sync/ds-package/entry.d.ts",
    },
    null,
    2,
  ) + "\n",
);

console.error(`[types] ${TYPES}`);
