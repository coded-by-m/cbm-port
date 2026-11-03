import "./_still";
import { TriText } from "cbm-port";

// O titulo que se revela pela malha da marca: a palavra e uma malha
// triangulada recortada pelas letras, e cada triangulo acende da esquerda
// para a direita, com filetes vermelhos passando por dentro e sumindo. Num
// card estatico aparece o estado final (quem pede menos movimento recebe o
// mesmo). O tamanho na tela vem do font-size herdado.

const PANCHANG = '"Panchang", sans-serif';

export function Assinatura() {
  return (
    <div style={{ padding: 32, fontSize: 96, lineHeight: 0.84 }}>
      <TriText text="Coded" fontFamily={PANCHANG} fontWeight={800} letterSpacing={-0.04 * 128} />
      <TriText text="by M" fontFamily={PANCHANG} fontWeight={800} letterSpacing={-0.04 * 128} delay={0.3} />
    </div>
  );
}

/** Uma palavra so, em corpo de titulo de secao. */
export function Titulo() {
  return (
    <div style={{ padding: 32, fontSize: 56 }}>
      <TriText text="Projetos" fontFamily={PANCHANG} fontWeight={700} />
    </div>
  );
}
