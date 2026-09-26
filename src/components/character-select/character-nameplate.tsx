"use client";

import type { Character } from "@config/characters";
import { useCharacterNameplate } from "@hooks/use-character-nameplate";

type CharacterNameplateProps = {
  character: Character;
  position: number;
  total: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function CharacterNameplate({
  character,
  position,
  total,
}: CharacterNameplateProps) {
  const { plateRef, barRef, nameRef } = useCharacterNameplate(character.id);

  return (
    <div ref={plateRef} className="invisible absolute bottom-0 left-0 opacity-0">
      <p className="mb-2 font-display text-sm tracking-[0.35em] text-white/70">
        {pad(position)} / {pad(total)}
      </p>
      <div className="relative">
        <div
          ref={barRef}
          style={{ backgroundColor: character.accent }}
          className="absolute top-[18%] -right-6 bottom-[4%] -left-[8vw] origin-left -skew-x-12"
        />
        <p
          ref={nameRef}
          className="relative font-display text-[clamp(3.5rem,10vw,9rem)] leading-none text-white uppercase italic drop-shadow-[0_4px_0_rgb(0_0_0/0.5)]"
        >
          {character.name}
        </p>
      </div>
    </div>
  );
}
