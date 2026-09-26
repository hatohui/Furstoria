"use client";

import { CHARACTERS } from "@config/characters";
import { useCharacterRoster } from "@hooks/use-character-roster";
import { CharacterPanel } from "./character-panel";

/**
 * The skewed strip of character panels. The whole strip is skewed (so the
 * dividers lean together) and overshoots the viewport so the slanted outer
 * edges stay off-screen.
 */
export function CharacterRoster() {
  const { rosterRef, onMouseLeave, onBlur } = useCharacterRoster();

  return (
    <ul
      ref={rosterRef}
      onMouseLeave={onMouseLeave}
      onBlur={onBlur}
      aria-label="Characters"
      className="absolute inset-y-0 -right-[14vh] -left-[14vh] flex -skew-x-8"
    >
      {CHARACTERS.map((character) => (
        <CharacterPanel key={character.id} character={character} />
      ))}
    </ul>
  );
}
