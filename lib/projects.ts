import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/projects");

export const CATEGORIES = ["passion project", "pubmat", "school work"] as const;
export type Category = (typeof CATEGORIES)[number];

/** Placeholder tints used when a project has no cover image yet. */
export const TINTS = ["night", "grape", "cream", "forest", "magenta"] as const;
export type Tint = (typeof TINTS)[number];

export type ProjectMeta = {
  slug: string;
  title: string;
  /** The italic line under the card title, e.g. "Product Design". */
  discipline: string;
  category: Category;
  summary: string;
  tint: Tint;
  year?: string;
  cover?: string;
  role?: string;
  tools?: string[];
  link?: string;
  order: number;
};

export type Project = ProjectMeta & { body: string };

function parseFile(filename: string): Project {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug: filename.replace(/\.mdx?$/, ""),
    title: String(data.title ?? "Untitled"),
    discipline: String(data.discipline ?? ""),
    category: (data.category ?? "passion project") as Category,
    summary: String(data.summary ?? ""),
    tint: (data.tint ?? "cream") as Tint,
    year: data.year ? String(data.year) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    role: data.role ? String(data.role) : undefined,
    tools: Array.isArray(data.tools) ? data.tools.map(String) : undefined,
    link: data.link ? String(data.link) : undefined,
    order: Number(data.order ?? 999),
    body: content,
  };
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(parseFile)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

/** Only show filter pills that actually have projects behind them. */
export function getUsedCategories(projects: Project[]): Category[] {
  return CATEGORIES.filter((c) => projects.some((p) => p.category === c));
}
