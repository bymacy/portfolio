import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { mdxComponents } from '@/components/mdx';
import { getAdjacentProject, getProjectBySlug, getProjectSlugs } from '@/lib/projects';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: 'Project not found' };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.thumbnail }],
    },
  };
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const next = getAdjacentProject(project.slug);
  const meta = [
    { label: 'Category', value: project.category },
    { label: 'Role', value: project.role ?? 'Design & build' },
    { label: 'Year', value: project.year ?? project.date.slice(0, 4) },
  ];

  return (
    <>
      <article className="px-gutter pt-36 sm:pt-40">
        <div className="mx-auto max-w-5xl">
          <Reveal as="div" distance={16}>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-eyebrow uppercase text-plum-muted transition-colors hover:text-plum"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              All projects
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="mt-8">
            <h1 className="font-display text-display-md uppercase text-plum">{project.title}</h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-plum-muted">
              {project.description}
            </p>
          </Reveal>

          {/* Cover */}
          <Reveal delay={0.16} className="mt-14">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-petal">
              {/* REPLACE: thumbnail path lives in this project's .mdx frontmatter */}
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 64rem"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Meta strip */}
          <Reveal
            delay={0.22}
            className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-3"
          >
            {meta.map((item) => (
              <div key={item.label} className="bg-blush px-5 py-6">
                <p className="text-eyebrow uppercase text-plum-faint">{item.label}</p>
                <p className="mt-2 text-sm text-plum">{item.value}</p>
              </div>
            ))}
          </Reveal>

          {project.stack.length ? (
            <Reveal delay={0.26} className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-hairline px-4 py-1.5 text-eyebrow uppercase text-plum-muted"
                >
                  {tool}
                </span>
              ))}
            </Reveal>
          ) : null}

          {(project.live || project.github) && (
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
              {/* REPLACE: live / github URLs in the .mdx frontmatter */}
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-medium text-blush transition-transform duration-500 ease-editorial hover:-translate-y-1"
                >
                  Visit live site
                  <ArrowUpRight aria-hidden className="h-4 w-4" strokeWidth={1.8} />
                </a>
              ) : null}
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3 text-sm font-medium text-plum transition-transform duration-500 ease-editorial hover:-translate-y-1"
                >
                  <Github aria-hidden className="h-4 w-4" strokeWidth={1.6} />
                  Source code
                </a>
              ) : null}
            </Reveal>
          )}

          {/* MDX body — REPLACE the writing in content/projects/*.mdx
              No max-w here on purpose: prose elements pin themselves to a
              narrow centred column and Figure breaks out to the full
              max-w-5xl frame (see components/mdx.tsx), so this wrapper just
              needs to span that frame, not narrow it again.
              viewport amount is tiny on purpose: a long case study (lots of
              Figures) is taller than the viewport, so the default 25%
              threshold used elsewhere on the site could never be satisfied
              and the whole block would stay invisible forever. */}
          <Reveal
            delay={0.34}
            viewport={{ once: true, amount: 0 }}
            className="mt-16 pb-24"
          >
            <MDXRemote source={project.content} components={mdxComponents} />
          </Reveal>

          {next ? (
            <Reveal className="border-t border-hairline py-16">
              <p className="text-eyebrow uppercase text-plum-faint">Next project</p>
              <Link
                href={`/projects/${next.slug}`}
                className="group mt-4 flex flex-wrap items-baseline justify-between gap-4"
              >
                <span className="font-display text-display-md uppercase text-plum transition-opacity group-hover:opacity-70">
                  {next.title}
                </span>
                <span className="text-eyebrow uppercase text-plum-muted">{next.category}</span>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </article>

      <Footer />
    </>
  );
}
