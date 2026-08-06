import ProjectCarousel from '@/components/ProjectCarousel';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import type { ProjectSummary } from '@/lib/types';

interface ProjectsSectionProps {
  projects: ProjectSummary[];
}

/**
 * The one light band on the page — a cream insert between two dark sections,
 * the way a magazine switches stock for the portfolio pages.
 */
export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative bg-paper py-section"
    >
      <div className="px-gutter">
        <SectionTitle eyebrow="Selected work">
          Projects
        </SectionTitle>

        <Reveal
          delay={0.15}
          className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 text-center"
        >
          <p className="text-balance text-base leading-relaxed text-plum-muted">
            Interfaces, small products and experiments — each one an excuse to get a detail right.
          </p>
          <p className="text-eyebrow uppercase text-plum-faint">
            {projects.length} projects
            <span aria-hidden className="mx-3">/</span>
            <span className="hidden lg:inline">Move left or right to browse</span>
            <span className="lg:hidden">Swipe</span>
          </p>
        </Reveal>
      </div>

      <div className="mt-14 lg:mt-8">
        <ProjectCarousel projects={projects} />
      </div>
    </section>
  );
}
