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
import LandscapeHint from "./LandscapeHint";
import LandscapeProgressBar from "./LandscapeProgressBar";
import LandscapeArrows from "./LandscapeArrows";
import {
  AUTO_RESUME,
  FRAGMENT_SLOTS,
  HINT,
  ORBIT,
} from "./config";

type Direction = "left" | "right" | null;

const MOBILE_BREAKPOINT = "(max-width: 767px)";
const TWO_PI = Math.PI * 2;

function shortAngleDelta(from: number, to: number): number {
  let diff = ((to - from) % TWO_PI + TWO_PI) % TWO_PI;
  if (diff > Math.PI) diff -= TWO_PI;
  return diff;
}

function normalizeAngle(a: number): number {
  return ((a % TWO_PI) + TWO_PI) % TWO_PI;
}

function angleOfSlot(slot: { x: number; z: number }): number {
  return normalizeAngle(Math.atan2(slot.x, slot.z));
}

/**
 * Paisagem Digital — orquestrador (orbital mode + UX completa).
 *
 * Estado de interação:
 * - paused: auto-rotate pausado (não congelado pra sempre). Retomado após
 *   AUTO_RESUME.idleThreshold ms sem interação.
 * - lastInteractionTime: timestamp da última interação real (drag, click,
 *   keyboard).
 * - visitedSlugs: Set de slugs já visitados (pro end-of-tour state).
 * - hoveredSlug: visual feedback de hover (não muda o card — apenas cursor).
 * - activeSlug: drivado pelo ângulo da câmera; CARD sempre reflete isso.
 */
