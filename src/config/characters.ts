export type CharacterId = "zevrim" | "xonorth" | "bane" | "kavala";

export type Character = {
  id: CharacterId;
  name: string;
  image: string;
  /** Panel fill color, used behind the silhouette and for the nameplate. */
  accent: string;
  framing: CharacterFraming;
};

/**
 * Where to crop each 1:1 artwork inside its panel. The artworks differ in
 * pose and scale, so each gets its own focal point and zoom.
 */
export type CharacterFraming = {
  /** Horizontal focal point, as a fraction of the image width (0.5 = centre). */
  x: number;
  /** Fraction of the image height hidden above the panel's top edge. */
  top: number;
  /** Multiplier on the base art height. */
  zoom: number;
};

/** Roster in on-screen order, left to right. */
export const CHARACTERS: readonly Character[] = [
  {
    id: "zevrim",
    name: "Zevrim",
    image: "/assets/characters/zevrim.webp",
    accent: "#3e8fb0",
    framing: { x: 0.42, top: 0.05, zoom: 1 },
  },
  {
    id: "xonorth",
    name: "Xonorth",
    image: "/assets/characters/xonorth.webp",
    accent: "#c2456f",
    framing: { x: 0.5, top: 0.03, zoom: 1 },
  },
  {
    id: "bane",
    name: "Bane",
    image: "/assets/characters/bane.webp",
    accent: "#7a74b8",
    framing: { x: 0.56, top: 0.07, zoom: 1 },
  },
  {
    id: "kavala",
    name: "Kavala",
    image: "/assets/characters/kavala.webp",
    accent: "#4f9a3c",
    framing: { x: 0.52, top: 0.15, zoom: 1.22 },
  },
];
