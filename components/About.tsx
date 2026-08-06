"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { EASE_EDITORIAL } from "@/lib/motion";
import { site } from "@/lib/site";

/* ── REPLACE ME: your own words. Kept as an array so spacing stays uniform. ── */
const paragraphs = [
  "I'm Macy — an Information Technology student who enjoys bringing ideas to life through thoughtful UI/UX design and frontend development.",
  "I like making things that feel gentle, intentional and a little playful — spaces people enjoy coming back to.",
  "Outside of code you'll usually find me sketching interfaces, collecting small moments of inspiration, or adding the details that make a product feel human.",
  "I hope this corner of the internet gives you a glimpse of the person behind the projects, and maybe nudges you to make something of your own.",
];

const facts = [
  { label: "Based in", value: site.location },
  { label: "Focus", value: "Interface design & frontend" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Portrait rides slightly against the scroll — it reads as depth, not motion.
  const portraitY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About"
      className="relative overflow-hidden bg-paper py-section"
    >
      <div className="mx-auto grid max-w-[110rem] items-center gap-y-16 px-gutter lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-20">
        {/* ── Portrait ─────────────────────────────────────────────────── */}
        <motion.div
          style={prefersReducedMotion ? undefined : { y: portraitY }}
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: EASE_EDITORIAL }}
          className="relative mx-auto w-[min(75vw,26rem)] lg:-mt-20 lg:ml-20 lg:mr-0 lg:w-[30rem]"
        >
          {/* Accent slab the portrait breaks out of — the overlap from the ref */}

          <div className="relative aspect-[3/4] w-full animate-drift motion-reduce:animate-none">
            {/* REPLACE: /public/images/portrait-about.png — cut-out PNG, transparent bg */}
            <Image
              src={site.images.about}
              alt={`${site.name}, smiling`}
              fill
              sizes="(max-width: 1024px) 80vw, 38vw"
              loading="lazy"
              className="object-contain object-bottom"
            />
          </div>
        </motion.div>

        {/* ── Text ─────────────────────────────────────────────────────── */}
        <div className="max-w-[38rem] lg:pt-8">
          <div className="max-w-[38rem]">
            <Reveal
              delay={0.4}
              className="mt-3 flex font-display text-xl tracking-[0.14em] text-rose"
            >
              <span>Hello!</span>
            </Reveal>
          </div>

          <div className="mt-5 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <Reveal
                key={paragraph}
                as="p"
                delay={0.08 * index}
                className="text-lg leading-[1.9] text-plum-muted"
              >
                {paragraph}
              </Reveal>
            ))}
          </div>

          <Reveal
            delay={0.4}
            className="mt-3 flex justify-end font-display text-xl tracking-[0.14em] text-rose"
          >
            <span>♡ Macy</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