export default function ProjectLandscape() {
  const angleRef = useRef<number>(ORBIT.initialAngle);
  const draggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastInteractionRef = useRef<number>(Date.now() + HINT.showDelay);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<Direction>(null);
  const [devCamera, setDevCamera] = useState(false);
  const [visitedSlugs, setVisitedSlugs] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [paused, setPaused] = useState(false);

  const devCameraStateRef = useRef({
    radius: ORBIT.cameraRadius,
    y: ORBIT.cameraY,
    targetY: ORBIT.targetY,
    angleDeg: (ORBIT.initialAngle * 180) / Math.PI,
  });

  const router = useRouter();

  const slotAngles = useMemo(
    () =>
      FRAGMENT_SLOTS.map((slot) => ({
        slug: slot.slug,
        angle: angleOfSlot(slot),
      })),
    [],
  );

  // Marca interação real (pra controlar auto-resume e hint).
  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setShowHint(false);
    setPaused(true);
  }, []);

  // Toggle manual do pause via botão.
  const togglePause = useCallback(() => {
    setShowHint(false);
    setPaused((prev) => {
      const next = !prev;
      // Se vai retomar, reseta o lastInteraction pra que auto-resume não pause
      // de novo imediatamente. Se vai pausar, marca agora.
      lastInteractionRef.current = next ? Date.now() : 0;
      return next;
    });
  }, []);

  // Hover sobre o card pausa auto-rotate temporariamente. lastInteraction
  // é atualizado em cada movement → resume só depois de sair + idle.
  const handleCardEnter = useCallback(() => {
    setPaused(true);
    lastInteractionRef.current = Date.now();
  }, []);
  const handleCardMove = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  // Mostra o hint após delay; esconde automaticamente após HINT.autoHideDelay.
  useEffect(() => {
    const showTimer = setTimeout(() => {
      // Só mostra se ninguém interagiu ainda.
      if (Date.now() - lastInteractionRef.current >= HINT.showDelay - 50) {
        setShowHint(true);
      }
    }, HINT.showDelay);
    const hideTimer = setTimeout(() => {
      setShowHint(false);
    }, HINT.showDelay + HINT.autoHideDelay);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // rAF loop principal: auto-rotate + active derivation + auto-resume + visited tracking.
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const last = lastTickRef.current ?? now;
      const delta = (now - last) / 1000;
      lastTickRef.current = now;

      // Auto-rotate quando não pausado e não em drag/snap.
      const autoActive =
        !paused &&
        !draggingRef.current &&
        snapTweenRef.current === null &&
        !devCamera;
      if (autoActive) {
        angleRef.current += ORBIT.autoRotateSpeed * delta;
      }

      // Resume auto-rotate após idle.
      if (
        paused &&
        !draggingRef.current &&
        snapTweenRef.current === null &&
        Date.now() - lastInteractionRef.current > AUTO_RESUME.idleThreshold
      ) {
        setPaused(false);
      }

      // Active = slot mais próximo do ângulo da câmera.
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

      setActiveSlug((prev) => {
        if (prev === best.slug) return prev;
        // Adiciona ao visited.
        setVisitedSlugs((s) => {
          if (s.has(best.slug)) return s;
          const next = new Set(s);
          next.add(best.slug);
          return next;
        });
        return best.slug;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slotAngles, paused, devCamera]);

  // Direção da transição do card baseada em delta angular.
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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      markInteraction();
      if (snapTweenRef.current) {
        snapTweenRef.current.kill();
        snapTweenRef.current = null;
      }
      draggingRef.current = true;
      lastPointerXRef.current = e.clientX;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [markInteraction],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;
      angleRef.current -= dx * ORBIT.dragSensitivity;
      lastInteractionRef.current = Date.now();
    },
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    [],
  );

  const snapToSlug = useCallback(
    (slug: string) => {
      const slot = FRAGMENT_SLOTS.find((s) => s.slug === slug);
      if (!slot) return;
      markInteraction();
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
    },
    [markInteraction],
  );

  // Hover: SÓ cursor. Não muda activeSlug nem card.
  const handleHover = useCallback((slug: string | null) => {
    document.body.style.cursor = slug ? "pointer" : "";
  }, []);

  const handleClick = useCallback(
    (slug: string) => {
      const caseProject = cases.find((c) => c.slug === slug);
      if (!caseProject) return;
      // Snap pra ele primeiro (sempre); navegação só pra publicados.
      snapToSlug(slug);
      if (caseProject.status === "coming-soon") return;
      setTimeout(() => router.push(`/cases/${slug}`), ORBIT.snapDuration * 1000);
    },
    [router, snapToSlug],
  );

  // Navega prev/next na ordem angular dos fragmentos.
  // Usado por: setas do teclado, botões de seta laterais.
  const goByDirection = useCallback(
    (dir: 1 | -1) => {
      const ordered = [...FRAGMENT_SLOTS].sort(
        (a, b) => angleOfSlot(a) - angleOfSlot(b),
      );
      const currentIdx = ordered.findIndex((s) => s.slug === activeSlug);
      const nextIdx = (currentIdx + dir + ordered.length) % ordered.length;
      snapToSlug(ordered[nextIdx].slug);
    },
    [activeSlug, snapToSlug],
  );
  const goPrev = useCallback(() => goByDirection(-1), [goByDirection]);
  const goNext = useCallback(() => goByDirection(1), [goByDirection]);

  // Teclado: ← / → navega prev/next. Enter abre case. Esc retoma auto-rotate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Enter" || e.key === " ") {
        const current = cases.find((c) => c.slug === activeSlug);
        if (current && current.status !== "coming-soon") {
          e.preventDefault();
          router.push(`/cases/${current.slug}`);
        }
      } else if (e.key === "Escape") {
        // Solta controle: retoma auto-rotate.
        setPaused(false);
        lastInteractionRef.current = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSlug, router, goPrev, goNext]);

  const activeCase =
    activeSlug !== null
      ? cases.find((c) => c.slug === activeSlug) ?? null
      : null;

  const allVisited = visitedSlugs.size >= FRAGMENT_SLOTS.length;

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
      role="region"
      aria-label="Vitrine interativa de projetos. Use as setas do teclado para navegar."
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

      {!devCamera && (
        <>
          <div
            className="landscape-ui-stagger"
            style={{ animationDelay: "0.4s" }}
          >
            <LandscapeProgressBar
              slots={FRAGMENT_SLOTS}
              activeSlug={activeSlug}
              visitedSlugs={visitedSlugs}
              onSelect={snapToSlug}
            />
          </div>
          <div
            className="landscape-ui-stagger"
            style={{ animationDelay: "0.6s" }}
          >
            <LandscapeArrows
              paused={paused}
              onPrev={goPrev}
              onNext={goNext}
              onTogglePause={togglePause}
            />
          </div>
          <LandscapeHint show={showHint} />
          <div
            onPointerEnter={handleCardEnter}
            onPointerMove={handleCardMove}
          >
            <ProjectCard
              caseProject={activeCase}
              isMobile={isMobile}
              direction={direction}
              activeSlug={activeSlug}
              allVisited={allVisited}
              onSelectSlide={snapToSlug}
            />
          </div>
        </>
      )}

      {devCamera && (
        <DevCameraHUD
          stateRef={devCameraStateRef}
          onExit={() => setDevCamera(false)}
        />
      )}
    </div>
  );
}
