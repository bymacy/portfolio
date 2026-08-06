# BY MACY — portfolio

An editorial portfolio built with Next.js (App Router), TypeScript, Tailwind, Framer Motion and MDX.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verified: 12 static routes, ~148 kB first load on /
```

Node 18.17+ required. Fonts are fetched at build time by `next/font`, so the first build needs network access to Google Fonts.

---

## Replace this before you ship

| What | Where |
| --- | --- |
| Name, email, socials, domain, availability | `lib/site.ts` — everything personal lives here |
| Hero cut-out portrait | `public/images/portrait-hero.png` (transparent PNG, ~1400px tall) |
| About cut-out portrait | `public/images/portrait-about.png` |
| About copy | `paragraphs` and `facts` arrays at the top of `components/About.tsx` |
| Project writing, links, thumbnails | `content/projects/*.mdx` frontmatter + body |
| Project thumbnails | `public/images/projects/*.png` — square, 1200×1200 or larger |

Every placeholder in the repo is marked with a `REPLACE` comment, so `grep -rn "REPLACE" .` will find all of them.

---

## Structure

```
app/
  layout.tsx              fonts, metadata, nav, cursor
  page.tsx                hero → projects → about → footer
  not-found.tsx
  projects/[slug]/page.tsx  MDX project page, statically generated
components/
  Hero.tsx                BY / portrait / MACY layout + scroll parallax
  HeroImage.tsx           portrait entrance, parallax, accent disc
  TypingName.tsx          the looping type/delete wordmark
  Navbar.tsx              transparent → blurred, scroll-spy, mobile sheet
  ProjectsSection.tsx     title + copy + carousel (server)
  ProjectCarousel.tsx     sticky horizontal scroll / mobile snap rail
  ProjectCard.tsx         the square card
  About.tsx               portrait left, text right
  Footer.tsx              LET'S CONNECT + circular social buttons
  SectionTitle.tsx        letter-staggered display heading
  Reveal.tsx              the single fade-and-rise primitive
  CustomCursor.tsx        pointer-devices-only ring
  mdx.tsx                 MDX element → Tailwind mapping
content/projects/*.mdx    8 projects, frontmatter-driven
lib/
  site.ts                 all editable content constants
  projects.ts             filesystem reader, typed + sorted
  motion.ts               shared easing, springs and variants
  types.ts                Project / frontmatter contracts
```

---

## How a few pieces work

**Typing wordmark.** `TypingName` runs a `typing → holding → deleting → waiting` state machine. An invisible copy of the full word reserves the final width, so the portrait beside it never shifts while letters appear and disappear. With `prefers-reduced-motion`, it renders the finished word and stops.

**Sticky horizontal projects.** On `lg` and up the section's height is set to `100vh + horizontal travel`, so vertical scroll maps 1:1 onto the row moving left — no arbitrary "300vh" guess. Each card measures its own offset and scales up as it crosses the middle of the viewport, which is the coverflow look from your reference. Below `lg`, and for reduced-motion visitors, the same cards render in a native snapping swipe rail.

**Adding a 9th project.** Drop a new `.mdx` file into `content/projects/`. It's picked up automatically, sorted by `date` (newest first), and gets a static route. Frontmatter is validated at read time — a missing `title`, `category` or `thumbnail` throws with the filename.

**MDX frontmatter.** Use double quotes for any value containing an apostrophe; YAML treats `'don't'` as a syntax error.

---

## Design notes

Six palette colours, each with one job: `#FEDCE0` blush (page base and hero), `#F2F1EF` paper (projects band), `#F5C7CF` shell (about band), `#F5E3D1` cream (footer), `#F6B7D7` petal (soft fills behind imagery), `#DF6FA1` rose (the one saturated accent — pills, buttons, social circles).

One colour was added: `#3E2230` plum, for text. Nothing in the six is dark enough to read as body copy — rose on blush is only 2.6:1, well under the 4.5:1 minimum — so everything sets in a deep plum pulled from the rose's own hue. It clears 9:1 on every band. Rose is only ever used as a background with plum on top, never as text.

No gradients, no glassmorphism — the only blur is the nav backdrop and one flat petal disc behind the hero portrait.

Type is Anton for display (condensed, uppercase, clamped so it never overflows) and Plus Jakarta Sans for body. The outlined treatment is `-webkit-text-stroke` with a stroke width that steps up at each breakpoint.

Motion runs on one easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`) and two springs, both in `lib/motion.ts`. Change those two values and the whole site's feel changes with them.

Accessibility: keyboard focus is visible everywhere, the skip link works, letter-animated headings expose plain text to screen readers, the typing name announces "MACY" once, and `prefers-reduced-motion` disables the loop, the parallax, the custom cursor and the pinned scroll.
