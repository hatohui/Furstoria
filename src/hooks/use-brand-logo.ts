import { useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { selectIsRevealed, useIntroStore } from "@stores/use-intro-store";
import { REDUCED_MOTION_QUERY, motionDuration } from "@utils/motion";

gsap.registerPlugin(useGSAP, Flip);

/** How long the logo holds on the dark screen before the roster may enter. */
const LOGO_HOLD = 0.6;

/**
 * The logo is the first thing on screen: it resolves out of a blur on the
 * dark stage and holds there while the artwork loads. When the roster slides
 * in, the logo docks into the top-right corner like a navbar mark at the
 * same time.
 */
export function useBrandLogo() {
  const introRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const isDocked = useIntroStore(selectIsRevealed);
  const markLogoShown = useIntroStore((s) => s.markLogoShown);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      gsap.set(introRef.current, { autoAlpha: 1 });
      markLogoShown();
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ delay: 0.2, onComplete: markLogoShown })
        .fromTo(
          introRef.current,
          { autoAlpha: 0, scale: 1.25, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
          },
        )
        .to({}, { duration: LOGO_HOLD });
    });
  });

  useGSAP(
    () => {
      if (!isDocked) return;

      // The logo has already re-rendered into its docked (corner) layout.
      // Measure the transform that would put it back over the centre slot
      // and animate from there, so CSS owns the final position on resize.
      const fromSlot = Flip.fit(logoRef.current, slotRef.current, {
        scale: true,
        getVars: true,
      }) as gsap.TweenVars;

      gsap.from(logoRef.current, {
        ...fromSlot,
        // Matches the roster's slide-in so both land together.
        duration: motionDuration(1.3),
        ease: "expo.out",
      });
    },
    { dependencies: [isDocked] },
  );

  return { introRef, slotRef, logoRef, isDocked };
}
