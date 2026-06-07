"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Libera o contexto WebGL imediatamente ao desmontar a cena.
 *
 * Numa Home com várias cenas montando/desmontando por viewport (`LazySection`),
 * o r3f faz dispose dos recursos no unmount — mas não força a perda do contexto.
 * O contexto fica "pendurado" e acumula. Os browsers limitam contextos WebGL
 * simultâneos (~16 no desktop, bem menos em GPU de celular); ao estourar, o
 * browser mata os contextos mais antigos → `THREE.WebGLRenderer: Context Lost`
 * em cenas ainda visíveis (partes "em branco" no mobile).
 *
 * `forceContextLoss()` devolve o slot do contexto na hora, em vez de esperar o
 * GC. Renderiza `null`; só age no cleanup do unmount — zero custo enquanto vivo,
 * zero impacto visual.
 *
 * Uso: como primeiro filho de cada `<Canvas>` que monta/desmonta por viewport.
 */
export function ReleaseContext() {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    return () => {
      try {
        gl.forceContextLoss();
      } catch {
        // Contexto já perdido/descartado — nada a fazer.
      }
    };
  }, [gl]);

  return null;
}
