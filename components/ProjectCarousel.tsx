'use client';

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import ProjectCard from '@/components/ProjectCard';
import type { ProjectSummary } from '@/lib/types';

interface ProjectCarouselProps {
  projects: ProjectSummary[];
}

/** Card edge length. Squares, always. */
const CARD_SIZE = 'clamp(18rem, 26vw, 26rem)';

/** Travel speed in px/sec when the cursor is at the very edge of the section. */
const MAX_SPEED = 2000;
/** The row never fully stops — it keeps drifting when nobody is pointing at it. */
const AMBIENT_SPEED = 45;
/** Middle 5% of the section is neutral, so you can park the row and click. */
const DEAD_ZONE = 0.05;
/** Response curve. 1 = linear, higher = gentler near the middle. */
const RESPONSE = 1.4;
/** How quickly the row takes up a new speed. Higher = snappier. */
const VELOCITY_EASE = 11;

/** Shared measurements, kept in a ref so the per-frame maths never goes stale. */
interface Metrics {
  areaLeft: number;
  viewport: number;
  step: number;
  cardWidth: number;
  setWidth: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/* ─────────────────────────────────────────────────────────────────────────
   One card. Full size as it crosses the middle of the screen, small either
   side of it. Reads its live position every frame rather than a fixed peak,
   because in a looping row a card's position has no fixed meaning.
   ───────────────────────────────────────────────────────────────────────── */
function LoopCard({
  project,
  index,
  x,
  metrics,
  clone,
}: {
  project: ProjectSummary;
  index: number;
  x: MotionValue<number>;
  metrics: React.MutableRefObject<Metrics>;
  /** Duplicated set: clickable, but hidden from keyboard and screen readers. */
  clone: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const geometry = useRef({ base: 0, width: 0, span: 1 });

  useEffect(() => {
    const measure = () => {
      const node = ref.current;
      if (!node) return;

      geometry.current = {
        base: metrics.current.areaLeft + node.offsetLeft,
        width: node.offsetWidth,
        span: node.offsetWidth * 1.15,
      };
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [metrics]);

  /** 1 when this card is dead centre, 0 once it's a card-and-a-bit away. */
  const focus = useTransform(x, (value) => {
    const { base, width, span } = geometry.current;
    if (!width) return 1;

    const centre = base + value + width / 2;
    const offset = Math.abs(centre - metrics.current.viewport / 2);
    return clamp(1 - offset / span, 0, 1);
  });

  const scale = useTransform(focus, [0, 1], [0.66, 1]);
  const opacity = useTransform(focus, [0, 1], [0.5, 1]);
  const y = useTransform(focus, [0, 1], [26, 0]);

  return (
    <motion.div
      ref={ref}
      data-card
      aria-hidden={clone || undefined}
      style={{ scale, opacity, y }}
      className="shrink-0 will-change-transform"
    >
      <ProjectCard
        project={project}
        index={index}
        size={CARD_SIZE}
        focusable={!clone}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Desktop: an endless row. The cursor sets the speed and direction, not the
   position — right of centre it travels one way, left of centre the other,
   middle it rests. The strip wraps by exactly one set, so there's no seam
   and no end to reach.
   ───────────────────────────────────────────────────────────────────────── */
function PointerLoop({ projects }: ProjectCarouselProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const metrics = useRef<Metrics>({
    areaLeft: 0,
    viewport: 0,
    step: 0,
    cardWidth: 0,
    setWidth: 0,
  });

  const velocity = useRef(AMBIENT_SPEED);
  const targetVelocity = useRef(AMBIENT_SPEED);
  const centred = useRef(false);

  const [repeats, setRepeats] = useState(3);
  const [current, setCurrent] = useState(1);

  const position = useMotionValue(0);

  /** Fold any position back into one set's width — this is the loop. */
  const wrap = useCallback((value: number) => {
    const { setWidth } = metrics.current;
    if (setWidth <= 0) return value;
    return (((value % setWidth) + setWidth) % setWidth) - setWidth;
  }, []);

  useEffect(() => {
    const measure = () => {
      const area = areaRef.current;
      const track = trackRef.current;
      if (!area || !track) return;

      const cards = track.querySelectorAll<HTMLElement>('[data-card]');
      if (cards.length < 2) return;

      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      const cardWidth = cards[0].offsetWidth;
      const setWidth = step * projects.length;
      if (setWidth <= 0) return;

      metrics.current = {
        areaLeft: area.getBoundingClientRect().left,
        viewport: window.innerWidth,
        step,
        cardWidth,
        setWidth,
      };

      // Enough copies to cover the screen at any wrap offset, plus one spare.
      setRepeats(Math.max(2, Math.ceil(window.innerWidth / setWidth) + 1));

      if (!centred.current) {
        // Open with the first project sitting in the middle, at full size.
        position.set(wrap(window.innerWidth / 2 - cardWidth / 2));
        centred.current = true;
      } else {
        position.set(wrap(position.get()));
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [projects.length, position, wrap]);

  useAnimationFrame((_time, delta) => {
    const { setWidth, viewport, step, cardWidth, areaLeft } = metrics.current;
    if (!setWidth) return;

    // Cap dt so a backgrounded tab doesn't fling the row on return.
    const dt = Math.min(delta, 64) / 1000;

    velocity.current += (targetVelocity.current - velocity.current) * Math.min(1, dt * VELOCITY_EASE);

    if (Math.abs(velocity.current) > 0.05) {
      position.set(wrap(position.get() - velocity.current * dt));
    }

    const slot = Math.round((viewport / 2 - areaLeft - position.get() - cardWidth / 2) / step);
    const next = (((slot % projects.length) + projects.length) % projects.length) + 1;
    setCurrent((previous) => (previous === next ? previous : next));
  });

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;

    const area = areaRef.current;
    if (!area) return;

    const rect = area.getBoundingClientRect();
    const fromCentre = ((event.clientX - rect.left) / rect.width) * 2 - 1; // -1 … 1
    const magnitude = Math.max(0, (Math.abs(fromCentre) - DEAD_ZONE) / (1 - DEAD_ZONE));

    // Slightly eased response: precise near the middle, fast at the edges.
    targetVelocity.current = Math.sign(fromCentre) * Math.pow(magnitude, RESPONSE) * MAX_SPEED;
  }, []);

  const handlePointerLeave = useCallback(() => {
    targetVelocity.current = AMBIENT_SPEED;
  }, []);

  /** Tabbing to a card parks it in the middle. */
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>('[data-card]');
      if (!card) return;

      const { areaLeft, viewport, cardWidth } = metrics.current;
      position.set(wrap(viewport / 2 - (areaLeft + card.offsetLeft) - cardWidth / 2));
      velocity.current = 0;
      targetVelocity.current = 0;
    },
    [position, wrap]
  );

  return (
    <div
      ref={areaRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocus}
      className="relative overflow-hidden py-12"
    >
      <motion.div
        ref={trackRef}
        style={{ x: position }}
        className="flex w-max items-center gap-10 will-change-transform"
      >
        {Array.from({ length: repeats }).map((_, set) =>
          projects.map((project, index) => (
            <LoopCard
              key={`${project.slug}-${set}`}
              project={project}
              index={index + 1}
              x={position}
              metrics={metrics}
              clone={set > 0}
            />
          ))
        )}
      </motion.div>

      {/* No progress bar — there's no progress to show. Just where you are. */}
      <div className="mt-14 flex items-center justify-center gap-4 text-eyebrow uppercase text-plum-muted">
        <span aria-hidden className="text-plum-faint">
          &lsaquo;
        </span>
        <span className="tabular-nums">
          {String(current).padStart(2, '0')}
          <span aria-hidden className="mx-2 text-plum-faint">
            /
          </span>
          {String(projects.length).padStart(2, '0')}
        </span>
        <span aria-hidden className="text-plum-faint">
          &rsaquo;
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Touch (and reduced-motion): a native, snapping, swipeable rail.
   ───────────────────────────────────────────────────────────────────────── */
function SwipeRail({ projects }: ProjectCarouselProps) {
  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-gutter pb-6 pt-2">
      {projects.map((project, index) => (
        <div key={project.slug} className="snap-center">
          <ProjectCard project={project} index={index + 1} size="min(72vw, 22rem)" />
        </div>
      ))}
      {/* Trailing spacer so the last card can centre itself */}
      <div aria-hidden className="w-[14vw] shrink-0" />
    </div>
  );
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <div className="hidden lg:block">
        {prefersReducedMotion ? (
          <SwipeRail projects={projects} />
        ) : (
          <PointerLoop projects={projects} />
        )}
      </div>
      <div className="lg:hidden">
        <SwipeRail projects={projects} />
      </div>
    </>
  );
}
