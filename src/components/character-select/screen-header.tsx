"use client";

import { useIntroReveal } from "@hooks/use-intro-reveal";

export function ScreenHeader() {
  const headerRef = useIntroReveal<HTMLElement>(0.6);

  return (
    <header
      ref={headerRef}
      className="pointer-events-none invisible absolute inset-x-0 top-0 flex items-center justify-between px-[6vw] pt-6 font-display text-xs tracking-[0.35em] text-white/80 uppercase sm:text-sm"
    >
      <span className="flex items-center gap-3">
        <span className="h-px w-8 bg-white/60" />
        Select your character
      </span>
      <span className="hidden text-white/50 sm:inline">Hover to preview</span>
    </header>
  );
}
