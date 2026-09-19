import { LpCta } from "./LpCta";
import { LogoMarkSvg, PANCHANG } from "@/components/site/shared";

/**
 * Cabeçalho da landing — wordmark e um CTA. Sem âncoras.
 *
 * A prática comum em tráfego pago é remover toda saída da página. O logo aqui
 * ainda leva pra `/`: estúdio de design vende confiança, e um logo que não
 * clica em lugar nenhum cheira a página descartável. Um lead curioso que vai
 * ver o site principal não é um lead perdido.
 */
export function LpHeader({ message }: { message: string }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(4,8,6,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #111511",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px clamp(20px,4vw,48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: 15,
            color: "#F5F2ED",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <LogoMarkSvg size={15} />
          Coded <span style={{ color: "#FB3640" }}>by</span> M
        </a>

        <LpCta label="Falar agora" message={message} size="sm" source="lp-header" />
      </div>
    </header>
  );
}
