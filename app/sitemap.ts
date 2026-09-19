import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cases } from "@/data/cases";

/** Rotas públicas. `/lp/*` nasce noindex e nunca entra aqui. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const caseRoutes = cases
    .filter((c) => c.status === "published")
    .map((c) => ({
      url: `${SITE_URL}/cases/${c.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/experiencia`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projetos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...caseRoutes,
  ];
}
