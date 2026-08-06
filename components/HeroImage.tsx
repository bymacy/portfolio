'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { EASE_EDITORIAL } from '@/lib/motion';

interface HeroImageProps {
  src: string;
  alt: string;
}

/**
 * The portrait sits above the wordmark (z-20) and slightly overlaps it.
 * On scroll it drifts up a little faster than the type behind it, which is
 * what sells the depth without anything obviously "moving".
 */
export default function HeroImage({ src, alt }: HeroImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const y = useSpring(rawY, { stiffness: 80, damping: 24, mass: 0.6 });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <motion.div
      ref={ref}
      style={prefersReducedMotion ? undefined : { y, scale, opacity }}
      initial={{ opacity: 0, scale: 1.07, y: 26 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.5, ease: EASE_EDITORIAL, delay: 0.15 }}
      className="
      pointer-events-none
      absolute
      left-[26%]
      bottom-0
      z-20
      h-[60vh]
      w-[22rem]
      -translate-x-1/2

      sm:h-[68vh]
      sm:w-[26rem]

      lg:left-[22.5%]
      lg:h-[90vh]
      lg:w-[36rem]
      "
    >
      {/* Flat accent disc — separates the portrait from the outlined letters.
          Deliberately not a gradient: one colour, heavy blur. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] -z-10 h-[62%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/80 blur-3xl"
      />

      {/* REPLACE: /public/images/portrait-hero.png with your own cut-out PNG
          (transparent background, roughly 1400px tall for a crisp 2x render). */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 78vw, 42vw"
        className="object-contain object-bottom drop-shadow-[0_40px_60px_rgba(62,34,48,0.20)]"
      />
    </motion.div>
  );
}
