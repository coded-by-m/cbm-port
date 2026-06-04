"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { cases } from "@/data/cases";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import LandscapeScene from "./LandscapeScene";
import { ProjectCard } from "./ProjectCard";
import DevCameraControls from "./DevCameraControls";
import DevCameraHUD from "./DevCameraHUD";
import { FRAGMENT_SLOTS, ORBIT } from "./config";

type Direction = "left" | "right" | null;

const MOBILE_BREAKPOINT = "(max-width: 767px)";
const TWO_PI = Math.PI * 2;

/** Diferença angular mais curta entre dois ângulos (em radianos). */
function shortAngleDelta(from: number, to: number): number {
  let diff = ((to - from) % TWO_PI + TWO_PI) % TWO_PI;
  if (diff > Math.PI) diff -= TWO_PI;
  return diff;
}

/** Normaliza ângulo pra [0, 2π). */
function normalizeAngle(a: number): number {
  return ((a % TWO_PI) + TWO_PI) % TWO_PI;
}

/** Ângulo orbital de cada slot (atan2 de x sobre z). */
function angleOfSlot(slot: { x: number; z: number }): number {
  return normalizeAngle(Math.atan2(slot.x, slot.z));
}

/**
 * Paisagem Digital — orquestrador (modo orbital).
 *
 * Câmera orbita ao redor de um centro de fragmentos em círculo. Auto-rotate
 * lento até primeira interação; depois drag horizontal do mouse / touch
 * controla. Click no dot snap-anima até o fragmento alvo. Active deriva do
 * ângulo da câmera (rAF poll).
 */
export default function ProjectLandscape() {
  const angleRef = useRef<number>(ORBIT.initialAngle);
  const draggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const releasedRef = useRef(false);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<Direction>(null);
  const [devCamera, setDevCamera] = useState(false);

  const devCameraStateRef = useRef({
    radius: ORBIT.cameraRadius,
    y: ORBIT.cameraY,
    targetY: ORBIT.targetY,
    angleDeg: (ORBIT.initialAngle * 180) / Math.PI,
  });

  const router = useRouter();

  // Cada slot com seu ângulo orbital pré-computado (pra active lookup).
  const slotAngles = useMemo(
    () =>
      FRAGMENT_SLOTS.map((slot) => ({
        slug: slot.slug,
        angle: angleOfSlot(slot),
      })),
    [],
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  // Toggle modo dev de câmera via tecla "C".
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignora se foco em input/textarea.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "c" || e.key === "C") {
        setDevCamera((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // rAF loop principal: auto-rotate + active derivation.
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const last = lastTickRef.current ?? now;
      const delta = (now - last) / 1000;
      lastTickRef.current = now;

      // Auto-rotate só quando não foi released e não está em snap/drag.
      const autoActive =
        !releasedRef.current &&
        !draggingRef.current &&
        snapTweenRef.current === null;
      if (autoActive) {
        angleRef.current += ORBIT.autoRotateSpeed * delta;
      }

      // Active = slot cuja ângulo mais se aproxima do ângulo da câmera atual.
      const camAngle = normalizeAngle(angleRef.current);
      let best = slotAngles[0];
      let minDist = Math.abs(shortAngleDelta(camAngle, best.angle));
      for (const sa of slotAngles) {
        const d = Math.abs(shortAngleDelta(camAngle, sa.angle));
        if (d < minDist) {
          minDist = d;
          best = sa;
        }
      }
      setActiveSlug((prev) => (prev === best.slug ? prev : best.slug));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slotAngles]);

  // Direção da transição do card baseado em delta angular.
  const prevSlugRef = useRef<string | null>(null);
  useEffect(() => {
    if (!activeSlug) return;
    const prev = prevSlugRef.current;
    if (prev && prev !== activeSlug) {
      const prevSlot = FRAGMENT_SLOTS.find((s) => s.slug === prev);
      const nextSlot = FRAGMENT_SLOTS.find((s) => s.slug === activeSlug);
      if (prevSlot && nextSlot) {
        const delta = shortAngleDelta(
          angleOfSlot(prevSlot),
          angleOfSlot(nextSlot),
        );
        setDirection(delta > 0 ? "right" : "left");
      }
    }
    prevSlugRef.current = activeSlug;
  }, [activeSlug]);

  // Drag handlers — operam direto no DOM via pointer events.
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    releasedRef.current = true;
    if (snapTweenRef.current) {
      snapTweenRef.current.kill();
      snapTweenRef.current = null;
    }
    draggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;
    // Drag pra direita rotaciona "câmera pra esquerda" — sensação de empurrar o mundo.
    angleRef.current -= dx * ORBIT.dragSensitivity;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Pointer já solto — ignora.
    }
  }, []);

  // Snap pra fragmento via GSAP tween do ângulo.
  const snapToSlug = useCallback((slug: string) => {
    const slot = FRAGMENT_SLOTS.find((s) => s.slug === slug);
    if (!slot) return;
    releasedRef.current = true;
    if (snapTweenRef.current) snapTweenRef.current.kill();

    const target = angleOfSlot(slot);
    const current = angleRef.current;
    const delta = shortAngleDelta(normalizeAngle(current), target);
    const final = current + delta;

    const proxy = { v: current };
    snapTweenRef.current = gsap.to(proxy, {
      v: final,
      duration: ORBIT.snapDuration,
      ease: "power2.inOut",
      onUpdate: () => {
        angleRef.current = proxy.v;
      },
      onComplete: () => {
        snapTweenRef.current = null;
      },
    });
  }, []);

  const handleHover = useCallback((_slug: string | null) => {
    // Hover em fragmento é decorativo no modo orbital.
  }, []);

  const handleClick = useCallback(
    (slug: string) => {
      releasedRef.current = true;
      const caseProject = cases.find((c) => c.slug === slug);
      if (!caseProject) return;
      if (caseProject.status === "coming-soon") {
        // Coming-soon: snap pra ele em vez de navegar.
        snapToSlug(slug);
        return;
      }
      // Publicado: snap pra ele com leve delay antes de navegar (UX confirma escolha).
      snapToSlug(slug);
      setTimeout(() => router.push(`/cases/${slug}`), ORBIT.snapDuration * 1000);
    },
    [router, snapToSlug],
  );

  const activeCase =
    activeSlug !== null
      ? cases.find((c) => c.slug === activeSlug) ?? null
      : null;

  // Em dev mode, desativa os handlers de drag custom — OrbitControls assume.
  const wrapperHandlers = devCamera
    ? {}
    : {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerUp,
      };

  return (
    <div
      className="absolute inset-0 overflow-hidden touch-none select-none"
      {...wrapperHandlers}
      style={{ cursor: devCamera ? "default" : "grab" }}
    >
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <LandscapeScene
          angleRef={angleRef}
          activeSlug={activeSlug}
          onHover={handleHover}
          onClick={handleClick}
          devCamera={devCamera}
        />
        {devCamera && <DevCameraControls stateRef={devCameraStateRef} />}
      </Canvas>

      <ProjectCard
        caseProject={activeCase}
        isMobile={isMobile}
        direction={direction}
        activeSlug={activeSlug}
        onSelectSlide={snapToSlug}
      />

      {devCamera && (
        <DevCameraHUD
          stateRef={devCameraStateRef}
          onExit={() => setDevCamera(false)}
        />
      )}
    </div>
  );
}
