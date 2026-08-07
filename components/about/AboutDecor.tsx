/**
 * Destination: src/components/about/AboutDecor.tsx
 *
 * Hairline icons + scrapbook furniture (tape, sparkles, leaves, blobs).
 * All inline SVG so the About page adds zero dependencies.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactElement, ReactNode, SVGProps } from "react";

import type { RoleIconName } from "@/lib/journey";

/* ── Role icons ──────────────────────────────────────────────────────── */
/* 1px strokes, 24px grid, currentColor. Deliberately drawn rather than
   pulled from an icon set so the weight matches the editorial type. */

const iconBase: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

const paths: Record<RoleIconName, ReactElement> = {
  video: (
    <>
      <rect x="3" y="6" width="12" height="12" rx="2.5" />
      <path d="M15 10.5 21 7.5v9L15 13.5z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l7 4.5V4L8 8.5H5.5A1.5 1.5 0 0 0 4 10Z" />
      <path d="M18 9.5a3.5 3.5 0 0 1 0 5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.7 0-.8.7-1.4 1.6-1.4H16a4.5 4.5 0 0 0 4.5-4.5C20.5 6.5 16.7 3.5 12 3.5Z" />
      <circle cx="8" cy="10" r=".9" />
      <circle cx="12" cy="7.5" r=".9" />
      <circle cx="15.8" cy="10" r=".9" />
    </>
  ),
  note: (
    <>
      <path d="M6 3.5h9L19 8v12.5H6z" />
      <path d="M14.5 3.5V8H19" />
      <path d="M9 12.5h7M9 16h5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
      <circle cx="12" cy="15" r="1.1" />
    </>
  ),
  people: (
    <>
      <circle cx="9.5" cy="9" r="3" />
      <path d="M3.5 19.5a6 6 0 0 1 12 0" />
      <path d="M16 6.6a3 3 0 0 1 0 5.8M17.5 19.5a6 6 0 0 0-2.2-4.6" />
    </>
  ),
};

export function RoleIcon({
  name,
  className = "h-5 w-5",
}: {
  name: RoleIconName;
  className?: string;
}) {
  return (
    <svg {...iconBase} className={className}>
      {paths[name]}
    </svg>
  );
}

/* ── Scrapbook furniture ─────────────────────────────────────────────── */

/** Torn washi tape. Sits over a corner, never fully opaque. */
export function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block h-6 w-24 bg-rose/25 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-[1px] ${className}`}
      style={{
        clipPath:
          "polygon(3% 0, 97% 4%, 100% 96%, 6% 100%, 0 62%, 4% 38%, 0 14%)",
      }}
    />
  );
}

/** Four-point star. The only sparkle shape used on the page. */
export function Sparkle({
  className = "",
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12 0c.6 6.4 5 10.8 12 12-7 1.2-11.4 5.6-12 12-.6-6.4-5-10.8-12-12C7 10.8 11.4 6.4 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A single sprig. Used sparingly behind the portrait. */
export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 64 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M32 118V14" />
      <path d="M32 96c-14 0-20-8-20-18 11-2 20 6 20 18ZM32 96c14 0 20-8 20-18-11-2-20 6-20 18Z" />
      <path d="M32 66c-12 0-17-7-17-16 10-1.7 17 5 17 16ZM32 66c12 0 17-7 17-16-10-1.7-17 5-17 16Z" />
      <path d="M32 38c-9 0-13-5.4-13-12 7.6-1.3 13 3.8 13 12ZM32 38c9 0 13-5.4 13-12-7.6-1.3-13 3.8-13 12Z" />
    </svg>
  );
}

/**
 * Ambient float. Wraps any decoration in a slow, irregular drift so no two
 * elements breathe in sync. Disabled entirely under reduced motion.
 */
export function Float({
  children,
  className = "",
  distance = 10,
  duration = 7,
  delay = 0,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{
        y: [0, -distance, 0],
        rotate: rotate ? [0, rotate, 0] : undefined,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
