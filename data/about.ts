/**
 * Copy da seção Sobre.
 *
 * Fonte única: consumido pela zona Sobre da Home e pelo bloco Sobre da rota
 * /portfolio. Mudar aqui muda nos dois.
 */

/** Manifesto da marca — a headline do bloco Sobre. */
export const ABOUT_STATEMENT =
  "A Coded by M une design, tecnologia e pensamento estrutural pra construir uma presença digital à altura da empresa por trás dela.";

export interface Founder {
  name: string;
  role: string;
  bio: string;
}

export const FOUNDER: Founder = {
  name: "Matheus Mendes",
  role: "Fundador · Coded by M",
  bio: "Formado em Análise e Desenvolvimento de Sistemas, encontrei no web design o ponto onde técnica e estética se encontram. A Coded by M é onde levo isso a sério — cada projeto, uma busca por uma presença digital tão boa quanto a empresa por trás dela.",
};

export const LOCATION = "Florianópolis, Brasil";

export interface AboutValue {
  title: string;
  desc: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  { title: "Precisão", desc: "Cada pixel tem razão de existir." },
  { title: "Elegância", desc: "Sofisticação que não precisa gritar." },
  { title: "Detalhismo", desc: "O acabamento é o produto." },
];
