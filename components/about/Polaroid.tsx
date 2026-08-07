/**
 * Destination: src/components/about/Polaroid.tsx
 *
 * A scrapbook photo. Slides in from whichever side it lives on, with a
 * small counter-rotation so it settles like it was placed by hand.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { Tape } from "@/components/about/AboutDecor";
import type { Photo } from "@/lib/journey";

type PolaroidProps = {
  photo: Photo;
  /** Which side of the timeline the photo sits on. */
  side: "left" | "right";
  /** Drives the entrance. Owned by TimelineItem so photo + card + node sync. */
  active: boolean;
  className?: string;
};

export default function Polaroid({
  photo,
  side,
  active,
  className = "",
}: PolaroidProps) {
  const prefersReducedMotion = useReducedMotion();
  const fromLeft = side === "left";

  const hidden = prefersReducedMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        x: fromLeft ? -64 : 64,
        rotate: fromLeft ? photo.tilt - 8 : photo.tilt + 8,
      };

  const shown = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, x: 0, rotate: photo.tilt };

  return (
    <motion.figure
      initial={hidden}
      animate={active ? shown : hidden}
      transition={
        prefersReducedMotion
          ? { duration: 0.4 }
          : { type: "spring", stiffness: 120, damping: 18, mass: 0.9 }
      }
      whileHover={prefersReducedMotion ? undefined : { rotate: 0, scale: 1.03 }}
      className={`group relative w-[13.5rem] sm:w-[15rem] lg:w-[16.5rem] ${className}`}
    >
      <div className="relative rounded-[2px] bg-white p-3 pb-12 shadow-[0_14px_30px_-18px_rgba(90,60,70,0.45),0_2px_6px_-2px_rgba(90,60,70,0.12)] transition-shadow duration-500 group-hover:shadow-[0_22px_44px_-20px_rgba(90,60,70,0.5)]">
        <Tape
          className={
            fromLeft
              ? "-top-3 left-6 -rotate-6"
              : "-top-3 right-6 rotate-[7deg]"
          }
        />

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 55vw, (max-width: 1024px) 40vw, 17rem"
            loading="lazy"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
          {/* Faint warm wash so photos of any colour temperature sit together. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-rose/5 mix-blend-multiply"
          />
        </div>

        <figcaption className="absolute inset-x-3 bottom-3 truncate font-display text-base text-plum-muted/80">
          {photo.caption}
        </figcaption>
      </div>
    </motion.figure>
  );
}
