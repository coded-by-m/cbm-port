import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPost, publishedPosts } from "@/data/blog";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_LINK, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";

/** Só artigo publicado vira página; rascunho responde 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts().map((p) => ({ slug: p.slug }));
}

type Params = { params: { slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const post = getPublishedPost(params.slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${post.title} · Coded by M`,
      description: post.description,
      url: path,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
    },
  };
}

export default function BlogPostPage({ params }: Params) {
  const post = getPublishedPost(params.slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;

  return (
    <ProseShell label="Blog">
      <JsonLd
        data={graph(
          webPageSchema({ path, name: post.title, description: post.description }),
          articleSchema({
            path,
            title: post.title,
            description: post.description,
            datePublished: post.datePublished,
            dateModified: post.dateModified,
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
        )}
      />
      <article>
        <h1 style={PROSE_H1}>{post.title}</h1>
        <p
          style={{
            ...PROSE_P,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7E7A74",
          }}
        >
          Matheus Mendes ·{" "}
          <time dateTime={post.datePublished}>
            {post.datePublished.split("-").reverse().join("/")}
          </time>
        </p>
        <p style={{ ...PROSE_P, color: "#E8E4DE" }}>{post.lead}</p>
        {post.sections.map((s) => (
          <section key={s.heading}>
            <h2 style={PROSE_H2}>{s.heading}</h2>
            {s.body.map((para) => (
              <p key={para} style={PROSE_P}>
                {para}
              </p>
            ))}
          </section>
        ))}
        <p style={{ ...PROSE_P, marginTop: 48 }}>
          Veja também:{" "}
          {post.related.map((r, i) => (
            <span key={r.href}>
              {i > 0 && " · "}
              <Link href={r.href} style={PROSE_LINK}>
                {r.label}
              </Link>
            </span>
          ))}
        </p>
      </article>
    </ProseShell>
  );
}
