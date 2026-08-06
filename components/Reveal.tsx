'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { EASE_EDITORIAL, viewportOnce } from '@/lib/motion';

type RevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  /** Seconds to wait after the block enters the viewport. */
  delay?: number;
  /** Travel distance in px. Negative values slide down instead of up. */
  distance?: number;
  duration?: number;
  as?: 'div' | 'section' | 'li' | 'p' | 'span';
};

/**
 * The single entrance primitive for the site: fade + rise, once, on scroll.
 * Using one component everywhere keeps the whole page on the same clock.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 34,
  duration = 0.9,
  as = 'div',
  ...rest
}: RevealProps) {
  // All variants accept the same prop surface here; div is the widest of them.
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration, delay, ease: EASE_EDITORIAL }}
      {...rest}
    >
      {children}
    </Component>
  );
}
