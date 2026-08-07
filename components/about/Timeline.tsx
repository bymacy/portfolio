/**
 * Destination: src/components/about/Timeline.tsx
 *
 * The signature element of the page: a stitched pink thread that fills as you
 * scroll, with a small bead travelling ahead of the fill like a needle being
 * drawn through paper.
 *
 * How the smoothness is achieved:
 *   useScroll  → raw 0…1 progress across the track
 *   useSpring  → removes the stepping of native scroll events
 *   scaleY     → the fill is a GPU transform, never a layout change
 *
 * The scroll offset ["start 62%", "end 62%"] means progress is measured
 * against a line 62% down the viewport. TimelineItem's in-view margin
 * (-38%) is the same line, so nodes light up as the thread reaches them.
 */

"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import TimelineItem from "@/components/about/TimelineItem";
import type { Experience } from "@/lib/journey";

export default function Timeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [trackHeight, setTrackHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 62%", "end 62%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });

  // The bead rides in pixels, so the track is measured rather than guessed.
  useEffect(() => {
    const element = trackRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      setTrackHeight(entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const beadY = useTransform(progress, [0, 1], [0, trackHeight]);
  const beadOpacity = useTransform(progress, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);

  return (
    <div ref={trackRef} className="relative">
      {/* ── The thread ────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-5 w-16 -translate-x-1/2 lg:left-1/2"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 4rem, black calc(100% - 4rem), transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 4rem, black calc(100% - 4rem), transparent)",
        }}
      >
        {/* Unvisited path: a dashed stitch, not a solid rule. */}
        <div
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 text-rose/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, currentColor 0 5px, transparent 5px 13px)",
          }}
        />

        {/* Travelled path. */}
        <motion.div
          className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-rose"
          style={{
            scaleY: prefersReducedMotion ? 1 : progress,
            transformOrigin: "top",
          }}
        />

        {/* Soft bloom behind the travelled path. */}
        <motion.div
          className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 rounded-full bg-rose/25 blur-[5px]"
          style={{
            scaleY: prefersReducedMotion ? 1 : progress,
            transformOrigin: "top",
          }}
        />


      </div>

      {/* ── The stops ─────────────────────────────────────────────────── */}
      <ol className="relative space-y-24 py-10 sm:space-y-28 lg:space-y-36">
        {experiences.map((experience, index) => (
          <TimelineItem
            key={experience.id}
            experience={experience}
            index={index}
          />
        ))}
      </ol>
    </div>
  );
}
