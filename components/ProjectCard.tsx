"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProjectMeta, Tint } from "@/lib/projects";

/** Placeholder backgrounds, used until a real cover lands in /public/work. */
const TINT_STYLES: Record<Tint, string> = {
  night: "bg-[linear-gradient(160deg,#1d2b45,#101a2c)] text-butter",
  grape: "bg-[linear-gradient(160deg,#b28ae0,#7d5bb8)] text-white",
  cream: "bg-[linear-gradient(160deg,#fdf6e6,#f4e6cd)] text-ink",
  forest: "bg-[linear-gradient(160deg,#8fc0e8,#5f9b6d)] text-white",
  magenta: "bg-[linear-gradient(160deg,#e77fc0,#a8459b)] text-white",
};

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = Boolean(project.cover) && !coverFailed;

  return (
    <article className="group">
      <Link href={`/work/${project.slug}`} className="block">
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-line transition-all duration-500 ease-soft group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_40px_-24px_rgba(59,42,33,0.45)] ${
            showCover ? "bg-paper-2" : TINT_STYLES[project.tint]
          }`}
        >
          {showCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover}
              alt={`${project.title} — ${project.discipline}`}
              className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
              onError={() => setCoverFailed(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="font-serif text-2xl leading-tight">
                {project.title}
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.2em] opacity-70">
                cover coming soon
              </span>
            </div>
          )}
        </div>

        <h3 className="mt-5 font-serif text-[1.35rem] font-light leading-snug text-ink">
          {project.title}
        </h3>
        <p className="mt-1 font-serif text-[0.95rem] italic text-ink-2">
          {project.discipline}
        </p>
      </Link>
    </article>
  );
}
