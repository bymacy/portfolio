# bymacy — portfolio

Next.js (App Router) · Tailwind CSS v4 · MDX case studies.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add a project

Create a file in `content/projects/`. The filename becomes the URL, so
`hainly.mdx` lives at `/work/hainly`.

```mdx
---
title: "Project name"
discipline: "UI Design"        # the italic line under the card title
category: "passion project"    # passion project | pubmat | school work
summary: "One sentence for the card and the page subtitle."
year: "2025"
order: 3                       # controls grid position, low first
tint: "cream"                  # night | grape | cream | forest | magenta
cover: "/work/hainly.png"      # optional
role: "Branding, UI system"    # optional
tools: ["Figma", "Tailwind CSS"]
link: "https://..."            # optional live link button
---

## Heading

Body copy. Markdown and JSX both work here.
```

No registry file to update — the grid reads the folder. Filter pills only
appear for categories that actually have projects.

## Images

Drop covers in `public/work/` and point `cover` at them. Until a cover exists,
the card falls back to a tinted placeholder, so nothing looks broken while
you're still exporting from Figma. Same for `public/macy-resume.pdf`, which the
resume page's download button expects.

## Design tokens

All colours and fonts live in one `@theme` block in `app/globals.css` — change
`--color-blush` there and it updates every pill, ring and hover state.

| Token | Value | Used for |
| --- | --- | --- |
| `paper` | `#fdfbf6` | page background |
| `ink` | `#3b2a21` | headings, strokes |
| `ink-2` / `ink-3` | `#7b6555` / `#a89684` | body, captions |
| `blush` / `blush-2` | `#f4cac5` / `#e09b95` | accents, active states |
| `sage` / `butter` | `#c8d9be` / `#f7e6bd` | illustration fills |

Type: Sacramento (wordmark), Newsreader (headings, italic captions), Karla (UI).

## Structure

```
app/
  page.tsx              hero + work grid
  about/, resume/       static pages
  work/[slug]/          MDX case study, statically generated
components/
  DeskShelf.tsx         the shelf illustration, inline SVG
  Wordmark.tsx          hero wordmark + flower
  WorkGrid.tsx          category filter (client)
  ProjectCard.tsx       card + cover fallback
  mdx-components.tsx    MDX typography
lib/projects.ts         reads and sorts the MDX frontmatter
```

## Notes

- The shelf and flower are hand-written SVG, not images — they scale, theme,
  and cost no network request. If you have the real hand-lettered logo, export
  it as SVG and swap it into `Wordmark.tsx`.
- Reduced motion is respected; all reveals and hovers switch off.
- Placeholder details to replace: email in `SiteFooter.tsx`, social URLs,
  university name in `app/resume/page.tsx`, and `metadataBase` in `app/layout.tsx`.
