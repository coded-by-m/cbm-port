import type { CaseMeta } from "@/types/case";

export function ProjectFacts({ meta }: { meta: CaseMeta }) {
  const fields: { label: string; value: string }[] = [
    { label: "Cliente", value: meta.cliente },
    { label: "Setor",   value: meta.setor   },
    { label: "Tipo",    value: meta.tipo    },
    { label: "Ano",     value: meta.ano     },
  ];

  return (
    <div
      className="mt-10 border-t pt-8"
      style={{ borderColor: "rgba(245,242,237,0.06)" }}
    >
      <p className="mb-5 font-body text-[8px] uppercase tracking-[0.35em] text-cbm-gray-600">
        Projeto
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-600">
              {label}
            </p>
            <p className="mt-1 font-body text-[13px] font-medium text-cbm-gray-100">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
