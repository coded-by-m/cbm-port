/**
 * Chrome compartilhado dos carrosséis de post — Coded by M.
 *
 * Sistema "blueprint estrutural": primitivos comuns (tokens, símbolo, marcas de
 * registro, número em outline, kicker, rodapé com progresso) que dão unidade a
 * todos os carrosséis. Cada post importa daqui e monta suas composições próprias.
 *
 * Formato feed do Instagram: 1080×1350 (4:5). Identidade real do site:
 * fundo #000F08, Panchang/Satoshi, sinal vermelho raro (#FB3640), angular.
 */

export const BLACK = "#000F08";
export const WHITE = "#F5F2ED";
export const RED = "#FB3640";
export const GRAY_200 = "#C8C4BE";
export const GRAY_400 = "#8A8780";
export const GRAY_600 = "#4A4844";
export const BORDER = "#1a2a1e";
export const OUTLINE = "#16271b"; // stroke do número de seção

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
export const PAD = 88; // margem lateral base

/** Símbolo triangular da marca (mesmo path do LogoMark). */
export function Symbol({ size = 96 }: { size?: number }) {
  const h = Math.round((size * 161) / 142);
  return (
    <svg width={size} height={h} viewBox="0 0 142 161" fill="none" aria-hidden>
      <path
        d="M11.5 148.039V59.0391L53.5 104.438"
        stroke={WHITE}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M130.5 103.039V19.0391L85.5 67.2944"
        stroke={WHITE}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 18.0391L130.5 147.039"
        stroke={RED}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Marcas de registro nos 4 cantos — enquadramento técnico discreto. */
export function CropMarks() {
  const L = 24;
  const inset = 44;
  const mark = (x: "left" | "right", y: "top" | "bottom") => (
    <>
      <span
        style={{
          position: "absolute",
          [x]: inset,
          [y]: inset,
          width: L,
          height: 1,
          background: BORDER,
        }}
      />
      <span
        style={{
          position: "absolute",
          [x]: inset,
          [y]: inset,
          width: 1,
          height: L,
          background: BORDER,
        }}
      />
    </>
  );
  return (
    <>
      {mark("left", "top")}
      {mark("right", "top")}
      {mark("left", "bottom")}
      {mark("right", "bottom")}
    </>
  );
}

/** Número de seção em outline gigante — elemento estrutural, pode cropar na borda. */
export function OutlineNumber({
  n,
  style,
}: {
  n: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        position: "absolute",
        fontFamily: "Panchang, sans-serif",
        fontWeight: 800,
        fontSize: 400,
        lineHeight: 0.78,
        letterSpacing: "-0.05em",
        color: "transparent",
        WebkitTextStroke: `2px ${OUTLINE}`,
        userSelect: "none",
        ...style,
      }}
    >
      {n}
    </span>
  );
}

/** Kicker — traço vermelho + label Satoshi tracked. Posicionável. */
export function Kicker({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, ...style }}>
      <span style={{ width: 40, height: 1, background: RED, opacity: 0.75 }} />
      <span
        style={{
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 500,
          fontSize: 17,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: RED,
          opacity: 0.74,
        }}
      >
        {children}
      </span>
    </div>
  );
}

/** Rodapé técnico: índice + wordmark + barra de progresso segmentada. */
export function Chrome({
  index,
  total,
  swipe,
}: {
  index: number;
  total: number;
  swipe?: boolean;
}) {
  return (
    <>
      <CropMarks />

      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 86,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 400,
            fontSize: 15,
            letterSpacing: "0.3em",
            color: GRAY_600,
          }}
        >
          {String(index).padStart(2, "0")}
          <span style={{ color: BORDER }}> / </span>
          {String(total).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "0.03em",
            color: GRAY_400,
          }}
        >
          CODED <span style={{ color: RED }}>BY</span> M
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 62,
          display: "flex",
          gap: 8,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: 3,
              background:
                i + 1 === index ? RED : i + 1 < index ? GRAY_600 : BORDER,
            }}
          />
        ))}
      </div>

      {swipe && (
        <div
          style={{
            position: "absolute",
            right: PAD,
            bottom: 140,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GRAY_600,
          }}
        >
          Arraste
          <svg width="32" height="9" viewBox="0 0 32 9" fill="none" aria-hidden>
            <path d="M0 4.5 H28" stroke={RED} strokeWidth="1.4" />
            <path
              d="M23 1 L29 4.5 L23 8"
              stroke={RED}
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
        </div>
      )}
    </>
  );
}

/** Frame base de um slide (1080×1350). */
export const frame: React.CSSProperties = {
  position: "relative",
  width: SLIDE_W,
  height: SLIDE_H,
  background: BLACK,
  overflow: "hidden",
  color: WHITE,
  fontFamily: "Satoshi, sans-serif",
};
