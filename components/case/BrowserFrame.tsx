import type { ReactNode } from "react";

/**
 * Moldura de browser (chrome mac): barra com 3 dots (1 signal-red) + pill de URL.
 * Bracket triangular vermelho no canto. Corpo em overflow-hidden.
 */
export function BrowserFrame({
  url,
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border border-[#F5F2ED]/15 bg-[#0E1810] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-3 border-b border-[#F5F2ED]/10 bg-[#0b130d] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FB3640]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F5F2ED]/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F5F2ED]/25" />
        </span>
        {url && (
          <span className="ml-1 inline-flex items-center gap-1.5 truncate rounded-sm bg-[#F5F2ED]/[0.06] px-3 py-1 font-body text-[10px] tracking-wide text-[#F5F2ED]/50">
            <svg
              width="8"
              height="8"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="flex-shrink-0"
            >
              <rect
                x="3"
                y="7"
                width="10"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M5 7V5a3 3 0 0 1 6 0v2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            {url}
          </span>
        )}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 h-3 w-3 border-b border-r border-[#FB3640]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
