"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Category, ProjectSummary } from "@/lib/types";

type Filter = ProjectSummary["category"] | "all";

export default function WorkGrid({
  projects,
  categories,
}: {
  projects: ProjectSummary[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects],
  );

  // Reveal cards as they enter the viewport.
  useEffect(() => {
    const nodes = gridRef.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!nodes?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [visible]);

  const filters: Filter[] = ["all", ...categories];

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <span className="mr-1 text-[0.95rem] text-ink-2">select category:</span>

        {filters.map((value) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={active}
              className={`rounded-full border px-6 py-2 text-[0.95rem] transition-all duration-300 ease-soft ${
                active
                  ? "border-blush-2 bg-blush text-ink"
                  : "border-line bg-transparent text-ink-2 hover:border-blush-2 hover:text-ink"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-ink-3">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <div
        ref={gridRef}
        className="mt-10 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2"
      >
        {visible.map((project, i) => (
          <div
            key={project.slug}
            className="reveal"
            style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
          >
            <ProjectCard project={project} index={i + 1} />
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-16 font-serif text-lg italic text-ink-2">
          Nothing filed under {filter} yet — try another category.
        </p>
      )}
    </>
  );
}
