import Link from "next/link";

export const metadata = { title: "About" };

const toolkit = [
  { group: "Design", items: ["Figma", "Aseprite", "Illustrator", "Photoshop"] },
  { group: "Build", items: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"] },
  { group: "Practice", items: ["Design systems", "Usability testing", "Prototyping"] },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <h1 className="font-serif text-4xl font-light leading-tight sm:text-5xl">
        Hi, I&rsquo;m Macy.
      </h1>

      <div className="mt-8 space-y-5 text-[1.02rem] leading-[1.75] text-ink-2">
        <p>
          I&rsquo;m a ui/ux designer and frontend developer based in the
          Philippines. I design interfaces and then build them, which mostly
          means I get caught early when a layout only works in Figma.
        </p>
        <p>
          The work I like best is small and specific: a single screen that does
          one thing kindly, a game menu that a first-time player can read
          without help, a pubmat that survives being reposted six times. Warmth
          is a functional requirement, not a decoration.
        </p>
        <p>
          Right now I&rsquo;m open to junior product design and frontend roles,
          and I take on pubmat and branding work for community orgs.
        </p>
      </div>

      <h2 className="mt-16 text-[0.68rem] uppercase tracking-[0.18em] text-ink-3">
        Toolkit
      </h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-3">
        {toolkit.map((column) => (
          <div key={column.group}>
            <h3 className="font-serif text-lg font-light">{column.group}</h3>
            <ul className="mt-3 space-y-1.5 text-[0.95rem] text-ink-2">
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-4">
        <Link
          href="/#work"
          className="rounded-full border border-blush-2 bg-blush px-7 py-3 text-[0.95rem] text-ink transition-transform duration-300 ease-soft hover:-translate-y-0.5"
        >
          See the work
        </Link>
        <a
          href="mailto:hello@bymacy.com"
          className="rounded-full border border-line px-7 py-3 text-[0.95rem] text-ink-2 transition-colors duration-300 hover:border-blush-2 hover:text-ink"
        >
          Send me an email
        </a>
      </div>
    </div>
  );
}
