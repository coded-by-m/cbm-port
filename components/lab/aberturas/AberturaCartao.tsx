"use client";

import { useEffect, useState } from "react";
import { CardFront } from "./CardFront";

/** Quanto o cartão fica parado antes de abrir, e quanto dura a dobra. */
const HOLD_MS = 650;
const FOLD_MS = 620;

/**
 * 1 · O cartão vira a página.
 *
 * A tela abre como a frente do cartão. Depois de uma pausa curta ele se parte
 * na horizontal e as duas metades dobram pra fora em 3D, como um envelope,
 * mostrando a página que já estava atrás.
 *
 * Cada metade é uma janela de 50% de altura sobre a MESMA face inteira: é o
 * que mantém o símbolo contínuo até o instante da dobra.
 */
export function AberturaCartao({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const a = window.setTimeout(() => setOpen(true), HOLD_MS);
    const b = window.setTimeout(onDone, HOLD_MS + FOLD_MS + 60);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [onDone]);

  return (
    <div className={open ? "ab-layer ab-fold is-open" : "ab-layer ab-fold"}>
      <div className="ab-flap ab-flap--top">
        <div className="ab-flap-face">
          <CardFront />
        </div>
      </div>
      <div className="ab-flap ab-flap--bottom">
        <div className="ab-flap-face">
          <CardFront />
        </div>
      </div>
    </div>
  );
}
