"use client";

import { useEffect } from "react";
import { trackProjectView } from "@/lib/analytics";

/** Dispara `project_view` uma vez por abertura de case. Não renderiza nada. */
export function TrackProjectView({ slug }: { slug: string }) {
  useEffect(() => {
    trackProjectView(slug);
  }, [slug]);
  return null;
}
