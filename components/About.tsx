/**
 * Destination: src/components/About.tsx  (replaces the existing file)
 *
 * Three movements: About Me → Experiences → Education.
 * Routing, ids and data flow are untouched — the section is still a single
 * `#about` landmark that the nav can scroll to.
 */

"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { Float, Leaf, Sparkle, Tape } from "@/components/about/AboutDecor";
import EducationCard, { Awards } from "@/components/about/EducationCard";
import Timeline from "@/components/about/Timeline";
import Reveal from "@/components/Reveal";
import { education, experiences } from "@/lib/journey";
import { EASE_EDITORIAL } from "@/lib/motion";
import { site } from "@/lib/site";

const paragraphs = [
  "I'm Macy — an Information Technology student who enjoys bringing ideas to life through thoughtful UI/UX design and frontend development.",
  "I like making things that feel gentle, intentional and a little playful — spaces people enjoy coming back to.",
  "Outside of code you'll usually find me sketching interfaces, collecting small moments of inspiration, or adding the details that make a product feel human.",
];

const facts = [
  { label: "Based in", value: site.location },
  { label: "Focus", value: "Interface design & frontend" },
];

export default function About() {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative overflow-hidden bg-paper"
    >
      <AboutMe />
      <Experiences />
      <Education />
    </section>
  );
}

/* ── 1. About Me ──────────────────────────────────────────────────────── */

function AboutMe() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The portrait rides slightly against the scroll — depth, not motion.
  const portraitY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <div ref={ref} className="relative py-section">
      <div className="mx-auto grid max-w-[110rem] items-center gap-y-20 px-gutter lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-x-24">
        {/* ── Text ───────────────────────────────────────────────────── */}
        <div className="max-w-[38rem]">
          <Reveal className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.28em] text-rose">
            <span aria-hidden className="h-px w-10 bg-rose/40" />
            <span>Hello there</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.08}
            className="mt-6 font-display text-[clamp(2.6rem,6vw,4.25rem)] leading-[1.05] text-plum"
          >
            About me
          </Reveal>

          <div className="mt-7 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <Reveal
                key={paragraph}
                as="p"
                delay={0.16 + 0.08 * index}
                className="text-lg leading-[1.9] text-plum-muted"
              >
                {paragraph}
              </Reveal>
            ))}

            <Reveal
              delay={0.62}
              className="mt-10 font-display text-xl tracking-[0.14em] text-rose"
            >
              <span>♡ Macy</span>
            </Reveal>
          </div>

          {/* Two facts, set as a small data block rather than body copy. */}
          <Reveal
            delay={0.44}
            className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-t border-rose/15 pt-7"
          >
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-rose">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-base text-plum-muted">
                  {fact.value}
                </dd>
              </div>
            ))}
          </Reveal>

          <Reveal
            delay={0.54}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-rose px-7 py-3.5 text-sm tracking-wide text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose"
            >
              Get in touch
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#work"
              className="inline-flex items-center rounded-full border border-rose/30 px-7 py-3.5 text-sm tracking-wide text-plum-muted transition-colors duration-300 hover:border-rose/60 hover:text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose"
            >
              See my work
            </a>
          </Reveal>
        </div>

        {/* ── Portrait ───────────────────────────────────────────────── */}
        <motion.div
          style={prefersReducedMotion ? undefined : { y: portraitY }}
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: EASE_EDITORIAL }}
          className="relative mx-auto w-[min(78vw,26rem)] lg:w-[30rem]"
        >
          {/* Decoration sits behind and around the portrait, never over the face. */}
          <Float
            className="pointer-events-none absolute -left-10 top-6 hidden text-rose/25 sm:block"
            distance={12}
            duration={9}
          >
            <Leaf className="h-40 w-20" />
          </Float>

          <Float
            className="pointer-events-none absolute -right-6 bottom-24 hidden text-rose/20 sm:block"
            distance={9}
            duration={11}
            delay={1.2}
          >
            <Leaf className="h-28 w-14 -scale-x-100" />
          </Float>

          <Float
            className="pointer-events-none absolute -right-2 top-2 text-rose/50"
            distance={8}
            duration={6}
            rotate={12}
          >
            <Sparkle size={22} />
          </Float>

          <Float
            className="pointer-events-none absolute -left-4 bottom-16 text-rose/40"
            distance={6}
            duration={7.5}
            delay={0.8}
            rotate={-10}
          >
            <Sparkle size={14} />
          </Float>

          {/* Soft blush behind the cut-out. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/15 blur-3xl"
          />

          {/* Polaroid mount for the portrait. */}
          <div className="relative rounded-[2px] bg-white p-4 pb-14 shadow-[0_30px_60px_-38px_rgba(90,60,70,0.55)]">
            <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper">
              <Image
                src={site.images.about}
                alt={`${site.name}, smiling`}
                fill
                sizes="(max-width: 1024px) 78vw, 30rem"
                priority={false}
                className="object-cover object-center"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── 2. Experiences ───────────────────────────────────────────────────── */

function Experiences() {
  return (
    <div className="relative py-section">
      <header className="mx-auto max-w-[42rem] px-gutter text-center">
        <Reveal className="flex items-center justify-center gap-3 text-[0.7rem] uppercase tracking-[0.28em] text-rose">
          <span aria-hidden className="h-px w-10 bg-rose/40" />
          <span>The journey so far</span>
          <span aria-hidden className="h-px w-10 bg-rose/40" />
        </Reveal>

        <Reveal
          as="h2"
          delay={0.08}
          className="mt-6 font-display text-[clamp(2.4rem,5.5vw,3.75rem)] leading-[1.08] text-plum"
        >
          Experiences
        </Reveal>

        <Reveal
          as="p"
          delay={0.16}
          className="mx-auto mt-5 max-w-[34rem] text-lg leading-[1.9] text-plum-muted"
        >
          Scroll to follow the thread — every stop is a room I learned something
          in.
        </Reveal>
      </header>

      <div className="mx-auto mt-16 max-w-[82rem] px-gutter sm:mt-20">
        <Timeline experiences={experiences} />
      </div>
    </div>
  );
}

/* ── 3. Education ─────────────────────────────────────────────────────── */

function Education() {
  return (
    <div className="relative py-section">
      <div className="mx-auto max-w-[64rem] px-gutter">
        <header className="max-w-[38rem]">
          <Reveal className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.28em] text-rose">
            <span aria-hidden className="h-px w-10 bg-rose/40" />
            <span>Where it started</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.08}
            className="mt-6 font-display text-[clamp(2.4rem,5.5vw,3.75rem)] leading-[1.08] text-plum"
          >
            Education
          </Reveal>
        </header>

        <div className="mt-12 space-y-6">
          {education.map((entry, index) => (
            <EducationCard key={entry.id} entry={entry} index={index} />
          ))}
        </div>

        <div className="mt-20 border-t border-rose/10 pt-14">
          <Awards />
        </div>
      </div>
    </div>
  );
}
