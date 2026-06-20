"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LiveScreenshot } from "@/components/case/LiveScreenshot";

/**
 * Mídia que vive dentro de um frame (BrowserFrame/PhoneFrame).
 *
 * - Com `videoSrc`: toca o .webm de scroll em autoplay/muted/loop/playsinline.
 *   Em prefers-reduced-motion, NÃO toca — mostra o `poster` estático (object-cover).
 *   onError do vídeo → cai pro LiveScreenshot (screenshot tall rolando) ou poster.
 * - Sem `videoSrc`: comporta-se como antes (LiveScreenshot a partir de `screenshotSrc`).
 */
export function CaseFrameMedia({
  videoSrc,
  poster,
  screenshotSrc,
  alt,
  durationSec = 35,
  lazy = false,
  fallback = null,
}: {
  /** .webm de scroll. Ausente → usa só o screenshot animado. */
  videoSrc?: string;
  /** Imagem de pôster do vídeo + fallback em reduced-motion. */
  poster?: string;
  /** Screenshot tall pro LiveScreenshot (quando não há vídeo ou ele falha). */
  screenshotSrc?: string;
  alt: string;
  durationSec?: number;
  lazy?: boolean;
  fallback?: ReactNode;
}) {
  const [reduce, setReduce] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setReduce(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const screenshotFallback = (
    <LiveScreenshot
      src={screenshotSrc}
      alt={alt}
      durationSec={durationSec}
      lazy={lazy}
      fallback={fallback}
    />
  );

  // Sem vídeo (ou ele falhou) → screenshot animado / fallback.
  if (!videoSrc || videoFailed) return screenshotFallback;

  // Reduced-motion → pôster estático (não anima nada).
  if (reduce) {
    if (poster) {
      return (
        // biome-ignore lint/a11y/useAltText: alt é repassado
        <img
          src={poster}
          alt={alt}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      );
    }
    return screenshotFallback;
  }

  return (
    <video
      ref={ref}
      src={videoSrc}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={lazy ? "none" : "metadata"}
      aria-label={alt}
      onError={() => setVideoFailed(true)}
      className="h-full w-full object-cover object-top"
    />
  );
}
