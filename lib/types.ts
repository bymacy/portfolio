/** Allowed project categories */
export type Category =
  | "Web"
  | "Mobile"
  | "UI/UX";

/** Frontmatter contract every file in content/projects/*.mdx must satisfy. */
export interface ProjectFrontmatter {
  title: string;
  description: string;
  category: Category;
  thumbnail: string;
  stack: string[];
  github?: string;
  live?: string;
  date: string; // ISO: YYYY-MM-DD
  featured: boolean;
  role?: string;
  year?: string;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  /** Raw MDX body, rendered by next-mdx-remote on the project page. */
  content: string;
}

/** A project without its body — enough to render a card. */
export type ProjectSummary = Omit<Project, "content">;

export interface NavItem {
  label: string;
  href: string;
  /** id of the <section> used for scroll-spy */
  sectionId: string;
}