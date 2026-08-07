/**
 * Destination: src/components/about/TimelineItem.tsx
 *
 * One stop on the journey. The row owns a single `useInView` signal so the
 * node, the card and the photo all wake up on the same frame — that shared
 * timing is what makes the scroll feel like travelling rather than scrolling.
 *
 * The -38% bottom margin is tuned to match the Timeline's scroll offset, so
 * a node lights up at roughly the moment the pink thread reaches it.
 */

"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import ExperienceCard from "@/components/about/ExperienceCard";
import Polaroid from "@/components/about/Polaroid";
import type { Experience } from "@/lib/journey";

type TimelineItemProps = {
  experience: Experience;
  /** Even indices put the card on the left. */
  index: number;
};

export default function TimelineItem({ experience, index }: TimelineItemProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const inView = useInView(rowRef, {
    once: true,
    margin: "0px 0px -38% 0px",
  });
  const active = prefersReducedMotion ? true : inView;

  const cardSide = index % 2 === 0 ? "left" : "right";
  const photoSide = cardSide === "left" ? "right" : "left";

  const card = (
    <ExperienceCard
      experience={experience}
      side={cardSide}
      active={active}
    />
  );

  const photo = experience.photo ? (
    <Polaroid
      photo={experience.photo}
      side={photoSide}
      active={active}
      className={photoSide === "left" ? "lg:ml-auto" : "lg:mr-auto"}
    />
  ) : null;

  return (
    <li
      ref={rowRef}
      className="relative flex flex-col gap-8 pl-14 sm:pl-16 lg:grid lg:grid-cols-[1fr_6rem_1fr] lg:items-center lg:gap-0 lg:pl-0"
    >
      {/* ── Node ─────────────────────────────────────────────────────────
          Absolute on mobile (line hugs the left edge), a real grid cell on
          desktop (line runs down the centre). */}
      <div className="absolute left-0 top-7 flex w-10 justify-center lg:static lg:col-start-2 lg:row-start-1 lg:w-auto lg:justify-self-center">
        <Node active={active} />
      </div>

      {/* ── Card ─────────────────────────────────────────────────────── */}
      <div
        className={[
          "order-1 lg:row-start-1",
          cardSide === "left"
            ? "lg:col-start-1 lg:justify-self-end lg:pr-2"
            : "lg:col-start-3 lg:justify-self-start lg:pl-2",
        ].join(" ")}
      >
        {card}
      </div>

      {/* ── Photo ────────────────────────────────────────────────────── */}
      {photo && (
        <div
          className={[
            "order-2 lg:row-start-1 lg:flex",
            photoSide === "left"
              ? "lg:col-start-1 lg:justify-end lg:pr-6"
              : "lg:col-start-3 lg:justify-start lg:pl-6",
          ].join(" ")}
        >
          {photo}
        </div>
      )}
    </li>
  );
}

/* ── Node ─────────────────────────────────────────────────────────────── */

function Node({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center">
      {/* Resting ring — always visible so the unvisited path reads as a path. */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-rose/40 bg-paper"
      />

      {/* Halo blooms once, then holds. */}
      <motion.span
        aria-hidden
        initial={{ scale: 0.4, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute -inset-2 rounded-full bg-rose/15 blur-[6px]"
      />

      {/* Filled core. */}
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        animate={active ? { scale: 1 } : { scale: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="relative h-2.5 w-2.5 rounded-full bg-rose shadow-[0_0_0_3px_rgba(255,255,255,0.9)]"
      />
    </span>
  );
}
