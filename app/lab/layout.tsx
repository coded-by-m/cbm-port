import type { Metadata } from "next";

/**
 * O `page.tsx` do laboratório é client component e não pode exportar
 * `metadata` — daí este layout, que existe só para marcar a rota como
 * noindex. O `robots.ts` já barra o crawler; isto cobre quem chega por link.
 */
export const metadata: Metadata = {
  title: "Laboratório",
  robots: { index: false, follow: false },
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
