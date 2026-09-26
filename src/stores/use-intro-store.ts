import { create } from "zustand";
import { CHARACTERS, type CharacterId } from "@config/characters";

type IntroState = {
  /** Characters whose artwork has finished downloading. */
  loadedIds: readonly CharacterId[];
  /** The logo has faded in and held long enough on the dark screen. */
  isLogoShown: boolean;
  /** The roster entrance has landed; hover/focus/tap may take effect. */
  isRosterReady: boolean;
  markLoaded: (id: CharacterId) => void;
  markLogoShown: () => void;
  markRosterReady: () => void;
};

export const useIntroStore = create<IntroState>((set) => ({
  loadedIds: [],
  isLogoShown: false,
  isRosterReady: false,
  markLoaded: (id) =>
    set((s) => (s.loadedIds.includes(id) ? s : { loadedIds: [...s.loadedIds, id] })),
  markLogoShown: () => set({ isLogoShown: true }),
  markRosterReady: () => set({ isRosterReady: true }),
}));

export const selectLoadProgress = (s: IntroState) =>
  s.loadedIds.length / CHARACTERS.length;

/** The roster may enter once every artwork is ready and the logo has shown. */
export const selectIsRevealed = (s: IntroState) =>
  s.isLogoShown && s.loadedIds.length === CHARACTERS.length;
