"use client";

import Image from "next/image";
import type { Character } from "@config/characters";
import { useCharacterPanel } from "@hooks/use-character-panel";
import { ART_QUALITY } from "@config/images";

type CharacterPanelProps = {
  character: Character;
};

export function CharacterPanel({ character }: CharacterPanelProps) {
  const {
    panelRef,
    artRef,
    shadeRef,
    glintRef,
    frameStyle,
    artStyle,
    activate,
    onArtSettled,
  } = useCharacterPanel(character);

  return (
    <li
      ref={panelRef}
      data-roster-panel
      className="invisible relative h-full min-w-0 flex-1 basis-0 border-l-[3px] border-neutral-500/80 first:border-l-0"
    >
      <button
        type="button"
        aria-label={`Select ${character.name}`}
        onMouseEnter={activate}
        onFocus={activate}
        onClick={activate}
        style={{ backgroundColor: character.accent }}
        className="relative block h-full w-full cursor-pointer overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-inset"
      >
        {/* Counter-skew so the art stands upright inside the slanted panel. */}
        <div className="absolute inset-0 skew-x-8">
          {/* Oversized so the flat cut at the bottom of each artwork sits
              below the viewport. */}
          <div style={frameStyle} className="absolute aspect-square">
            <div
              ref={artRef}
              style={artStyle}
              className="relative size-full brightness-0"
            >
              <Image
                src={character.image}
                alt=""
                fill
                sizes="185vh"
                quality={ART_QUALITY}
                preload
                onLoad={onArtSettled}
                onError={onArtSettled}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/70 to-transparent" />

        <div
          ref={glintRef}
          className="pointer-events-none invisible absolute inset-0 bg-linear-to-r from-transparent via-white/35 to-transparent"
        />

        <div
          ref={shadeRef}
          className="pointer-events-none absolute inset-0 bg-black opacity-0"
        />
      </button>
    </li>
  );
}
