"use client";

import { useRef } from "react";
import gsap from "gsap";

export default function DotsNav({
  count,
  activeIndex,
  onGo,
}: {
  count: number;
  activeIndex: number;
  onGo: (index: number) => void;
}) {
  const lineRef = useRef<HTMLDivElement>(null);

  if (lineRef.current) {
    gsap.to(lineRef.current, {
      width: `${((activeIndex + 1) / count) * 100}%`,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }

  return (
    <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-3">
      <div className="h-px w-32 overflow-hidden bg-[#F5F2ED]/10">
        <div
          ref={lineRef}
          className="h-full bg-[#FB3640]/60"
          style={{ width: "0%" }}
        />
      </div>
      <div className="flex gap-3">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Projeto ${i + 1}`}
            onClick={() => onGo(i)}
            className="h-1.5 w-1.5 rounded-full transition-all duration-300 ease-out"
            style={{
              backgroundColor: activeIndex === i ? "#FB3640" : "#F5F2ED",
              opacity: activeIndex === i ? 1 : 0.25,
              transform: activeIndex === i ? "scale(1.5)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
