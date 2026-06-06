"use client";

import { useEffect, useState, type MutableRefObject } from "react";

type CameraState = {
  radius: number;
  y: number;
  targetY: number;
  angleDeg: number;
};

/**
 * HUD do modo dev — mostra valores da câmera em tempo real e expõe botão
 * pra copiar como bloco de constantes ORBIT pra colar no `config.ts`.
 *
 * Faz rAF poll do `stateRef` (escrito por DevCameraControls dentro do Canvas).
 */
export default function DevCameraHUD({
  stateRef,
  onExit,
}: {
  stateRef: MutableRefObject<CameraState>;
  onExit: () => void;
}) {
  const [state, setState] = useState<CameraState>(stateRef.current);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const s = stateRef.current;
      setState((prev) => {
        const same =
          Math.abs(prev.radius - s.radius) < 0.02 &&
          Math.abs(prev.y - s.y) < 0.02 &&
          Math.abs(prev.targetY - s.targetY) < 0.02 &&
          Math.abs(prev.angleDeg - s.angleDeg) < 0.5;
        return same ? prev : { ...s };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stateRef]);

  const block = `cameraRadius: ${state.radius.toFixed(2)},
cameraY: ${state.y.toFixed(2)},
targetY: ${state.targetY.toFixed(2)},
initialAngle: ${((state.angleDeg * Math.PI) / 180).toFixed(3)}, // ${state.angleDeg.toFixed(1)}°`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard pode falhar em contextos sem permissão — usuário pode copiar manual.
    }
  };

  return (
    <div className="pointer-events-auto fixed left-6 top-6 z-40 border border-[#F5F2ED]/30 bg-[#000F08]/90 px-4 py-3 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-6">
        <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#FB3640]">
          Dev Camera
        </p>
        <button
          type="button"
          onClick={onExit}
          className="text-[0.55rem] uppercase tracking-[0.3em] text-[#F5F2ED]/60 hover:text-[#F5F2ED]"
        >
          [C] Sair
        </button>
      </div>
      <pre className="font-mono text-[0.7rem] leading-relaxed text-[#F5F2ED]/85">
        {block}
      </pre>
      <div className="mt-3 flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.3em]">
        <button
          type="button"
          onClick={handleCopy}
          className="border border-[#F5F2ED]/30 px-3 py-1 text-[#F5F2ED]/85 hover:border-[#F5F2ED] hover:text-[#F5F2ED]"
        >
          {copied ? "Copiado!" : "Copiar"}
        </button>
        <span className="text-[#97938b]">
          Drag · scroll zoom · right-click pan
        </span>
      </div>
    </div>
  );
}
