import type { CaseMeta } from "@/types/case";

export function ProjectFacts({
  meta,
  stack,
}: {
  meta: CaseMeta;
  stack?: string[];
}) {
  const fields: { label: string; value: string }[] = [
    { label: "Cliente", value: meta.cliente },
    { label: "Setor",   value: meta.setor   },
    { label: "Tipo",    value: meta.tipo    },
    { label: "Ano",     value: meta.ano     },
  ];

  return (
    <div
      className="mt-9 border-t pt-7"
      style={{ borderColor: "rgba(245,242,237,0.08)" }}
    >
      <p className="mb-6 font-body text-[9px] uppercase tracking-[0.35em] text-cbm-gray-400">
        Projeto
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-[440px]">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
              {label}
            </p>
            <p className="mt-1.5 font-body text-[15px] font-medium text-cbm-gray-100">
              {value}
            </p>
          </div>
        ))}
      </div>

      {stack && stack.length > 0 && (
        <div className="mt-7">
          <p className="mb-3 font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
            Stack
          </p>
          <div className="flex flex-wrap gap-2 max-w-[440px]">
            {stack.map((tech) => (
              <span
                key={tech}
                className="border border-[#F5F2ED]/15 px-2.5 py-1 font-body text-[11px] tracking-wide text-cbm-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
