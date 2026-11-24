"use client";

import { useEffect, useState } from "react";

export interface CodeProject {
  /** Nome como aparece no índice. */
  title: string;
  /** Tipo, pro atributo da tag. */
  type: string;
  /** Capa pequena que "renderiza" junto com o nome. */
  cover?: string;
}

/** Tempo por caractere digitado e pausa entre terminar a linha e renderizar. */
const CHAR_MS = 9;
const RENDER_DELAY_MS = 110;
const RENDER_MS = 420;
const END_HOLD_MS = 520;

const tagFor = (p: CodeProject) => `<Projeto cliente="${p.title}" tipo="${p.type}" />`;

/**
 * 4 · Código compilando.
 *
 * Cada linha é digitada como tag e, assim que fecha, "renderiza": o código
 * borra e some enquanto o nome do projeto aparece no mesmo lugar, já na
 * tipografia do índice, com a capa entrando ao lado.
 *
 * `step` conta em caracteres ao longo de todas as linhas; uma linha é
 * `typing` enquanto o cursor está nela e `rendered` depois.
 */
export function AberturaCodigo({
  projects,
  onDone,
}: {
  projects: CodeProject[];
  onDone: () => void;
}) {
  const tags = projects.map(tagFor);
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [rendered, setRendered] = useState(0);

  useEffect(() => {
    if (line >= tags.length) {
      const t = window.setTimeout(onDone, RENDER_MS + END_HOLD_MS);
      return () => window.clearTimeout(t);
    }
    if (chars < tags[line].length) {
      // Dois caracteres por passo: digitação de máquina, não de pessoa.
      const t = window.setTimeout(() => setChars((c) => c + 2), CHAR_MS * 2);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setRendered(line + 1);
      setLine(line + 1);
      setChars(0);
    }, RENDER_DELAY_MS);
    return () => window.clearTimeout(t);
    // `tags` é derivado de `projects`, estável durante a abertura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line, chars, onDone]);

  return (
    <div className="ab-layer ab-code">
      <p className="ab-code-file" aria-hidden>
        projetos.tsx
      </p>
      <ol className="ab-code-lines">
        {projects.map((p, i) => {
          const isRendered = i < rendered;
          const isTyping = i === line;
          if (!isRendered && !isTyping) return null;
          return (
            <li key={p.title} className={isRendered ? "ab-code-line is-rendered" : "ab-code-line"}>
              <code className="ab-code-src">
                {isRendered ? tags[i] : tags[i].slice(0, chars)}
                {isTyping && <span className="ab-code-caret" />}
              </code>
              <span className="ab-code-out">
                <span className="ab-code-name">{p.title}</span>
                {p.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt="" className="ab-code-thumb" />
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
