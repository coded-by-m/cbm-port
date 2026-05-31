import { LogoMark } from "@/components/ui/LogoMark";

function CollagePanel({
  src,
  className = "",
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ background: "#070B08", ...style }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center opacity-20">
          <LogoMark size={32} />
        </div>
      )}
    </div>
  );
}

export function CaseHeroCollage({ images }: { images: string[] }) {
  const [i0, i1, i2, i3, i4] = images;

  return (
    <div
      className="grid h-full"
      style={{
        gridTemplateColumns: "3fr 2fr",
        gridTemplateRows: "2fr 1.1fr 1.1fr",
        gap: "3px",
        padding: "3px",
        background: "#000F08",
      }}
    >
      <CollagePanel src={i0 ?? ""} style={{ gridRow: "1 / 3" }} />
      <CollagePanel src={i1 ?? ""} />
      <CollagePanel src={i2 ?? ""} />
      <CollagePanel src={i3 ?? ""} />
      <CollagePanel src={i4 ?? ""} />
    </div>
  );
}
