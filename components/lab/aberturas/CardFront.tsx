import { MESH_EDGES } from "@/data/cartao";

/**
 * A frente do cartão de visita adaptada à tela: preto, símbolo no centro com
 * os traços em prata e o relevo sangrando na base.
 *
 * O relevo usa as mesmas arestas da arte impressa (`data/cartao.ts`). Só a
 * faixa de baixo do cartão (y de 30 a 48 mm) entra no viewBox, e ela é
 * esticada pra cobrir a largura da tela.
 */
export function CardFront() {
  return (
    <div className="ab-card">
      <svg
        aria-hidden
        className="ab-card-mesh"
        viewBox="0 30 90 18"
        preserveAspectRatio="xMidYMax slice"
      >
        {MESH_EDGES.map(([x1, y1, x2, y2, a], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#8b9094"
            strokeOpacity={a * 0.55}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <svg aria-hidden className="ab-card-logo" viewBox="0 0 142 161" fill="none">
        <path
          d="M11.5 148.039V59.0391L53.5 104.438"
          stroke="#C5C9CB"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M130.5 103.039V19.0391L85.5 67.2944"
          stroke="#C5C9CB"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.5 18.0391L130.5 147.039" stroke="#FB3640" strokeWidth="9" strokeLinecap="round" />
      </svg>
    </div>
  );
}
