"use client";

import { useRosterBlur } from "@hooks/use-roster-blur";

/** Blurs the roster behind it until the intro opens, then clears. */
export function RosterBlur() {
  const blurRef = useRosterBlur();

  return (
    <div
      ref={blurRef}
      className="pointer-events-none absolute inset-0 backdrop-blur-(--roster-blur) [--roster-blur:24px]"
    />
  );
}
