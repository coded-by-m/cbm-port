"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { CaseProject } from "@/types/case";
import { PANCHANG, SATOSHI, SURFACE } from "./shared";

/** Quanto tempo a página do cliente leva pra percorrer de ponta a ponta. */
const DURATION = "34s";
const MOBILE_DURATION = "26s";

const META: CSSProperties = {
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 10,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: "#9B9791",
};

function LockIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Vitrine do hero — o projeto em destaque rolando por inteiro na vertical.
 *
 * Duas telas ao mesmo tempo: a moldura de desktop, grande, e o recorte de
 * mobile sobreposto no canto inferior direito. As duas percorrem a página
 * real do cliente (`preview.desktop` e `preview.mobile`), em ritmos
 * diferentes pra não sincronizarem e virarem um único movimento.
 *
 * O controle de pausa é o único estado: `animationPlayState` nas duas
 * camadas e na barra de progresso. Sob `prefers-reduced-motion` as animações
 * não rodam e o controle fica escondido — não há o que pausar.
 */
export function HeroShowcase({ project }: { project: CaseProject }) {
  const [paused, setPaused] = useState(false);
  const play = paused ? ("paused" as const) : ("running" as const);

  const desktopShot = project.preview?.desktop;
  const mobileShot = project.preview?.mobile;

  return (
    <div style={{ minWidth: 0, position: "relative" }}>
      <div
        style={{
          position: "relative",
          border: "1px solid rgba(245,242,237,0.15)",
          background: SURFACE.frame,
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.85)",
        }}
      >
        {/* Barra da janela */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            borderBottom: "1px solid rgba(245,242,237,0.1)",
            background: SURFACE.frameBar,
            padding: "10px 16px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "#C8C4BE",
              minWidth: 0,
            }}
          >
            <span
              aria-hidden
              style={{ width: 7, height: 7, borderRadius: 9999, background: "#FB3640", flex: "none" }}
            />
            <LockIcon />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {project.siteUrl}
            </span>
          </span>
          {project.siteUrl && (
            <a
              href={`https://${project.siteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="site-link-underline"
              style={{
                flex: "none",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#F5F2ED",
                textDecoration: "none",
                transition: "color 160ms ease",
              }}
            >
              Live site <span style={{ color: "#FB3640" }}>↗</span>
            </a>
          )}
        </div>

        {/* A página rolando */}
        <div
          style={
            {
              position: "relative",
              height: "var(--shot-h)",
              overflow: "hidden",
              "--shot-h": "clamp(340px,54vh,540px)",
              "--shot-dur": DURATION,
            } as CSSProperties
          }
        >
          {desktopShot && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={desktopShot}
              alt={`${project.title} — site completo`}
              className="site-shot-scroll"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                animationPlayState: play,
              }}
            />
          )}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "auto 0 0 0",
              height: 90,
              background: `linear-gradient(to bottom,rgba(10,18,12,0),rgba(10,18,12,0.9))`,
            }}
          />
          <span
            aria-hidden
            style={{
              pointerEvents: "none",
              position: "absolute",
              bottom: 6,
              right: 6,
              width: 12,
              height: 12,
              borderBottom: "1px solid #FB3640",
              borderRight: "1px solid #FB3640",
            }}
          />
        </div>

        {/* Progresso + pausa */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderTop: "1px solid rgba(245,242,237,0.1)",
            background: SURFACE.frameBar,
            padding: "10px 16px",
          }}
        >
          <span
            aria-hidden
            style={{ position: "relative", flex: 1, height: 1, background: "rgba(245,242,237,0.14)" }}
          >
            <span
              className="site-shot-progress"
              style={
                {
                  position: "absolute",
                  inset: 0,
                  background: "#FB3640",
                  animationPlayState: play,
                  "--shot-dur": DURATION,
                } as CSSProperties
              }
            />
          </span>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            className="site-link-underline"
            style={{
              flex: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              fontFamily: SATOSHI,
              fontWeight: 500,
              fontSize: 9,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#9B9791",
              transition: "color 160ms ease",
            }}
          >
            <span aria-hidden style={{ color: "#FB3640", fontSize: 10 }}>
              {paused ? "▶" : "❚❚"}
            </span>
            {paused ? "Retomar" : "Pausar"}
          </button>
        </div>
      </div>

      {/* Recorte de mobile, sobreposto */}
      {mobileShot && (
        <div
          style={{
            position: "absolute",
            right: "clamp(-10px,-1vw,0px)",
            bottom: "clamp(-34px,-4vh,-18px)",
            width: "clamp(132px,13vw,176px)",
            border: "1px solid rgba(245,242,237,0.18)",
            background: SURFACE.frame,
            boxShadow: "0 18px 44px -10px rgba(0,0,0,0.9)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              borderBottom: "1px solid rgba(245,242,237,0.1)",
              background: SURFACE.frameBar,
              padding: "6px 9px",
            }}
          >
            <span style={{ ...META, fontSize: 8, letterSpacing: "0.2em" }}>Mobile</span>
            <span aria-hidden style={{ color: "#FB3640", fontSize: 9 }}>
              ↓
            </span>
          </div>
          <div
            style={
              {
                position: "relative",
                height: "var(--shot-h)",
                overflow: "hidden",
                "--shot-h": "clamp(190px,26vh,260px)",
                "--shot-dur": MOBILE_DURATION,
              } as CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mobileShot}
              alt={`${project.title} — versão mobile`}
              className="site-shot-scroll"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                animationPlayState: play,
              }}
            />
          </div>
        </div>
      )}

      {/* Legenda sob a moldura */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 18,
          paddingRight: "clamp(150px,14vw,190px)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: SATOSHI,
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#FB3640",
          }}
        >
          01
          <span aria-hidden style={{ display: "block", width: 22, height: 1, background: "rgba(251,54,64,0.5)" }} />
          <span style={{ color: "#C8C4BE" }}>{project.title}</span>
        </span>
        <span style={META}>
          Desktop / 1440 · {project.stack?.[0] ?? project.meta.tipo}
        </span>
      </div>
    </div>
  );
}
