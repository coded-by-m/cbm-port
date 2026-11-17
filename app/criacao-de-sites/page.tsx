import type { Metadata } from "next";
import { LANDING, LANDING_PATH, type LandingBlock, type LandingConfig } from "@/data/landings";
import { SURFACE } from "@/components/site/shared";
import { LpFooter } from "@/components/lp/LpFooter";
import { LpHeader } from "@/components/lp/LpHeader";
import {
  LpDifferentials,
  LpFaq,
  LpFinal,
  LpHero,
  LpOffer,
  LpPains,
  LpProcess,
  LpPromise,
  LpProof,
} from "@/components/lp/LpBlocks";

const BLOCKS: Record<LandingBlock, (props: { lp: LandingConfig }) => JSX.Element | null> = {
  hero: LpHero,
  pains: LpPains,
  promise: LpPromise,
  proof: LpProof,
  differentials: LpDifferentials,
  offer: LpOffer,
  process: LpProcess,
  faq: LpFaq,
  final: LpFinal,
};

const lp = LANDING;

export const metadata: Metadata = {
  title: lp.meta.title,
  description: lp.meta.description,
  alternates: { canonical: LANDING_PATH },
  /**
   * Noindex de propósito. A página existe pra receber clique pago: se o
   * Google a indexasse, ela competiria com a `/` pelas mesmas buscas e
   * entregaria a quem vem da busca uma página sem navegação.
   */
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: LANDING_PATH,
    title: lp.meta.title,
    description: lp.meta.description,
    images: [lp.meta.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: lp.meta.title,
    description: lp.meta.description,
    images: [lp.meta.ogImage],
  },
};

/**
 * Landing de campanha.
 *
 * Não é a home com outra headline: a home é navegável e convida a explorar,
 * esta é um corredor com uma porta no fim. Um único tipo de CTA, repetido, e
 * nenhuma saída lateral — a ordem dos blocos leva do reconhecimento da dor
 * até o contato.
 *
 * Sem `three` e sem o rodapé-showpiece: esta é a página que recebe gente no
 * 4G, e cada KB aqui sai do bolso duas vezes — em conversão perdida e em
 * custo por clique.
 */
export default function LandingPage() {
  return (
    <div
      className="site-home"
      /* Sem `overflow` aqui: overflow em QUALQUER ancestral mata o
         `position: sticky` do cabeçalho. A landing não tem drawer, então
         também não precisa dele. */
      style={{ background: SURFACE.base, color: "#F5F2ED" }}
    >
      <LpHeader message={lp.waMessage} />
      <main>
        {lp.blocks.map((key) => {
          const Block = BLOCKS[key];
          return <Block key={key} lp={lp} />;
        })}
      </main>
      <LpFooter message={lp.waMessage} />
    </div>
  );
}
