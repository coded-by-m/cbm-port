/**
 * Conteúdo da seção Sobre da Coded by M.
 *
 * Fonte única: consumido pela zona Sobre da experiência (/experiencia) e pelo
 * bloco Sobre da home. Não duplique este copy em componente.
 */

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
    bio: "Formado em Análise e Desenvolvimento de Sistemas, encontrei no web design o ponto onde técnica e estética se encontram. A Coded by M é onde levo isso a sério: cada projeto, uma busca por uma presença digital tão boa quanto a empresa por trás dela.",
  },
  location: "Florianópolis, Brasil",
} as const;

export interface Skill {
  label: string;
  /** O que o cliente recebe, em uma frase. Fato, não nota. */
  desc: string;
}

/**
 * O que entra em cada projeto.
 *
 * Os rótulos são específicos de propósito: "Web Design, Branding,
 * Development" poderia ser de qualquer um. Sem escala nem nota: autoavaliação
 * de 1 a 10 não diz nada a quem contrata. Cada linha diz o que é entregue.
 */
export const SKILLS: Skill[] = [
  {
    label: "Web design & interface",
    desc: "Layout desenhado para o seu conteúdo, sem template, pensado do celular ao desktop.",
  },
  {
    label: "Front-end · React, Next.js, TypeScript",
    desc: "Código próprio, sem construtor de sites. Na entrega, código e acessos ficam com você.",
  },
  {
    label: "Design system",
    desc: "Cores, tipografia e componentes definidos uma vez, para o site crescer sem perder a cara.",
  },
  {
    label: "Motion & WebGL",
    desc: "Movimento e 3D quando ajudam a contar a história, nunca no caminho da leitura.",
  },
  {
    label: "Performance & SEO",
    desc: "Páginas leves, metadados e dados estruturados prontos para o Google desde o primeiro dia.",
  },
];
