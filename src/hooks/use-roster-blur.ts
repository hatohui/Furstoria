import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { selectIsRevealed, useIntroStore } from "@stores/use-intro-store";
import { motionDuration } from "@utils/motion";

gsap.registerPlugin(useGSAP);

/**
 * Holds the roster behind a blur until the intro gate opens (the moment the
 * logo starts docking), then slowly clears it. The layer is hidden once the
 * blur reaches zero so the backdrop filter stops costing paint time.
 */
export function useRosterBlur() {
  const blurRef = useRef<HTMLDivElement>(null);
  const isRevealed = useIntroStore(selectIsRevealed);

  useGSAP(
    () => {
      if (!isRevealed) return;

      gsap.to(blurRef.current, {
        "--roster-blur": "0px",
        duration: motionDuration(1.5),
        ease: "sine.inOut",
        onComplete: () => gsap.set(blurRef.current, { autoAlpha: 0 }),
      });
    },
    { dependencies: [isRevealed] },
  );

  return blurRef;
}
