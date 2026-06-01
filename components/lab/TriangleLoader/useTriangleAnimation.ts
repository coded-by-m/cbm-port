"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { Color, type Group, type Mesh, type MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import gsap from "gsap";
import { COLORS, LOGO_STROKES, TIMING } from "./config";

/**
 * Animação de construção da logo CbM com draw-on linear.
 *
 * Os strokes são desenhados progressivamente via dashOffset (de length → 0),
 * não por fade de opacidade. O efeito é de uma caneta traçando cada stroke.
 */
export function useTriangleAnimation(
  rotateRef: RefObject<Group>,
  pointRefs: RefObject<Mesh>[],
  lineRefs: RefObject<Line2>[],
  onComplete?: () => void,
) {
  const invalidate = useThree((state) => state.invalidate);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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

    // Setup: configure dashing on each line for draw-on effect
    lines.forEach((line, i) => {
      const mat = line.material;
      mat.dashed = true;
      mat.dashSize = LOGO_STROKES[i].length;
      mat.gapSize = LOGO_STROKES[i].length;
      mat.dashOffset = LOGO_STROKES[i].length;
      mat.opacity = LOGO_STROKES[i].targetOpacity;
      mat.needsUpdate = true;
    });

    const timeline = gsap.timeline({ delay: TIMING.startDelay });

    // 1–3: pontos surgem nos cantos da logo.
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

    // 4–5: strokes estruturais (C e M) desenham linearmente.
    for (let i = 0; i < 2; i++) {
      timeline.to(
        lines[i].material,
        {
          dashOffset: 0,
          duration: TIMING.strokeDraw,
          ease: "power1.inOut",
        },
        i === 0 ? `>+=${TIMING.settle * 0.5}` : `>+=${TIMING.strokeStagger}`,
      );
    }

    // 6: o ponto de origem (index 2) vira Signal Red.
    const signalPointMaterial = points[2].material as MeshBasicMaterial;
    const signalColor = new Color(COLORS.signal);
    timeline.to(
      signalPointMaterial.color,
      {
        r: signalColor.r,
        g: signalColor.g,
        b: signalColor.b,
        duration: TIMING.signalShift,
        ease: "power2.inOut",
      },
      `>+=${TIMING.signalDelay}`,
    );

    // 7: a diagonal vermelha desenha linearmente.
    timeline.to(
      lines[2].material,
      {
        dashOffset: 0,
        duration: TIMING.signalDraw,
        ease: "power1.inOut",
      },
      "<",
    );

    // 8: construção completa — sinaliza para o pai.
    timeline.call(() => onCompleteRef.current?.(), [], `+=${TIMING.settle}`);

    return () => {
      timeline.kill();
      gsap.ticker.remove(invalidate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidate]);
}
