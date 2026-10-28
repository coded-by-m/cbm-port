import type { CSSProperties, ReactNode } from "react";
import { PANCHANG, SATOSHI, SURFACE } from "@/components/site/shared";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { GalleryFooter } from "@/components/projetos/GalleryFooter";

/** Casca das páginas de texto (sobre, blog): cabeçalho fino, coluna de leitura, rodapé com serviços. */
export function ProseShell({
  label,
  current,
  children,
}: {
  label: string;
  current?: string;
  children: ReactNode;
}) {
  return (
    <div className="site-home min-h-dvh" style={{ background: SURFACE.base, color: "#F5F2ED" }}>
      <GalleryHeader label={label} />
      <main
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "clamp(44px,7vh,80px) clamp(20px,4vw,48px) 0",
        }}
      >
        {children}
      </main>
      <GalleryFooter current={current} />
    </div>
  );
}

export const PROSE_H1: CSSProperties = {
  margin: 0,
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: "clamp(30px,4.6vw,54px)",
  letterSpacing: "-0.016em",
  lineHeight: 1.06,
  color: "#F5F2ED",
  textWrap: "balance",
};

export const PROSE_H2: CSSProperties = {
  margin: "48px 0 0",
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: "clamp(20px,2.4vw,28px)",
  letterSpacing: "-0.01em",
  lineHeight: 1.15,
  color: "#F5F2ED",
};

/** Pergunta de FAQ dentro da coluna de prosa. */
export const PROSE_H3: CSSProperties = {
  margin: "28px 0 0",
  fontFamily: SATOSHI,
  fontWeight: 600,
  fontSize: "clamp(16px,1.5vw,18px)",
  lineHeight: 1.4,
  color: "#F5F2ED",
};

export const PROSE_P: CSSProperties = {
  margin: "18px 0 0",
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: "clamp(15px,1.4vw,17px)",
  lineHeight: 1.75,
  color: "#B4B0AA",
  textWrap: "pretty",
};

/** Link de texto dentro da prosa. */
export const PROSE_LINK: CSSProperties = {
  color: "#F5F2ED",
  textDecoration: "underline",
  textDecorationColor: "#FB3640",
  textUnderlineOffset: 3,
};
