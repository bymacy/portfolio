"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EASE_EDITORIAL, letterIn, stagger } from "@/lib/motion";

/* ────────────────────────────────────────────────────────────────────────────
 * The installation
 *
 * A rail across the page with twelve cords paying out from it. Each cord is a
 * Verlet rope — a chain of particles held together by distance constraints,
 * pinned at the rail and free everywhere else. There is no pivot and no angle.
 *
 * That means the cursor can catch the rope anywhere along its length: press
 * into the middle and the middle bends, the slack redistributes, and the logo
 * on the end gets dragged along by the segments above it. Let go and the whole
 * chain oscillates and settles under gravity and friction.
 * ──────────────────────────────────────────────────────────────────────────── */

type Tech = {
  id: string;
  label: string;
  /** anchor position along the rail, 0–1 */
  x: number;
  /** resting cord length in px at the reference viewport */
  len: number;
  /** logo box in px */
  size?: number;
  /** null = sits this one out on narrow screens */
  mobile: { x: number; len: number } | null;
};

const TECHS: Tech[] = [
  {
    id: "html5",
    label: "HTML5",
    x: 0.045,
    len: 624,
    size: 46,
    mobile: { x: 0.1, len: 334 },
  },
  {
    id: "css3",
    label: "CSS3",
    x: 0.128,
    len: 412,
    size: 44,
    mobile: { x: 0.32, len: 230 },
  },
  {
    id: "javascript",
    label: "JavaScript",
    x: 0.196,
    len: 538,
    size: 42,
    mobile: { x: 0.55, len: 406 },
  },
  {
    id: "typescript",
    label: "TypeScript",
    x: 0.283,
    len: 342,
    size: 42,
    mobile: { x: 0.79, len: 208 },
  },
  {
    id: "react",
    label: "React",
    x: 0.352,
    len: 476,
    size: 52,
    mobile: { x: 0.2, len: 490 },
  },
  {
    id: "nextdotjs",
    label: "Next.js",
    x: 0.437,
    len: 328,
    size: 48,
    mobile: { x: 0.67, len: 282 },
  },
  {
    id: "laravel",
    label: "Laravel",
    x: 0.512,
    len: 574,
    size: 46,
    mobile: { x: 0.44, len: 586 },
  },
  {
    id: "php",
    label: "PHP",
    x: 0.594,
    len: 378,
    size: 50,
    mobile: { x: 0.88, len: 512 },
  },
  { id: "mysql", label: "MySQL", x: 0.671, len: 506, size: 48, mobile: null },
  { id: "figma", label: "Figma", x: 0.757, len: 352, size: 38, mobile: null },
  { id: "canva", label: "Canva", x: 0.833, len: 446, size: 44, mobile: null },
  {
    id: "vscode",
    label: "VS Code",
    x: 0.928,
    len: 394,
    size: 44,
    mobile: null,
  },
];

/* ── Rope simulation ─────────────────────────────────────────────────────── */

const GRAVITY = 3000; // px/s², pulls every free particle down
const FRICTION = 0.9915; // per-step velocity retention — the settle rate
const STIFFNESS = 0.88; // <1 lets links stretch slightly under load
const ITERATIONS = 6; // constraint relaxation passes per step
const SEG_TARGET = 30; // aim for a particle roughly every 30px of cord
const MAX_SEGMENTS = 26;
const END_INV_MASS = 0.1; // the logo is heavy, so it resists correction
const CURSOR_RADIUS = 96; // how wide a swathe of rope the cursor catches
const CURSOR_PUSH = 0.1; // 1 = hard shove out of the circle, 0 = no effect
const CURSOR_EASE = 0.2; // smooths raw pointer jitter out of the sim
const BREEZE = 34; // ambient horizontal drift, px/s²
const STEP = 1 / 120; // fixed timestep — Verlet needs a constant dt

/** Bottom of the heading block. No logo is allowed to rest above this. */
const HEAD_CLEARANCE = 232;

type Particle = {
  x: number;
  y: number;
  /** previous position — in Verlet this *is* the velocity */
  px: number;
  py: number;
  /** 0 = pinned to the rail, 1 = fully free, <1 = heavy */
  invMass: number;
};

type Rope = {
  tech: Tech;
  anchorX: number;
  restLen: number;
  size: number;
  segments: number;
  particles: Particle[];
  /** entrance spring: cord pays out from the rail */
  drop: number;
  dropVel: number;
  delay: number;
  /** breeze offsets so no two cords drift in lockstep */
  phase: number;
  breeze: number;
  node: HTMLDivElement | null;
};

