"use client";

import { useEffect, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import type { Line2 } from "three-stdlib";
import gsap from "gsap";
import { TIMING } from "./config";

/**
 * Animação de construção do triângulo.
 *
 * Sequência (princípio "tudo é construído"):
 *  1. Os três pontos surgem, um após o outro.
 *  2. As linhas conectam os pontos, formando o triângulo wireframe.
 *  3. A estrutura passa a girar lentamente, em loop.
 *
 * A renderização é sob demanda (`frameloop="demand"`): o ticker do GSAP
 * solicita novos frames apenas enquanto a timeline está ativa.
 */
export function useTriangleAnimation(
  rotateRef: RefObject<Group>,
  pointRefs: RefObject<Mesh>[],
  lineRefs: RefObject<Line2>[],
) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const points = pointRefs
      .map((ref) => ref.current)
      .filter((value): value is Mesh => value !== null);
    const lines = lineRefs
      .map((ref) => ref.current)
      .filter((value): value is Line2 => value !== null);
    const rotateGroup = rotateRef.current;

    if (points.length < 3 || lines.length < 3 || !rotateGroup) return;

    gsap.ticker.add(invalidate);

    const timeline = gsap.timeline({ delay: TIMING.startDelay });

    // 1 + 2 + 3 — pontos surgem um a um, com uma batida entre eles.
    // O `power2.out` (sem overshoot) faz o surgimento elegante, nunca brusco.
    points.forEach((point, index) => {
      timeline.to(
        point.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: TIMING.pointPop,
          ease: "power2.out",
        },
        index === 0 ? ">" : `>+=${TIMING.pointStagger}`,
      );
    });

    // 4 + 5 + 6 — as arestas se desenham lentamente, em sequência, com leve
    // sobreposição: a montagem progride aresta a aresta até fechar a peça.
    lines.forEach((line, index) => {
      timeline.to(
        line.material,
        {
          opacity: TIMING.lineOpacity,
          duration: TIMING.lineDraw,
          ease: "power1.inOut",
        },
        index === 0 ? `>+=${TIMING.settle * 0.5}` : `-=${TIMING.lineOverlap}`,
      );
    });

    // 7 + 8 — a peça se assenta e então passa a girar, lenta e contínua.
    timeline.to(
      rotateGroup.rotation,
      {
        y: Math.PI * 2,
        duration: TIMING.rotationDuration,
        ease: "none",
        repeat: -1,
      },
      `+=${TIMING.settle}`,
    );

    return () => {
      timeline.kill();
      gsap.ticker.remove(invalidate);
    };
  }, [invalidate, pointRefs, lineRefs, rotateRef]);
}
