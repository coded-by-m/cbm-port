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

export const VALUES: Value[] = [
  { title: "Precisão", desc: "Cada pixel tem razão de existir." },
  { title: "Elegância", desc: "Sofisticação que não precisa gritar." },
  { title: "Detalhismo", desc: "O acabamento é o produto." },
];
