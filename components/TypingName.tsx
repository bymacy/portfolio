'use client';

import clsx from 'clsx';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Phase = 'typing' | 'holding' | 'deleting' | 'waiting';

interface TypingNameProps {
  word: string;
  className?: string;
  /** ms per character while typing */
  typeSpeed?: number;
  /** ms per character while deleting — deliberately quicker */
  deleteSpeed?: number;
  /** ms the finished word stays on screen */
  holdFull?: number;
  /** ms of empty space before the loop restarts */
  holdEmpty?: number;
  /** ms before the very first character appears */
  startDelay?: number;
  showCursor?: boolean;
}

/**
 * Types the word out one letter at a time, holds it, deletes it, repeats.
 *
 * Layout note: an invisible copy of the full word reserves the final width, so
 * the portrait and the "BY" beside it never shift while letters come and go.
 */
export default function TypingName({
  word,
  className,
  typeSpeed = 165,
  deleteSpeed = 85,
  holdFull = 2400,
  holdEmpty = 620,
  startDelay = 900,
  showCursor = true,
}: TypingNameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('waiting');

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'waiting':
        timeout = setTimeout(() => setPhase('typing'), count === 0 ? startDelay : holdEmpty);
        break;
      case 'typing':
        if (count < word.length) {
          timeout = setTimeout(() => setCount((value) => value + 1), typeSpeed);
        } else {
          setPhase('holding');
          return;
        }
        break;
      case 'holding':
        timeout = setTimeout(() => setPhase('deleting'), holdFull);
        break;
      case 'deleting':
        if (count > 0) {
          timeout = setTimeout(() => setCount((value) => value - 1), deleteSpeed);
        } else {
          setPhase('waiting');
          return;
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [
    count,
    phase,
    word.length,
    typeSpeed,
    deleteSpeed,
    holdFull,
    holdEmpty,
    startDelay,
    prefersReducedMotion,
  ]);

  // No motion preference: show the finished word, no loop, no cursor.
  const visible = prefersReducedMotion ? word : word.slice(0, count);

  return (
    <span className={clsx('relative inline-block whitespace-nowrap', className)}>
      {/* Screen readers and search engines always get the real name. */}
      <span className="sr-only">{word}</span>

      {/* Width reservation — invisible, unselectable, ignored by AT.
          Same element type and metrics as the layer above it, so the two
          line boxes are identical and the typed text never drifts. */}
      <span aria-hidden className="pointer-events-none invisible select-none">
        {word}
      </span>

      <span aria-hidden className="absolute inset-0 whitespace-nowrap">
        {visible}
        {showCursor && !prefersReducedMotion ? (
          <span className="ml-[0.06em] inline-block h-[0.66em] w-[0.05em] translate-y-[0.02em] bg-plum align-baseline animate-blink" />
        ) : null}
      </span>
    </span>
  );
}
