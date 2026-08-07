"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

import HeroImage from "@/components/HeroImage";
import TypingName from "@/components/TypingName";
import { EASE_EDITORIAL, letterIn, stagger } from "@/lib/motion";
import { site } from "@/lib/site";

/**
 * Two arrangements, one markup tree:
 *
 *  ≥ lg   [ BY ]      (portrait)      [ MACY ]     ← type layer absolute, behind
 *  < lg   portrait on top, BY / MACY stacked beneath, nothing obscured
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // The type drifts slower than the portrait — cheap, convincing depth.
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-gutter pb-16 pt-28 lg:block lg:pb-0 lg:pt-0"
    >
      {/* ── Wordmark layer ──────────────────────────────────────────────── */}
      <motion.div
        style={
          prefersReducedMotion ? undefined : { y: typeY, opacity: typeOpacity }
        }
        className="order-2 mt-8 flex flex-col items-start gap-2 lg:absolute lg:inset-x-gutter lg:top-[37%] lg:z-10 lg:mt-0 lg:flex-row lg:items-baseline lg:justify-center lg:gap-[19rem]"
      >
        {/* BY — solid, letters staggered in on load */}
        <motion.span
          variants={stagger(0.09, 0.1)}
          initial="hidden"
          animate="visible"
          className="flex font-display lg:text-[20rem] uppercase leading-none text-plum"
        >
          <span className="sr-only">{site.wordmark.solid}</span>
          {Array.from(site.wordmark.solid).map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              aria-hidden
              variants={letterIn}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>

        {/* MACY — outlined, types and retypes forever */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_EDITORIAL, delay: 0.35 }}
          className="flex flex-col items-start lg:items-end"
        >
          <TypingName
            word={site.wordmark.typed}
            className="font-display text-8xl lg:text-[20rem] uppercase leading-none text-outline"
          />

          {/* Roles sit under the name like a magazine standfirst */}
          {/* Roles sit under the name like a magazine standfirst */}
          <motion.ul
            variants={stagger(0.1, 1.5)}
            initial="hidden"
            animate="visible"
            className="mt-4 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 pl-[0.3em] text-sm font-medium uppercase tracking-[0.3em] text-plum-muted lg:text-base"
          >
            {site.roles.map((role, index) => (
              <motion.li
                key={role}
                variants={letterIn}
                className="flex items-center gap-3"
              >
                {index > 0 ? (
                  <span aria-hidden className="text-plum-faint">
                    |
                  </span>
                ) : null}
                {role}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* ── Portrait layer ─────────────────────────────────────────────── */}
      <div className="order-1 flex justify-center lg:flex lg:min-h-[100svh] lg:items-end">
        <HeroImage
          src={site.images.hero}
          alt={`${site.name}, ${site.tagline}`}
        />
      </div>

      {/* ── Footnote row ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_EDITORIAL, delay: 1.7 }}
        className="order-3 mt-10 flex items-end justify-between gap-6 text-eyebrow uppercase text-plum-faint lg:absolute lg:inset-x-gutter lg:bottom-8 lg:z-30 lg:mt-0"
      >
        <a
          href="#projects"
          className="group flex items-center gap-3 transition-colors hover:text-plum"
        >
          <span className="relative block h-8 w-px overflow-hidden bg-hairline">
            <span className="absolute inset-x-0 top-0 h-3 bg-plum transition-transform duration-700 ease-editorial group-hover:translate-y-5" />
          </span>
          Scroll
        </a>
      </motion.div>
    </section>
  );
}
