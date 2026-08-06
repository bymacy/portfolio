'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import { EASE_EDITORIAL, letterIn, stagger, viewportOnce } from '@/lib/motion';

interface SectionTitleProps {
  children: string;
  /** Short label above the title, e.g. "Selected work". */
  eyebrow?: string;
  align?: 'left' | 'center';
  /** Outlined instead of solid — mirrors the hero wordmark treatment. */
  outlined?: boolean;
  className?: string;
}

/**
 * Titles animate letter by letter rather than as one block. It reads as
 * typesetting rather than a fade, and echoes the hero's typing motion.
 *
 * Every band on the page is light, so there's only one tone: plum on whatever
 * pink it happens to be sitting on.
 */
export default function SectionTitle({
  children,
  eyebrow,
  align = 'center',
  outlined = false,
  className,
}: SectionTitleProps) {
  const letters = Array.from(children);

  return (
    <motion.div
      variants={stagger(0.045)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={clsx(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow ? (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
          className="mb-5 flex items-center gap-3 text-eyebrow uppercase text-plum-muted"
        >
          <span aria-hidden className="h-px w-8 bg-hairline" />
          {eyebrow}
        </motion.span>
      ) : null}

      <h2
        className={clsx(
          'font-display text-display-md uppercase',
          outlined ? 'text-outline' : 'text-plum'
        )}
      >
        {/* Screen readers get the plain word, not 7 separate letters. */}
        <span className="sr-only">{children}</span>
        <span aria-hidden className="flex overflow-hidden">
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              variants={letterIn}
              className="inline-block"
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </span>
      </h2>
    </motion.div>
  );
}
