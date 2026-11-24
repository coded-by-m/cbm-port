"use client";

import { useEffect, useState } from "react";

/** Duração de cada quadro. Curto de propósito: é corte, não transição. */
const FRAME_BRAND_MS = 380;
const FRAME_NAMES_MS = 460;

/**
 * 3 · Corte de cinema.
 *
 * Dois quadros e um corte seco: a marca em preto, os três clientes reais em
 * tipografia gigante sobre o claro, e a página. Sem fade em nenhum ponto.
 *
 * No corte final o celular vibra (Vibration API, só Android). O navegador só
 * libera a vibração depois de um toque na página: chegando direto pelo QR,
 * sem gesto, ela é ignorada em silêncio.
 */
export function AberturaCorte({ names, onDone }: { names: string[]; onDone: () => void }) {
  const [frame, setFrame] = useState<0 | 1>(0);

  useEffect(() => {
    const a = window.setTimeout(() => setFrame(1), FRAME_BRAND_MS);
    const b = window.setTimeout(() => {
      try {
        navigator.vibrate?.(18);
      } catch {
        // Sem suporte ou bloqueado: o corte acontece igual.
      }
      onDone();
    }, FRAME_BRAND_MS + FRAME_NAMES_MS);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [onDone]);

  return frame === 0 ? (
    <div className="ab-layer ab-cut ab-cut--brand">
      <p>Coded by M</p>
    </div>
  ) : (
    <div className="ab-layer ab-cut ab-cut--names">
      {names.map((n) => (
        <p key={n}>{n}</p>
      ))}
    </div>
  );
}
