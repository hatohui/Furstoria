"use client";

import { useLoadProgress } from "@hooks/use-load-progress";

export function LoadProgress() {
  const { trackRef, barRef, progress } = useLoadProgress();

  return (
    <div
      ref={trackRef}
      role="progressbar"
      aria-label="Loading characters"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="absolute inset-x-[16%] -bottom-8 h-px bg-white/15"
    >
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-white/80" />
    </div>
  );
}
