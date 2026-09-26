import { useCallback, useRef, type FocusEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCharacterSelectStore } from "@stores/use-character-select-store";
import { selectIsRevealed, useIntroStore } from "@stores/use-intro-store";
import { REDUCED_MOTION_QUERY } from "@utils/motion";

gsap.registerPlugin(useGSAP);

const PANEL_SELECTOR = "[data-roster-panel]";

/**
 * Owns the roster strip: once the intro gate opens, plays the entrance
 * (panels slide in along the skew axis, alternating from top and bottom),
 * unlocks interaction once it lands, and clears the active character when
 * the pointer or keyboard focus leaves the roster.
 */
export function useCharacterRoster() {
  const rosterRef = useRef<HTMLUListElement>(null);
  const clearActive = useCharacterSelectStore((s) => s.clearActive);
  const isRevealed = useIntroStore(selectIsRevealed);
  const markRosterReady = useIntroStore((s) => s.markRosterReady);

  useGSAP(
    () => {
      if (!isRevealed) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(PANEL_SELECTOR, { autoAlpha: 1 });
        markRosterReady();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          PANEL_SELECTOR,
          { autoAlpha: 1, yPercent: (i: number) => (i % 2 === 0 ? -110 : 110) },
          {
            yPercent: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.09,
            onComplete: markRosterReady,
          },
        );
      });
    },
    { scope: rosterRef, dependencies: [isRevealed] },
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLUListElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) clearActive();
    },
    [clearActive],
  );

  return { rosterRef, onMouseLeave: clearActive, onBlur: handleBlur };
}
