import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANDINGS, getLanding } from "@/data/landings";
import { SURFACE } from "@/components/site/shared";
import { LpHeader } from "@/components/lp/LpHeader";
import {
  LpFaq,
  LpFinal,
  LpHero,
  LpPains,
  LpProcess,
  LpPromise,
  LpProof,
} from "@/components/lp/LpBlocks";

type Params = { params: { segmento: string } };

/** Pré-renderiza todos os segmentos; abrir um novo é acrescentar um objeto. */
export function generateStaticParams() {
  return LANDINGS.map((l) => ({ segmento: l.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const lp = getLanding(params.segmento);
  if (!lp) return { title: "Não encontrado" };
  return {
    title: lp.meta.title,
    description: lp.meta.description,
    /**
     * Noindex de propósito. A página existe pra receber clique pago: se o
     * Google a indexasse, ela competiria com a `/` pelas mesmas buscas e
     * entregaria a quem vem da busca uma página sem navegação.
     */
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "pt_BR",
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
}

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
export default function LandingPage({ params }: Params) {
  const lp = getLanding(params.segmento);
  if (!lp) notFound();

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
        <LpHero lp={lp} />
        <LpPains lp={lp} />
        <LpPromise lp={lp} />
        <LpProof lp={lp} />
        <LpProcess />
        <LpFaq lp={lp} />
        <LpFinal lp={lp} />
      </main>
    </div>
  );
}
