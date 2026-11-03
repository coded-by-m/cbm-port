"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  CALC_ESCOPO,
  CALC_INCLUSO,
  CALC_PLANO_LABEL,
  CALC_TIPOS,
  calculatorMessage,
  type CalculadoraTipo,
} from "@/data/calculadoraPreco";
import { waLink } from "@/lib/contact";
import { PANCHANG, SATOSHI } from "@/components/site/shared";
import { FillButton } from "@/components/ui/FillButton";
import { cbm } from "@/lib/palette";

const LABEL: React.CSSProperties = {
  margin: 0,
  fontFamily: SATOSHI,
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: cbm("gray-400"),
};

const HELP: React.CSSProperties = {
  margin: "8px 0 0",
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: 1.6,
  color: cbm("gray-300"),
};

/**
 * Escolha do tipo, plano mensal e texto livre.
 *
 * O estado vive só na memória da página. O href do WhatsApp é derivado na
 * renderização, sem efeito, cookie, localStorage ou evento com as escolhas.
 */
export function CalculadoraForm() {
  const baseId = useId();
  const detalhesId = `${baseId}-detalhes`;
  const [tipo, setTipo] = useState<CalculadoraTipo | null>(null);
  const [plano, setPlano] = useState(false);
  const [detalhes, setDetalhes] = useState("");

  const escolhido = CALC_TIPOS.find((item) => item.id === tipo) ?? null;
  const href = waLink(calculatorMessage({ tipo, plano, detalhes }));

  return (
    <div data-cm-section="calculadora">
      <fieldset className="calc-fieldset">
        <legend style={LABEL}>Tipo de site</legend>
        <div className="calc-choices">
          {CALC_TIPOS.map((item) => (
            <label key={item.id} className="calc-choice">
              <input
                type="radio"
                name={`${baseId}-tipo`}
                value={item.id}
                checked={tipo === item.id}
                onChange={() => setTipo(item.id)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div style={{ marginTop: 22 }}>
        <p style={LABEL}>Extra</p>
        <label className="calc-choice" style={{ marginTop: 12 }}>
          <input
            type="checkbox"
            checked={plano}
            onChange={(event) => setPlano(event.target.checked)}
          />
          <span>{CALC_PLANO_LABEL}</span>
        </label>
      </div>

      <div style={{ marginTop: 22 }}>
        <label htmlFor={detalhesId} style={LABEL}>
          Observações
        </label>
        <textarea
          id={detalhesId}
          className="calc-field"
          rows={4}
          maxLength={1000}
          autoComplete="off"
          placeholder="Ex.: conte o que mais o seu site precisa"
          value={detalhes}
          onChange={(event) => setDetalhes(event.target.value)}
        />
        <p style={HELP}>Texto livre, opcional. Entra só na mensagem do WhatsApp.</p>
      </div>

      <div className="calc-result" role="status" aria-live="polite">
        {escolhido ? (
          <>
            <p style={{ ...LABEL, color: "#FB3640" }}>{escolhido.label}</p>
            <p
              style={{
                margin: "10px 0 0",
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: "clamp(22px, 3vw, 32px)",
                lineHeight: 1.15,
                color: "#F5F2ED",
              }}
            >
              {escolhido.preco}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 16,
                color: cbm("gray-100"),
              }}
            >
              {escolhido.prazo}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 16,
                color: cbm("gray-100"),
              }}
            >
              {CALC_INCLUSO}
            </p>
            <p style={{ ...HELP, color: cbm("gray-100") }}>{CALC_ESCOPO}</p>
          </>
        ) : (
          <p style={{ ...HELP, margin: 0 }}>
            Escolha landing page ou site institucional para ver a faixa.
          </p>
        )}
      </div>

      <div className="calc-actions">
        <FillButton
          href={href}
          target="_blank"
          data-cm-role="whatsapp"
          data-cm-id="calculadora-whatsapp"
          style={{ minHeight: 44 }}
        >
          Pedir orçamento no WhatsApp
        </FillButton>
        <Link
          href="/contato"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 44,
            color: "#F5F2ED",
            fontFamily: SATOSHI,
            fontWeight: 500,
            fontSize: 15,
            textDecoration: "underline",
            textDecorationColor: "#FB3640",
            textUnderlineOffset: 3,
          }}
        >
          Página de contato
        </Link>
      </div>
    </div>
  );
}
