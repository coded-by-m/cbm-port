import type { CaseProject } from "@/types/case";
import { LogoMark } from "@/components/ui/LogoMark";

function GalleryPanel({ src }: { src: string }) {
  return (
    <div
      className="overflow-hidden"
      style={{ background: "#070B08", minHeight: 220 }}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" aria-hidden="true" />
      ) : (
        <div className="flex h-full w-full items-center justify-center opacity-20" style={{ minHeight: 220 }}>
          <LogoMark size={28} />
        </div>
      )}
    </div>
  );
}

export function CaseGallery({ project }: { project: CaseProject }) {
  const [g0, g1, g2, g3, g4] = project.gallery;

  return (
    <section
      className="border-b px-12 py-20 xl:px-16 xl:py-24"
      style={{
        background: "#000F08",
        borderColor: "rgba(245,242,237,0.06)",
      }}
    >
      <p className="mb-6 font-body text-[9px] uppercase tracking-[0.35em] text-cbm-gray-600">
        Resultado Visual
      </p>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: "3px",
          background: "#000F08",
        }}
      >
        <div style={{ gridRow: "1 / 3" }}>
          <GalleryPanel src={g0 ?? ""} />
        </div>
        <GalleryPanel src={g1 ?? ""} />
        <GalleryPanel src={g2 ?? ""} />
        <GalleryPanel src={g3 ?? ""} />
        <GalleryPanel src={g4 ?? ""} />
      </div>
    </section>
  );
}
