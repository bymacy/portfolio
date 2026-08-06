'use client';

import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select, [role="button"]';

/**
 * One small ring that sits exactly under the pointer — no spring on position,
 * so there's no trailing lag. Only the size change is animated.
 * Never renders on touch devices or for reduced-motion visitors.
 */
export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  /* Raw motion values, written straight from the event. Framer flushes these
     on the next animation frame, which is as close to the pointer as you can
     get without fighting the browser's own compositing. */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(fine.matches && !prefersReducedMotion);

    const onChange = (event: MediaQueryListEvent) =>
      setEnabled(event.matches && !prefersReducedMotion);
    fine.addEventListener('change', onChange);
    return () => fine.removeEventListener('change', onChange);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) {
      document.body.removeAttribute('data-custom-cursor');
      return;
    }

    document.body.setAttribute('data-custom-cursor', 'on');

    /* Position only — no React state here, so moving the mouse costs nothing. */
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    /* Hover state lives on pointerover, which only fires when the element
       under the pointer actually changes — not on every pixel of movement. */
    const onOver = (event: PointerEvent) => {
      setHovering(Boolean((event.target as Element | null)?.closest?.(INTERACTIVE)));
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.body.removeAttribute('data-custom-cursor');
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[60]"
    >
      <motion.span
        animate={{
          width: hovering ? 56 : 14,
          height: hovering ? 56 : 14,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? 'rgba(62,34,48,1)' : 'rgba(62,34,48,0)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.4 }}
        className="block -translate-x-1/2 -translate-y-1/2 rounded-full border border-plum"
      />
    </motion.div>
  );
}
