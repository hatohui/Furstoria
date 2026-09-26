import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { selectIsRevealed, useIntroStore } from "@stores/use-intro-store";
import { REDUCED_MOTION_QUERY } from "@utils/motion";

gsap.registerPlugin(useGSAP);

/**
 * Fades and lifts an element in once the intro gate opens, after `delay`
 * seconds.
 */
export function useIntroReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  const isRevealed = useIntroStore(selectIsRevealed);

  useGSAP(
    () => {
      if (!isRevealed) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(ref.current, { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { autoAlpha: 0, y: -16 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay },
        );
      });
    },
    { dependencies: [isRevealed] },
  );

  return ref;
}
