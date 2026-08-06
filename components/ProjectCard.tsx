'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { springSoft } from '@/lib/motion';
import type { ProjectSummary } from '@/lib/types';

interface ProjectCardProps {
  project: ProjectSummary;
  /** 1-based position, printed as an editorial folio number. */
  index: number;
  /** Card edge length. The carousel passes a rem value; squares always. */
  size?: string;
  /** Duplicated loop copies stay clickable but leave the tab order alone. */
  focusable?: boolean;
}

/**
 * A perfect square, always. The image is the only thing that moves on hover —
 * the frame lifts, the photo zooms inside it, the label slides up.
 *
 * The wash over the thumbnail is plum rather than black: on a pink page a
 * neutral grey overlay reads as dirt.
 */
export default function ProjectCard({
  project,
  index,
  size = '22rem',
  focusable = true,
}: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -14 }}
      whileFocus={{ y: -14 }}
      transition={springSoft}
      style={{ width: size }}
      className="group relative aspect-square shrink-0"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block h-full w-full overflow-hidden rounded-[1.75rem] bg-petal shadow-[0_30px_70px_-32px_rgba(62,34,48,0.45)]"
        aria-label={`${project.title} — ${project.category}`}
        tabIndex={focusable ? undefined : -1}
      >
        {/* REPLACE: swap the thumbnail path in the project's .mdx frontmatter. */}
        <Image
          src={project.thumbnail}
          alt=""
          fill
          sizes="(max-width: 1024px) 72vw, 26vw"
          loading="lazy"
          className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.08]"
        />

        {/* Flat plum wash — deepens on hover so the label stays legible. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-plum/15 transition-colors duration-700 ease-editorial group-hover:bg-plum/70"
        />

        {/* Folio number, always visible */}
        <span className="absolute left-6 top-5 text-eyebrow uppercase text-blush/90">
          {String(index).padStart(2, '0')}
        </span>

        <ArrowUpRight
          aria-hidden
          className="absolute right-5 top-5 h-5 w-5 -translate-y-1 text-blush opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100"
          strokeWidth={1.5}
        />

        {/* Label: always shown on touch, revealed on hover for pointer devices */}
        <div className="absolute inset-x-6 bottom-6 md:translate-y-3 md:opacity-0 md:transition-all md:duration-700 md:ease-editorial md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
          <p className="text-eyebrow uppercase text-blush/75">{project.category}</p>
          <h3 className="mt-2 font-display text-2xl uppercase leading-none text-blush sm:text-3xl">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.article>
  );
}
