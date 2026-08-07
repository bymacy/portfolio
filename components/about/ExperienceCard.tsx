/**
 * Destination: src/components/about/ExperienceCard.tsx
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";

import { RoleIcon } from "@/components/about/AboutDecor";
import type { Experience } from "@/lib/journey";
import { EASE_EDITORIAL } from "@/lib/motion";

type ExperienceCardProps = {
  experience: Experience;
  /** Side of the timeline the card sits on. Mirrors the header on desktop. */
  side: "left" | "right";
  active: boolean;
};

export default function ExperienceCard({
  experience,
  side,
  active,
}: ExperienceCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isLeft = side === "left";

  const hidden = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 28, x: isLeft ? 16 : -16 };
  const shown = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, x: 0 };

  return (
    <motion.article
      initial={hidden}
      animate={active ? shown : hidden}
      transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      className={[
        "group relative w-full rounded-[1.75rem] border border-rose/15 bg-white/70 p-6 backdrop-blur-md sm:p-7",
        "shadow-[0_18px_40px_-30px_rgba(90,60,70,0.55)]",
        "transition-[box-shadow,border-color] duration-500",
        "hover:border-rose/35 hover:shadow-[0_28px_60px_-32px_rgba(90,60,70,0.6)]",
        "focus-within:border-rose/40",
        isLeft ? "lg:ml-auto lg:max-w-[26rem]" : "lg:mr-auto lg:max-w-[26rem]",
      ].join(" ")}
    >
      {/* Hairline inner rule — the editorial detail that keeps the glass honest. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3px] rounded-[1.55rem] border border-white/50"
      />

      <header
        className={[
          "relative flex items-start gap-4",
          isLeft ? "lg:flex-row-reverse lg:text-right" : "",
        ].join(" ")}
      >
        <span
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose/25 bg-paper text-rose transition-transform duration-500 group-hover:-rotate-6"
          aria-hidden
        >
          <RoleIcon name={experience.icon} />
        </span>

        <div className="min-w-0">
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-rose">
            {experience.year}
          </p>
          <h3 className="mt-1.5 font-display text-[1.35rem] leading-snug text-plum">
            {experience.role}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-plum-muted/80">
            {experience.organization}
          </p>
        </div>
      </header>

      <ul className="relative mt-5 space-y-2.5 border-t border-rose/10 pt-5">
        {experience.points.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-[0.95rem] leading-[1.75] text-plum-muted"
          >
            <span
              aria-hidden
              className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-rose/60"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
