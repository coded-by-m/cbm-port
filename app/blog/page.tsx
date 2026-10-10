import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publishedPosts } from "@/data/blog";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";

const TITLE = "Blog — sites, landing pages e presença digital";
const DESCRIPTION =
  "Artigos da Coded by M sobre criação de sites e landing pages: preço, escolha do formato e o que cada projeto precisa ter.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = publishedPosts();
  // Sem artigo publicado, a listagem não existe (ver data/blog.ts).
  if (posts.length === 0) notFound();

  return (
    <ProseShell label="Blog" current="/blog">
      <JsonLd
        data={graph(
          webPageSchema({ path: "/blog", name: TITLE, description: DESCRIPTION, type: "CollectionPage" }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        )}
      />
      <h1 style={PROSE_H1}>Blog</h1>
      <p style={PROSE_P}>{DESCRIPTION}</p>
      {posts.map((p) => (
        <article key={p.slug}>
          <h2 style={PROSE_H2}>
            <Link href={`/blog/${p.slug}`} style={{ color: "inherit" }}>
              {p.title}
            </Link>
          </h2>
          <p style={PROSE_P}>{p.description}</p>
        </article>
      ))}
    </ProseShell>
  );
}
