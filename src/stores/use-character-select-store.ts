import { create } from "zustand";
import type { CharacterId } from "@config/characters";

type CharacterSelectState = {
  /** Character currently hovered / focused / tapped, or null when idle. */
  activeId: CharacterId | null;
  setActive: (id: CharacterId) => void;
  clearActive: () => void;
};

export const useCharacterSelectStore = create<CharacterSelectState>((set) => ({
  activeId: null,
  setActive: (id) => set((s) => (s.activeId === id ? s : { activeId: id })),
  clearActive: () => set({ activeId: null }),
}));
