import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { CharacterId } from "@config/characters";
import { useCharacterSelectStore } from "@stores/use-character-select-store";
import { motionDuration } from "@utils/motion";

gsap.registerPlugin(useGSAP);

/**
 * Slides the nameplate in from the left while its character is active and
 * snaps it out when another character (or nothing) takes over.
 */
export function useCharacterNameplate(id: CharacterId) {
  const plateRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const isActive = useCharacterSelectStore((s) => s.activeId === id);

  useGSAP(
    () => {
      if (!isActive) {
        gsap.to(plateRef.current, {
          autoAlpha: 0,
          duration: motionDuration(0.2),
          ease: "power2.in",
          overwrite: "auto",
        });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "expo.out", overwrite: "auto" } })
        .set(plateRef.current, { autoAlpha: 1 })
        .fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: motionDuration(0.5) },
        )
        .fromTo(
          nameRef.current,
          { xPercent: -18, autoAlpha: 0, skewX: -12 },
          {
            xPercent: 0,
            autoAlpha: 1,
            skewX: 0,
            duration: motionDuration(0.6),
          },
          "<0.08",
        );
    },
    { dependencies: [isActive] },
  );

  return { plateRef, barRef, nameRef };
}
