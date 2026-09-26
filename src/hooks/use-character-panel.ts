import { useCallback, useMemo, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Character, CharacterFraming } from "@config/characters";
import { useCharacterSelectStore } from "@stores/use-character-select-store";
import { useIntroStore } from "@stores/use-intro-store";
import { motionDuration } from "@utils/motion";

gsap.registerPlugin(useGSAP);

const GROW = { idle: 1, active: 2.1, dimmed: 0.72 } as const;

/** Art height relative to the panel before per-character zoom. */
const BASE_ART_HEIGHT = 150;

function getArtFrame({ x, top, zoom }: CharacterFraming) {
  const height = BASE_ART_HEIGHT * zoom;

  const frameStyle: CSSProperties = {
    height: `${height}%`,
    top: `${-top * height}%`,
    left: "50%",
    transform: `translateX(${-x * 100}%)`,
  };
  // Scale on hover around the character's face rather than the image centre.
  const artStyle: CSSProperties = {
    transformOrigin: `${x * 100}% ${(top + 0.15) * 100}%`,
  };

  return { frameStyle, artStyle };
}

/**
 * Drives one roster panel. When its character becomes active the panel
 * widens and the silhouette is revealed and scaled up; sibling panels
 * shrink and fall into shadow.
 */
export function useCharacterPanel({ id, framing }: Character) {
  const panelRef = useRef<HTMLLIElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);

  const setActive = useCharacterSelectStore((s) => s.setActive);
  const markLoaded = useIntroStore((s) => s.markLoaded);
  const isActive = useCharacterSelectStore((s) => s.activeId === id);
  const isDimmed = useCharacterSelectStore(
    (s) => s.activeId !== null && s.activeId !== id,
  );

  useGSAP(
    () => {
      const duration = motionDuration(0.7);
      const ease = "expo.out";

      gsap.to(panelRef.current, {
        flexGrow: isActive ? GROW.active : isDimmed ? GROW.dimmed : GROW.idle,
        duration,
        ease,
        overwrite: "auto",
      });

      gsap.to(artRef.current, {
        scale: isActive ? 1.1 : 1,
        filter: isActive ? "brightness(1)" : "brightness(0)",
        duration,
        ease,
        overwrite: "auto",
      });

      gsap.to(shadeRef.current, {
        opacity: isDimmed ? 0.55 : 0,
        duration: motionDuration(0.4),
        ease: "power2.out",
        overwrite: "auto",
      });

      if (isActive) {
        gsap.fromTo(
          glintRef.current,
          { xPercent: -120, autoAlpha: 1 },
          {
            xPercent: 120,
            autoAlpha: 0,
            duration: motionDuration(0.55),
            ease: "power2.inOut",
            overwrite: "auto",
          },
        );
      }
    },
    { dependencies: [isActive, isDimmed] },
  );

  // Read at call time: ignore hover/focus/tap until the entrance has landed.
  const activate = useCallback(() => {
    if (useIntroStore.getState().isRosterReady) setActive(id);
  }, [id, setActive]);
  // A failed load still counts, so a broken image can't stall the intro.
  const onArtSettled = useCallback(() => markLoaded(id), [id, markLoaded]);
  const { frameStyle, artStyle } = useMemo(() => getArtFrame(framing), [framing]);

  return {
    panelRef,
    artRef,
    shadeRef,
    glintRef,
    frameStyle,
    artStyle,
    isActive,
    activate,
    onArtSettled,
  };
}