export default function TechStack() {
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<SVGLineElement>(null);
  const ropesRef = useRef<Rope[]>([]);
  const rawCursor = useRef({ x: -9999, y: -9999 });
  const cursor = useRef({ x: -9999, y: -9999 });
  const runningRef = useRef(false);

  const prefersReducedMotion = useReducedMotion();
  const [isNarrow, setIsNarrow] = useState(false);

  const visible = useMemo(
    () => (isNarrow ? TECHS.filter((t) => t.mobile) : TECHS),
    [isNarrow],
  );

  /* ── Registration ──────────────────────────────────────────────────────── */

  const register = useCallback((tech: Tech, node: HTMLDivElement | null) => {
    const existing = ropesRef.current.find((r) => r.tech.id === tech.id);
    if (existing) {
      existing.node = node;
      return;
    }
    if (!node) return;
    ropesRef.current.push({
      tech,
      anchorX: 0,
      restLen: tech.len,
      size: tech.size ?? 44,
      segments: 0,
      particles: [],
      drop: 0.03,
      dropVel: 0,
      delay: 0,
      phase: Math.random() * Math.PI * 2,
      breeze: 0.4 + Math.random() * 0.55,
      node,
    });
  }, []);

  /* Paths live in their own map rather than on the rope object. React attaches
   * refs in tree order, and the <svg> renders above the logo <div>s — so the
   * path refs fire before register() has created any ropes to hang them on. */
  const pathsRef = useRef(new Map<string, SVGPathElement>());

  const registerPath = useCallback(
    (id: string, path: SVGPathElement | null) => {
      if (path) pathsRef.current.set(id, path);
      else pathsRef.current.delete(id);
    },
    [],
  );

  /* ── Build a chain. Everything starts collapsed at the anchor so the
   *    entrance reads as cord unspooling rather than appearing. ──────────── */

  function buildRope(rope: Rope) {
    const count = Math.max(
      6,
      Math.min(MAX_SEGMENTS, Math.round(rope.restLen / SEG_TARGET)),
    );
    rope.segments = count;
    rope.particles = Array.from({ length: count + 1 }, (_, i) => ({
      x: rope.anchorX,
      y: i * 0.5,
      px: rope.anchorX,
      py: i * 0.5,
      invMass: i === 0 ? 0 : i === count ? END_INV_MASS : 1,
    }));
  }

  /* ── Layout ────────────────────────────────────────────────────────────── */

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { width } = stage.getBoundingClientRect();
    const narrow = width < 720;
    setIsNarrow(narrow);

    const scale = narrow ? 1 : Math.min(1, Math.max(0.62, width / 1280));

    ropesRef.current.forEach((rope) => {
      const cfg = narrow ? rope.tech.mobile : rope.tech;
      if (!cfg) return;

      const prevAnchor = rope.anchorX;
      rope.anchorX = cfg.x * width;
      rope.size = (rope.tech.size ?? 44) * (narrow ? 0.82 : scale);

      // Scaling can pull a short cord back up into the heading — clamp it.
      const floor =
        (narrow ? HEAD_CLEARANCE * 0.62 : HEAD_CLEARANCE) + rope.size * 0.5;
      const nextLen = Math.max(cfg.len * scale, floor);
      const wantSegments = Math.max(
        6,
        Math.min(MAX_SEGMENTS, Math.round(nextLen / SEG_TARGET)),
      );

      rope.restLen = nextLen;

      if (rope.particles.length === 0 || wantSegments !== rope.segments) {
        buildRope(rope);
      } else {
        // Slide the existing chain sideways rather than snapping it home.
        const shift = rope.anchorX - prevAnchor;
        rope.particles.forEach((p) => {
          p.x += shift;
          p.px += shift;
        });
        rope.particles[0].x = rope.anchorX;
        rope.particles[0].px = rope.anchorX;
        rope.particles[0].y = 0;
        rope.particles[0].py = 0;
      }
    });

    if (railRef.current) railRef.current.setAttribute("x2", String(width));
  }, []);

  /* ── Simulation ────────────────────────────────────────────────────────── */

  useEffect(() => {
    const ids = new Set(visible.map((t) => t.id));
    ropesRef.current = ropesRef.current.filter((r) => ids.has(r.tech.id));

    measure();

    const stage = stageRef.current;
    if (!stage) return;

    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    if (prefersReducedMotion) {
      // Hang everything plumb, no loop.
      ropesRef.current.forEach((rope) => {
        rope.drop = 1;
        const seg = rope.restLen / rope.segments;
        rope.particles.forEach((p, i) => {
          p.x = p.px = rope.anchorX;
          p.y = p.py = i * seg;
        });
        paint(rope);
      });
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          ropesRef.current
            .slice()
            .sort((a, b) => a.anchorX - b.anchorX)
            .forEach((rope, i) => {
              rope.delay = 0.1 + i * 0.06;
            });
          runningRef.current = true;
          io.disconnect();
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(stage);

    let raf = 0;
    let last = performance.now();
    let accumulator = 0;
    let clock = 0;

    const frame = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (runningRef.current) {
        accumulator += delta;
        clock += delta;
        // Cap the catch-up so a backgrounded tab doesn't explode on return.
        if (accumulator > 0.2) accumulator = 0.2;
        while (accumulator >= STEP) {
          simulate(STEP, clock);
          accumulator -= STEP;
        }
      }

      ropesRef.current.forEach(paint);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, prefersReducedMotion, measure]);

  /* ── One physics tick ──────────────────────────────────────────────────── */

  function simulate(dt: number, clock: number) {
    const ropes = ropesRef.current;

    // Ease the sampled pointer toward the raw one. Pointer events arrive
    // unevenly; feeding them straight into the sim is what makes hand-rolled
    // physics feel notchy.
    if (rawCursor.current.x > -9000) {
      cursor.current.x +=
        (rawCursor.current.x - cursor.current.x) * CURSOR_EASE;
      cursor.current.y +=
        (rawCursor.current.y - cursor.current.y) * CURSOR_EASE;
    } else {
      cursor.current.x = -9999;
      cursor.current.y = -9999;
    }

    const cx = cursor.current.x;
    const cy = cursor.current.y;
    const dt2 = dt * dt;

    for (const rope of ropes) {
      if (rope.particles.length === 0) continue;

      if (clock > rope.delay) {
        rope.dropVel += (1 - rope.drop) * 78 * dt;
        rope.dropVel -= rope.dropVel * 8.2 * dt;
        rope.drop += rope.dropVel * dt;
      }

      const drift = Math.sin(clock * rope.breeze + rope.phase) * BREEZE;

      /* 1 — Verlet integration. Position minus previous position IS the
             velocity, so damping and forces both act on positions. */
      for (const p of rope.particles) {
        if (p.invMass === 0) continue;
        const vx = (p.x - p.px) * FRICTION;
        const vy = (p.y - p.py) * FRICTION;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + drift * dt2;
        p.y += vy + GRAVITY * dt2;
      }

      /* 2 — The cursor is a soft circular obstacle. Any particle inside it
             gets pushed to the rim, so the rope drapes around the pointer
             wherever it's touched — middle, top, or end. */
      if (cx > -9000) {
        for (const p of rope.particles) {
          if (p.invMass === 0) continue;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d = Math.hypot(dx, dy);
          if (d >= CURSOR_RADIUS || d < 0.0001) continue;
          const push = (CURSOR_RADIUS - d) * CURSOR_PUSH;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
      }

      /* 3 — Relax the distance constraints. Repeated passes propagate a tug
             at any point up and down the whole chain. */
      const segLen = (rope.restLen / rope.segments) * rope.drop;
      const parts = rope.particles;

      for (let pass = 0; pass < ITERATIONS; pass++) {
        for (let i = 0; i < parts.length - 1; i++) {
          const a = parts[i];
          const b = parts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const wSum = a.invMass + b.invMass;
          if (wSum === 0) continue;

          const correction = ((d - segLen) / d) * STIFFNESS;
          const ox = dx * correction;
          const oy = dy * correction;

          a.x += ox * (a.invMass / wSum);
          a.y += oy * (a.invMass / wSum);
          b.x -= ox * (b.invMass / wSum);
          b.y -= oy * (b.invMass / wSum);
        }

        // The anchor never moves.
        parts[0].x = rope.anchorX;
        parts[0].y = 0;
      }
    }

    /* 4 — Logos are solid objects; keep neighbouring ends from overlapping.
           A shove that lands on one cord travels outward from here. */
    for (let i = 0; i < ropes.length - 1; i++) {
      const a = ropes[i];
      const b = ropes[i + 1];
      if (!a.particles.length || !b.particles.length) continue;

      const pa = a.particles[a.particles.length - 1];
      const pb = b.particles[b.particles.length - 1];
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      const min = (a.size + b.size) * 0.52;
      if (d >= min) continue;

      const shove = ((min - d) / d) * 0.5;
      pa.x -= dx * shove;
      pa.y -= dy * shove;
      pb.x += dx * shove;
      pb.y += dy * shove;
    }
  }

  /* ── Write to the DOM ──────────────────────────────────────────────────── */

  function paint(rope: Rope) {
    const parts = rope.particles;
    if (parts.length < 2) return;

    const path = pathsRef.current.get(rope.tech.id);
    if (path) {
      // Quadratics through segment midpoints — a smooth curve through every
      // particle without solving splines each frame.
      let d = `M ${parts[0].x.toFixed(2)} ${parts[0].y.toFixed(2)}`;
      for (let i = 1; i < parts.length - 1; i++) {
        const mx = (parts[i].x + parts[i + 1].x) / 2;
        const my = (parts[i].y + parts[i + 1].y) / 2;
        d += ` Q ${parts[i].x.toFixed(2)} ${parts[i].y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
      }
      const end = parts[parts.length - 1];
      d += ` L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
      path.setAttribute("d", d);
    }

    if (rope.node) {
      const end = parts[parts.length - 1];
      const prev = parts[parts.length - 2];
      // The logo hangs off the last link, so it tilts with it.
      const tilt = Math.atan2(end.x - prev.x, end.y - prev.y);
      rope.node.style.transform = `translate3d(${end.x.toFixed(2)}px, ${end.y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${(tilt * 0.75).toFixed(4)}rad)`;
      rope.node.style.opacity = String(Math.min(1, rope.drop * 1.6));
    }
  }

  /* ── Pointer ───────────────────────────────────────────────────────────── */

  const handlePointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawCursor.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    [],
  );

  const clearPointer = useCallback(() => {
    rawCursor.current = { x: -9999, y: -9999 };
  }, []);

  const stageHeight = isNarrow ? 420 : 500;

  return (
    <section
      id="projects"
      aria-label="Tech stack"
      className="relative overflow-hidden px-gutter py-28 lg:py-40"
    >
      <div
        ref={stageRef}
        onPointerMove={handlePointer}
        onPointerLeave={clearPointer}
        className="relative w-full touch-pan-y"
        style={{ height: stageHeight }}
      >
        <div className="absolute left-1/2 top-8 z-10 flex -translate-x-1/2 flex-col items-center">
          <motion.p className="mb-3 flex items-center gap-4 text-[0.8rem] uppercase tracking-[0.35em] text-plum-faint">
            <span className="h-px w-10 bg-plum/20" />
            WHAT I BUILD WITH
          </motion.p>

          <motion.h2
            variants={stagger(0.07, 0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="pointer-events-none flex whitespace-nowrap font-display text-[clamp(3.5rem,8vw,6rem)] uppercase leading-[0.9] tracking-tight text-plum"
          >
            <span className="sr-only">Tech Stack</span>

            {Array.from("TECH STACK").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                aria-hidden
                variants={letterIn}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p className="mt-6 max-w-xl text-center text-md leading-relaxed text-plum-faint">
            Tools I use to design and build <br /> thoughtful digital experiences.
          </motion.p>
        </div>

        {/* Cords + rail */}
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible text-plum"
          aria-hidden
        >
          <line
            ref={railRef}
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeWidth="1.25"
          />
          <circle cx="0" cy="0" r="4" fill="currentColor" fillOpacity={0.45} />
          <circle
            cx="100%"
            cy="0"
            r="4"
            fill="currentColor"
            fillOpacity={0.45}
          />

          {visible.map((tech) => (
            <path
              key={tech.id}
              ref={(el) => registerPath(tech.id, el)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.45}
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {/* Logos, each riding the last particle of its rope */}
        <div className="absolute inset-0 z-20">
          {visible.map((tech) => (
            <div
              key={tech.id}
              ref={(el) => register(tech, el)}
              className="group absolute left-0 top-0 flex flex-col items-center will-change-transform"
              style={{ opacity: 0 }}
            >
              <img
                src={`/logos/${tech.id}.svg`}
                alt={tech.label}
                draggable={false}
                className="h-auto select-none"
                style={{ width: tech.size ?? 44 }}
              />
              <span className="pointer-events-none mt-3 whitespace-nowrap text-[0.55rem] uppercase tracking-[0.24em] text-plum-faint opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {tech.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
