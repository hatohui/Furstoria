import { CHARACTERS } from "@config/characters";
import { CharacterNameplate } from "./character-nameplate";

/** Bottom-left slot where the active character's nameplate appears. */
export function CharacterNameplates() {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute bottom-[6vh] left-[6vw]"
    >
      {CHARACTERS.map((character, index) => (
        <CharacterNameplate
          key={character.id}
          character={character}
          position={index + 1}
          total={CHARACTERS.length}
        />
      ))}
    </div>
  );
}
