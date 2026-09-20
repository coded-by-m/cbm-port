/**
 * Conteúdo da seção Sobre da Coded by M.
 *
 * Fonte única: consumido pela zona Sobre da experiência (/experiencia) e pelo
 * bloco Sobre da home. Não duplique este copy em componente.
 */

export interface Value {
  title: string;
  desc: string;
}

export const ABOUT = {
  manifesto:
    "A Coded by M une design, tecnologia e pensamento estrutural pra construir uma presença digital à altura da empresa por trás dela.",
  founder: {
    name: "Matheus Mendes",
    role: "Fundador · Coded by M",
    /**
     * Retrato do fundador. Solte o arquivo em `public/marca/` e aponte aqui
     * — enquanto for `undefined`, o bloco Sobre mostra o símbolo CbM em
     * wireframe, que é o estado atual.
     */
    photo: undefined as string | undefined,
    bio: "Formado em Análise e Desenvolvimento de Sistemas, encontrei no web design o ponto onde técnica e estética se encontram. A Coded by M é onde levo isso a sério — cada projeto, uma busca por uma presença digital tão boa quanto a empresa por trás dela.",
  },
  location: "Florianópolis, Brasil",
} as const;

/** Degraus da escala de capacidades. Define quantos losangos cada linha tem. */
export const SKILL_SCALE = 10;

export interface Skill {
  label: string;
  /** 1–`SKILL_SCALE`. Convenção de leitura para "isto é meu forte", não medição. */
  level: number;
}

/**
 * Capacidades do estúdio.
 *
 * Os rótulos são específicos de propósito: "Web Design, Branding,
 * Development" poderia ser de qualquer um. Os números são afirmação do
 * fundador — ajuste aqui.
 *
 * A escala é de 1 a 10, não porcentagem: 87% sugere medição de algo, e não há
 * o que medir. Dez degraus são uma opinião assumida.
 */
export const SKILLS: Skill[] = [
  { label: "Web design & interface", level: 10 },
  { label: "Front-end · React, Next.js, TypeScript", level: 9 },
  { label: "Design system", level: 9 },
  { label: "Motion & WebGL", level: 8 },
  { label: "Performance & SEO", level: 8 },
];

export const VALUES: Value[] = [
  { title: "Precisão", desc: "Cada pixel tem razão de existir." },
  { title: "Elegância", desc: "Sofisticação que não precisa gritar." },
  { title: "Detalhismo", desc: "O acabamento é o produto." },
];
