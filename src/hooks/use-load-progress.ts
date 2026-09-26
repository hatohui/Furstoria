import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  selectIsRevealed,
  selectLoadProgress,
  useIntroStore,
} from "@stores/use-intro-store";
import { motionDuration } from "@utils/motion";

gsap.registerPlugin(useGSAP);

/** Fills a bar as artwork loads, then collapses it once the intro opens. */
export function useLoadProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progress = useIntroStore(selectLoadProgress);
  const isRevealed = useIntroStore(selectIsRevealed);

  useGSAP(
    () => {
      gsap.to(barRef.current, {
        scaleX: progress,
        duration: motionDuration(0.5),
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    { dependencies: [progress] },
  );

  useGSAP(
    () => {
      if (!isRevealed) return;

      gsap.to(trackRef.current, {
        autoAlpha: 0,
        scaleX: 0,
        duration: motionDuration(0.4),
        ease: "power2.in",
      });
    },
    { dependencies: [isRevealed] },
  );

  return { trackRef, barRef, progress };
}
