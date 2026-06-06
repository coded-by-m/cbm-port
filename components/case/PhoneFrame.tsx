import type { ReactNode } from "react";

/** Moldura de celular: bezel arredondado + notch, conteúdo em overflow-hidden. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[34px] border-[6px] border-[#0E1810] bg-[#0E1810] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] ring-1 ring-[#F5F2ED]/15">
      <span
        aria-hidden
        className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-[#F5F2ED]/25"
      />
      <div className="overflow-hidden rounded-[28px]">{children}</div>
    </div>
  );
}
