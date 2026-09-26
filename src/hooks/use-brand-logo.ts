import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCharacterSelectStore } from "@stores/use-character-select-store";
import { selectIsRevealed, useIntroStore } from "@stores/use-intro-store";
import { REDUCED_MOTION_QUERY, motionDuration } from "@utils/motion";

gsap.registerPlugin(useGSAP);

/** How long the logo holds on the dark screen before the roster may enter. */
const LOGO_HOLD = 0.6;

/**
 * The logo is the first thing on screen: it resolves out of a blur on the
 * dark stage and holds there while the artwork loads, then punches as the
 * roster slides in behind it. Afterwards it steps back (fades and shrinks)
 * whenever a character is active so it never covers the revealed art.
 */
export function useBrandLogo() {
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const markLogoShown = useIntroStore((s) => s.markLogoShown);
  const isRevealed = useIntroStore(selectIsRevealed);
  const hasActive = useCharacterSelectStore((s) => s.activeId !== null);

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
      if (!isRevealed) return;

      gsap.fromTo(
        introRef.current,
        { scale: 1.06 },
        { scale: 1, duration: motionDuration(0.9), ease: "elastic.out(1, 0.6)" },
      );
    },
    { dependencies: [isRevealed] },
  );

  useGSAP(
    () => {
      gsap.to(logoRef.current, {
        autoAlpha: hasActive ? 0 : 1,
        scale: hasActive ? 0.82 : 1,
        duration: motionDuration(0.45),
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    { dependencies: [hasActive] },
  );

  return { introRef, logoRef };
}
