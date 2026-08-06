import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import type { Project, ProjectFrontmatter, ProjectSummary } from './types';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

function readProjectFile(fileName: string): Project {
  const slug = fileName.replace(/\.mdx$/, '');
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);
  const fm = data as Partial<ProjectFrontmatter>;

  // Fail loudly in development rather than shipping a half-rendered card.
  if (!fm.title || !fm.thumbnail || !fm.category) {
    throw new Error(
      `content/projects/${fileName} is missing required frontmatter (title, category, thumbnail).`
    );
  }

  return {
    slug,
    title: fm.title,
    description: fm.description ?? '',
    category: fm.category,
    thumbnail: fm.thumbnail,
    stack: fm.stack ?? [],
    github: fm.github,
    live: fm.live,
    date: fm.date ?? '1970-01-01',
    featured: fm.featured ?? false,
    role: fm.role,
    year: fm.year,
    content,
  };
}

/** Every project, newest first. Server-only — reads the filesystem. */
export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map(readProjectFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Card-sized payload — strips the MDX body so it can cross to a client component. */
export function getProjectSummaries(): ProjectSummary[] {
  return getAllProjects().map(({ content: _content, ...summary }) => summary);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}

/** Used by the project page to offer "next project" at the end. */
export function getAdjacentProject(slug: string): ProjectSummary | undefined {
  const all = getProjectSummaries();
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1 || all.length < 2) return undefined;
  return all[(index + 1) % all.length];
}
