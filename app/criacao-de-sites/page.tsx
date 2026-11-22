import type { Metadata } from "next";
import "./landing.css";
import { Contact, Footer } from "@/components/landing/Contact";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Projects } from "@/components/landing/Projects";
import {
  About,
  Deliverables,
  Faq,
  Investment,
  Process,
  Situations,
} from "@/components/landing/Sections";
import { LANDING_PATH, META } from "@/data/criacaoDeSites";
import { OG, OG_SIZE } from "@/lib/seo";

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: LANDING_PATH },
  /**
   * Noindex de propósito. A página existe para receber clique pago: se o
   * Google a indexasse, ela competiria com a `/` e com `/site-institucional`
   * pelas mesmas buscas. O que importa aqui é o preview do link quando alguém
   * encaminha a página no WhatsApp, e isso é o Open Graph abaixo.
   */
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: LANDING_PATH,
    title: META.title,
    description: META.description,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M: criação de sites para empresas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
    images: [OG.home],
  },
};

/**
 * Landing comercial de sites institucionais e landing pages.
 *
 * A ordem segue as perguntas de quem compara fornecedores: é para mim? (abertura),
 * tem cliente de verdade? (projetos), resolve o meu caso? (situações), o que
 * eu recebo? (entregas), como funciona e onde eu aprovo? (processo), quem
 * faz? (quem faz), quanto custa no total? (investimento), e as objeções que
 * sobraram (dúvidas). A única ação é pedir orçamento no WhatsApp.
 *
 * Sem `three` e sem WebGL: é a página que recebe gente no 4G, e o 3D do
 * estúdio já aparece onde cumpre função, nos projetos conceituais que a
 * pessoa pode abrir.
 *
 * Copy em `data/criacaoDeSites.ts`. Estratégia, medição e pendências em
 * `docs/lp/criacao-de-sites.md`.
 */
export default function LandingPage() {
  return (
    /* `site-home` mantém o fundo do <body> na base da paleta (globals.css).
       Sem `overflow` aqui: overflow em ancestral mata o `position: sticky`
       do cabeçalho. */
    <div className="site-home cs-page">
      <a href="#conteudo" className="cs-skip">
        Pular para o conteúdo
      </a>
      <Header />
      {/* `tabIndex={-1}`: o link "Pular para o conteúdo" leva o foco, não só a rolagem. */}
      <main id="conteudo" tabIndex={-1} className="cs-main">
        <Hero />
        <Projects />
        <Situations />
        <Deliverables />
        <Process />
        <About />
        <Investment />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
