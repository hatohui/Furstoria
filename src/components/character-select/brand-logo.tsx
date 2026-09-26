"use client";

import Image from "next/image";
import { useBrandLogo } from "@hooks/use-brand-logo";
import { ART_QUALITY } from "@config/images";
import { LoadProgress } from "./load-progress";

export function BrandLogo() {
  const { introRef, logoRef } = useBrandLogo();

  return (
    <div
      ref={introRef}
      className="pointer-events-none invisible absolute inset-0 grid place-items-center"
    >
      <div ref={logoRef} className="relative w-[min(46vw,26rem)]">
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
        <LoadProgress />
      </div>
    </div>
  );
}
