import { BrandLogo } from "@components/character-select/brand-logo";
import { CharacterNameplates } from "@components/character-select/character-nameplates";
import { CharacterRoster } from "@components/character-select/character-roster";
import { ScreenHeader } from "@components/character-select/screen-header";
import { ScreenVignette } from "@components/character-select/screen-vignette";
import { SelectScreen } from "@components/character-select/select-screen";

export default function Home() {
  return (
    <SelectScreen>
      <CharacterRoster />
      <ScreenVignette />
      <BrandLogo />
      <CharacterNameplates />
      <ScreenHeader />
    </SelectScreen>
  );
}
