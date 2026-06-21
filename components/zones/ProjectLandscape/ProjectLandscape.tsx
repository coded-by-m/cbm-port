"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { cases } from "@/data/cases";
import { CAMERA, COLORS, FOG } from "@/components/zones/TerrainMesh/config";
import { ReleaseContext } from "@/components/three/ReleaseContext";
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
  PROJECT_TYPE_COLOR,
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
/**
 * @param active `true` (default) → cena viva. `false` (Home, fora do capítulo
 *   ativo) → congela o render loop e o auto-rotate, pra não girar fora da tela
 *   nem gastar GPU. Mata a "ativação prematura".
 */
export default function ProjectLandscape({
  active = true,
  onForward,
  onBack,
}: {
  active?: boolean;
  /** Wheel ↓ na vitrine → próximo capítulo (wipe). */
  onForward?: () => void;
  /** Wheel ↑ na vitrine → capítulo anterior (wipe). */
  onBack?: () => void;
} = {}) {
  const angleRef = useRef<number>(ORBIT.initialAngle);
  const draggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastInteractionRef = useRef<number>(Date.now() + HINT.showDelay);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  // Slug alvo de uma seleção EXPLÍCITA (clique/seta/dot). Enquanto o snap roda,
  // o card já reflete o alvo — sem esperar a câmera cruzar o meio do caminho
  // (era a "demora" pra trocar). `null` = card segue o fragmento mais próximo.
  const snapTargetSlugRef = useRef<string | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const velRef = useRef(0); // velocidade angular (rad/s) p/ inércia
  const lastAngleRef = useRef<number>(ORBIT.initialAngle);
  const onForwardRef = useRef(onForward);
  onForwardRef.current = onForward;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  // Mobile: navegação "travada" por fragmento — sem auto-rotate à deriva, e
  // snap no mais próximo ao soltar o drag. Ref pra ler no rAF/handlers sem
  // re-subscrever.
  const isMobileRef = useRef(false);
  const snapToNearestRef = useRef<(() => void) | null>(null);

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
    const apply = () => {
      setIsMobile(mql.matches);
      isMobileRef.current = mql.matches;
    };
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  // Mostra o hint após delay; esconde automaticamente após HINT.autoHideDelay.
  useEffect(() => {
    if (!active) return; // não dispara o hint fora da tela
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
  }, [active]);

  // rAF loop principal: auto-rotate + active derivation + auto-resume + visited tracking.
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const last = lastTickRef.current ?? now;
      const delta = (now - last) / 1000;
      lastTickRef.current = now;

      // Auto-rotate quando ativo (capítulo na tela), não pausado e não em drag/snap.
      const autoActive =
        active &&
        !paused &&
        !draggingRef.current &&
        snapTweenRef.current === null &&
        !devCamera &&
        !isMobileRef.current; // mobile não gira sozinho — fica travado no fragmento

      if (draggingRef.current) {
        // Velocidade angular instantânea (rad/s) suavizada — base da inércia.
        const inst =
          (angleRef.current - lastAngleRef.current) / Math.max(delta, 1e-4);
        velRef.current += (inst - velRef.current) * 0.35;
      } else if (
        snapTweenRef.current === null &&
        Math.abs(velRef.current) > ORBIT.inertiaCutoff
      ) {
        // Inércia: continua girando com a velocidade do flick, desacelerando.
        angleRef.current += velRef.current * delta;
        velRef.current *= Math.pow(ORBIT.inertiaFriction, delta * 60);
      } else {
        velRef.current = 0;
        if (autoActive) angleRef.current += ORBIT.autoRotateSpeed * delta;
      }
      lastAngleRef.current = angleRef.current;

      // Resume auto-rotate após idle.
      if (
        paused &&
        !draggingRef.current &&
        snapTweenRef.current === null &&
        Date.now() - lastInteractionRef.current > AUTO_RESUME.idleThreshold
      ) {
        setPaused(false);
      }

      // Active = slot mais próximo do ângulo da câmera...
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
      // ...exceto durante uma seleção explícita: o card pula direto pro alvo
      // (a câmera ainda está a caminho), confirmando a escolha na hora.
      const forced = snapTargetSlugRef.current;
      if (forced) {
        const f = slotAngles.find((sa) => sa.slug === forced);
        if (f) best = f;
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
  }, [slotAngles, paused, devCamera, active]);

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
      snapTargetSlugRef.current = null; // drag livre → card volta a seguir a câmera
      draggingRef.current = true;
      velRef.current = 0; // pega no grab → mata a inércia anterior
      lastAngleRef.current = angleRef.current;
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
      // Mobile: trava no fragmento mais próximo ao soltar (sem deriva de inércia).
      if (isMobileRef.current) {
        velRef.current = 0;
        snapToNearestRef.current?.();
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

      // Card reflete a escolha imediatamente (o rAF respeita esse alvo).
      snapTargetSlugRef.current = slug;

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
          snapTargetSlugRef.current = null;
        },
      });
    },
    [markInteraction],
  );

  // Snap pro fragmento mais próximo do ângulo atual (usado no soltar do drag
  // no mobile — "trava" a vitrine em cada fragmento).
  const snapToNearest = useCallback(() => {
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
    snapToSlug(best.slug);
  }, [slotAngles, snapToSlug]);
  useEffect(() => {
    snapToNearestRef.current = snapToNearest;
  }, [snapToNearest]);

  // Hover: SÓ cursor. Não muda activeSlug nem card.
  const handleHover = useCallback((slug: string | null) => {
    document.body.style.cursor = slug ? "pointer" : "";
  }, []);

  const handleClick = useCallback(
    (slug: string) => {
      const caseProject = cases.find((c) => c.slug === slug);
      if (!caseProject) return;
      // "Em breve" não navega — só centraliza o fragmento.
      if (caseProject.status === "coming-soon") {
        snapToSlug(slug);
        return;
      }
      // Publicado → vai direto pra página do projeto (sem esperar o snap).
      router.push(`/cases/${slug}`);
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

  // Wheel = navegar capítulo (wipe). Drag/setas = girar a vitrine. Como o
  // orbital usa drag (não wheel), o wheel fica livre pra sair da seção sem
  // travar no meio do scroll. Anti-skip: acúmulo + cooldown.
  useEffect(() => {
    if (!active) return;
    let cooldown = false;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      if (devCamera) return;
      e.preventDefault();
      if (cooldown) return;
      accum += e.deltaY;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accum = 0;
      }, 200);
      if (Math.abs(accum) < 110) return;
      const dir = accum > 0 ? 1 : -1;
      accum = 0;
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, 1100);
      if (dir > 0) onForwardRef.current?.();
      else onBackRef.current?.();
    };

    // Touch: swipe VERTICAL navega o capítulo (horizontal continua girando a
    // vitrine via drag). 1 por gesto. Só intercepta quando vertical-dominante.
    let touchY = 0;
    let touchX = 0;
    let fired = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      touchX = e.touches[0].clientX;
      fired = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (devCamera || cooldown || fired) return;
      const dy = touchY - e.touches[0].clientY;
      const dx = Math.abs(e.touches[0].clientX - touchX);
      if (Math.abs(dy) > 50 && Math.abs(dy) > dx * 1.3) {
        e.preventDefault();
        fired = true;
        cooldown = true;
        setTimeout(() => {
          cooldown = false;
        }, 1100);
        if (dy > 0) onForwardRef.current?.();
        else onBackRef.current?.();
      }
    };
    const onTouchEnd = () => {
      fired = false;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [active, devCamera]);

  const activeCase =
    activeSlug !== null
      ? cases.find((c) => c.slug === activeSlug) ?? null
      : null;

  const activeColor =
    activeCase?.type != null
      ? PROJECT_TYPE_COLOR[activeCase.type]
      : "#F5F2ED";

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
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <ReleaseContext />
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <LandscapeScene
          angleRef={angleRef}
          activeSlug={activeSlug}
          onHover={handleHover}
          onClick={handleClick}
          devCamera={devCamera}
          revealPlay={active}
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
              activeColor={activeColor}
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
            // Impede o drag da vitrine de capturar o ponteiro aqui — senão o
            // setPointerCapture do wrapper engole o clique do card (Link).
            onPointerDown={(e) => e.stopPropagation()}
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
