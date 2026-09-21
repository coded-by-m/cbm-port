import "./_still";
import { StrokeText } from "cbm-port";

// O card e uma foto, e o StrokeText fica invisivel ate medir a fonte e so
// aparece conforme a linha do tempo roda. Por isso os tempos abaixo sao
// praticamente zero: o que o card precisa mostrar e o ESTADO FINAL — contorno
// desenhado e cor ja fechada por dentro. No site os valores sao os defaults
// (drawDuration 1.1s, stagger 0.055), e e assim que o gesto deve ser usado.
//
// `fontFamily` e passado explicitamente porque e o que a home faz: sem ele o
// desenho mede na fonte herdada, e a metrica da caixa muda.
//
// E `fontSize` precisa ir DUAS vezes: a prop define a metrica que gera a caixa
// em `em`, e o `style` define o tamanho real em CSS. So a prop e o bloco sai
// com 1em = 16px, minusculo — foi exatamente o que aconteceu na primeira volta.

const PANCHANG = '"Panchang", sans-serif';

// Dispara o download da Panchang no escopo do modulo, antes de o React montar.
// O StrokeText so mede depois que document.fonts.load resolve; se esse download
// so comeca na montagem, ele resolve junto com document.fonts.ready — que e
// exatamente quando a captura tira a foto, sem sobrar quadro pra desenhar.
if (typeof document !== "undefined" && document.fonts) {
  void document.fonts.load('800 72px "Panchang"');
  void document.fonts.load('800 64px "Panchang"');
}

const instant = {
  fontFamily: PANCHANG,
  drawDuration: 0.01,
  fillDelay: 0,
  stagger: 0,
  delay: 0,
} as const;

export function Assinatura() {
  return (
    <div style={{ padding: "36px 32px" }}>
      <StrokeText {...instant} text="Coded" fontSize={72} style={{ fontSize: 72 }} />
      <StrokeText {...instant} text="by M" fontSize={72} style={{ fontSize: 72 }} />
    </div>
  );
}

export function SinalEmVermelho() {
  return (
    <div style={{ padding: "36px 32px" }}>
      <StrokeText
        {...instant}
        text="Precisão"
        strokeColor="#F5F2ED"
        fillColor="#FB3640"
        fontSize={64}
        style={{ fontSize: 64 }}
      />
    </div>
  );
}

/** `fillMode: "none"` deixa so o contorno — a palavra como estrutura. */
export function SoContorno() {
  return (
    <div style={{ padding: "36px 32px" }}>
      <StrokeText
        {...instant}
        text="Estrutura"
        strokeColor="#F5F2ED"
        fillMode="none"
        strokeWidth={1.2}
        fontSize={64}
        style={{ fontSize: 64 }}
      />
    </div>
  );
}
