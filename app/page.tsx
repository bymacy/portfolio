import Wordmark from "@/components/Wordmark";
import DeskShelf from "@/components/DeskShelf";
import WorkGrid from "@/components/WorkGrid";
import { getAllProjects, getUsedCategories } from "@/lib/projects";

export default function HomePage() {
  const projects = getAllProjects();
  const categories = getUsedCategories(projects);

  // Strip the MDX body — the grid only needs metadata.
  const cards = projects.map(({ body, ...meta }) => meta);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 sm:px-10 sm:pt-24">
        <div className="relative flex flex-col items-center text-center">
          <Wordmark />

          <p className="mt-6 text-[0.8rem] tracking-[0.05em] text-ink-2 sm:absolute sm:right-2 sm:top-[38%] sm:mt-0 sm:text-left">
            ui/ux designer <span className="mx-1 text-ink-3">|</span> frontend
            developer
          </p>
        </div>

        <DeskShelf className="mx-auto mt-14 max-w-3xl sm:mt-20" />
      </section>

      <section
        id="work"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
      >
        <WorkGrid projects={cards} categories={categories} />
      </section>
    </>
  );
}
