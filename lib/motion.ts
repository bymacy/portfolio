import type { Transition, Variants } from 'framer-motion';

/**
 * One easing curve for the whole site. Everything decelerates the same way,
 * which is most of what makes a page feel "expensive" rather than busy.
 */
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 90,
  damping: 20,
  mass: 0.9,
};

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 28,
  mass: 0.6,
};

/** Fade + rise. The default entrance for almost every block on the page. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_EDITORIAL },
  },
};

/** Parent wrapper that walks its children in one at a time. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Per-letter entrance used by the hero wordmark. */
export const letterIn: Variants = {
  hidden: { opacity: 0, y: '38%', rotate: 2 },
  visible: {
    opacity: 1,
    y: '0%',
    rotate: 0,
    transition: { duration: 1, ease: EASE_EDITORIAL },
  },
};

/** Shared viewport config: fire once, slightly before the block is centred. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
