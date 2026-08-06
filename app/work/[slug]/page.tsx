import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { getAllProjects, getProject } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const next = all[(index + 1) % all.length];

  const facts = [
    { label: "Discipline", value: project.discipline },
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
    { label: "Tools", value: project.tools?.join(", ") },
  ].filter((f) => Boolean(f.value));

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <Link
        href="/#work"
        className="inline-flex items-center gap-2 text-sm text-ink-2 transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> back to portfolio
      </Link>

      <header className="mt-10">
        <h1 className="font-serif text-4xl font-light leading-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 font-serif text-lg italic text-ink-2">
          {project.summary}
        </p>
      </header>

      {project.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover}
          alt=""
          className="mt-10 aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-line"
        />
      )}

      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-8 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-3">
              {fact.label}
            </dt>
            <dd className="mt-1.5 text-[0.95rem] text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14">
        <MDXRemote source={project.body} components={mdxComponents} />
      </div>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="mt-14 inline-flex rounded-full border border-blush-2 bg-blush px-7 py-3 text-[0.95rem] text-ink transition-all duration-300 ease-soft hover:-translate-y-0.5"
        >
          View the live project
        </a>
      )}

      {next && next.slug !== project.slug && (
        <nav className="mt-20 border-t border-line pt-8">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-3">
            Next project
          </p>
          <Link
            href={`/work/${next.slug}`}
            className="mt-2 inline-block font-serif text-2xl font-light transition-colors hover:text-blush-2"
          >
            {next.title}
          </Link>
        </nav>
      )}
    </article>
  );
}
