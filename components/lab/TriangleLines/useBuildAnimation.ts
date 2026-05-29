"use client";

import { useEffect, type RefObject } from "react";
import type { Mesh } from "three";
import type { Line2 } from "three-stdlib";
import gsap from "gsap";
import { TIMING } from "./config";
import type { BuiltLayer } from "./geometry";

/**
 * Animação de construção de uma camada da malha.
 *
 * Narrativa (princípio "tudo é construído"):
 *  1. Os nós surgem, do centro para fora (escala 0 → 1, sem overshoot).
 *  2. As arestas conectam os nós na mesma onda — os triângulos emergem como
 *     consequência das conexões, nunca aparecem prontos.
 *
 * O posicionamento absoluto na timeline (em segundos) usa o valor `build` de
 * cada elemento, criando uma onda coerente de crescimento. O `delay` escalona
 * as camadas de trás para frente, reforçando a profundidade.
 *
 * A cena renderiza em `frameloop="always"`, então o GSAP só precisa mutar os
 * valores — o R3F desenha cada frame.
 */
export function useBuildAnimation(
  nodeRefs: RefObject<Mesh>[],
  edgeRefs: RefObject<Line2>[],
  geom: BuiltLayer,
  delay: number,
) {
  useEffect(() => {
    const timeline = gsap.timeline({ delay: TIMING.startDelay + delay });

    geom.nodes.forEach((node, index) => {
      const mesh = nodeRefs[index]?.current;
      if (!mesh) return;
      timeline.to(
        mesh.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: TIMING.nodePop,
          ease: "power2.out",
        },
        node.build * TIMING.nodeWindow,
      );
    });

    geom.edges.forEach((edge, index) => {
      const line = edgeRefs[index]?.current;
      if (!line) return;
      timeline.to(
        line.material,
        {
          opacity: geom.layer.edgeOpacity,
          duration: TIMING.edgeDraw,
          ease: "power1.inOut",
        },
        TIMING.edgeStart + edge.build * TIMING.edgeWindow,
      );
    });

    return () => {
      timeline.kill();
    };
  }, [nodeRefs, edgeRefs, geom, delay]);
}
