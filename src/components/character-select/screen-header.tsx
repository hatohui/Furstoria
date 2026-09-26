"use client";

import { useIntroReveal } from "@hooks/use-intro-reveal";

export function ScreenHeader() {
  const headerRef = useIntroReveal<HTMLElement>(0.6);

  return (
    <header
      ref={headerRef}
      className="pointer-events-none invisible absolute inset-x-0 top-0 flex h-24 items-center px-[6vw] font-display text-xs tracking-[0.35em] text-white/80 uppercase sm:text-sm"
    >
      {/* The right side of this row is where the logo docks. */}
      <span className="flex items-center gap-3">
        <span className="h-px w-8 bg-white/60" />
        Select your character
      </span>
    </header>
  );
}
