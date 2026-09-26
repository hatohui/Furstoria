"use client";

import Image from "next/image";
import { useBrandLogo } from "@hooks/use-brand-logo";
import { ART_QUALITY } from "@config/images";
import { LoadProgress } from "./load-progress";

const CENTERED = "col-start-1 row-start-1 w-[min(46vw,26rem)]";
// Vertically centred on the header row (h-24): 64/80px wide at 404:323.
const DOCKED = "absolute top-6 right-[6vw] w-16 sm:top-4 sm:w-20";

export function BrandLogo() {
  const { introRef, slotRef, logoRef, isDocked } = useBrandLogo();

  return (
    <div
      ref={introRef}
      className="pointer-events-none invisible absolute inset-0 grid place-items-center"
    >
      {/* Holds the logo's centred footprint (and the load bar) so the dock
          animation can start from here after the logo has moved. */}
      <div ref={slotRef} className={`${CENTERED} relative aspect-[404/323]`}>
        <LoadProgress />
      </div>

      <div ref={logoRef} className={isDocked ? DOCKED : CENTERED}>
        <h1>
          <Image
            src="/assets/common/logo-furstoria-transparent.webp"
            alt="Furstoria"
            width={404}
            height={323}
            quality={ART_QUALITY}
            preload
            className="h-auto w-full invert drop-shadow-[0_6px_24px_rgb(0_0_0/0.6)]"
          />
        </h1>
      </div>
    </div>
  );
}
