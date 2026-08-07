/**
 * Destination: src/components/about/EducationCard.tsx  (replaces existing)
 *
 * Two exports:
 *   EducationCard (default) — one school, takes a single Education entry
 *   Awards        (named)   — the recognition list
 *
 * NOTE: the file on disk must be spelled EducationCard.tsx, capital C.
 * The lowercase variant is what broke the render earlier.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Sparkle } from "@/components/about/AboutDecor";
import { EASE_EDITORIAL } from "@/lib/motion";
import { awards, type Education } from "@/lib/journey";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_EDITORIAL },
  },
};

/* ── One school ───────────────────────────────────────────────────────── */

export default function EducationCard({
  entry,
  index = 0,
}: {
  entry: Education;
  index?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      variants={container}
      initial={prefersReducedMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08 }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-rose/15 bg-white/70 backdrop-blur-md shadow-[0_24px_60px_-40px_rgba(90,60,70,0.6)] transition-shadow duration-500 hover:shadow-[0_34px_80px_-44px_rgba(90,60,70,0.65)]"
    >
      <div className="p-6 sm:p-7">
        <motion.div
          variants={item}
          className="flex flex-col gap-x-8 gap-y-1.5 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <h3 className="font-display text-[1.2rem] leading-tight text-plum sm:text-[1.35rem]">
            {entry.qualification}
          </h3>

          <p className="flex shrink-0 items-center gap-2 text-[0.68rem] uppercase tracking-[0.26em] text-rose">
            {entry.current && (
              <span aria-hidden className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose/50 motion-safe:animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose" />
              </span>
            )}
            {entry.period}
          </p>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-2.5 text-[0.95rem] text-plum-muted"
        >
          {entry.school}
        </motion.p>

        <motion.p variants={item} className="mt-1 text-sm text-plum-muted/60">
          {entry.location}
        </motion.p>
      </div>
    </motion.article>
  );
}

/* ── Recognition ──────────────────────────────────────────────────────── */

export function Awards() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={prefersReducedMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.h3
        variants={item}
        className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.26em] text-rose"
      >
        <Sparkle size={12} className="text-rose/60" />
        Awards &amp; recognition
      </motion.h3>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {awards.map((award) => (
          <motion.li
            key={award.id}
            variants={item}
            className="flex flex-col rounded-[1.35rem] border border-rose/15 bg-white/70 p-5 backdrop-blur-md transition-colors duration-300 hover:border-rose/40"
          >
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-plum-muted/55">
              {award.period}
            </p>

            <p className="mt-3 font-display text-[1.15rem] leading-snug text-plum">
              {award.title}
            </p>

            {award.issuer && (
              <p className="mt-1 text-sm text-plum-muted">{award.issuer}</p>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
