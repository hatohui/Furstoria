/** Darkens the edges so the logo, header and nameplate stay legible. */
export function ScreenVignette() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0/0.55)_100%)]" />
  );
}
