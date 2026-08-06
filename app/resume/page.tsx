export const metadata = { title: "Resume" };

type Entry = {
  period: string;
  title: string;
  org: string;
  notes: string[];
};

const experience: Entry[] = [
  {
    period: "2025 — present",
    title: "Design volunteer",
    org: "AWS User Group BuildHers+ Philippines",
    notes: [
      "Designed announcement material and sticker sets for the mentorship initiative.",
      "Built reusable Figma templates so organisers could ship posts without a designer.",
    ],
  },
  {
    period: "2024 — 2025",
    title: "Freelance UI/UX designer",
    org: "Independent",
    notes: [
      "Designed product and game interfaces for small teams and student studios.",
      "Shipped frontends in Next.js and Tailwind CSS from my own designs.",
    ],
  },
];

const education: Entry[] = [
  {
    period: "2021 — 2025",
    title: "BS Information Technology",
    org: "Your University",
    notes: ["Coursework in interaction design, game development and web systems."],
  },
];

function Section({ heading, entries }: { heading: string; entries: Entry[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-3">
        {heading}
      </h2>

      <div className="mt-6 space-y-10">
        {entries.map((entry) => (
          <div
            key={entry.title + entry.period}
            className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-8"
          >
            <p className="pt-1 text-sm text-ink-3">{entry.period}</p>
            <div>
              <h3 className="font-serif text-xl font-light">{entry.title}</h3>
              <p className="mt-0.5 font-serif text-[0.95rem] italic text-ink-2">
                {entry.org}
              </p>
              <ul className="mt-3 space-y-2">
                {entry.notes.map((note) => (
                  <li
                    key={note}
                    className="relative pl-5 leading-[1.7] text-ink-2 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-blush-2"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-light leading-tight sm:text-5xl">
            Resume
          </h1>
          <p className="mt-3 font-serif text-lg italic text-ink-2">
            ui/ux designer &amp; frontend developer
          </p>
        </div>

        {/* Drop your PDF at public/macy-resume.pdf */}
        <a
          href="/macy-resume.pdf"
          download
          className="rounded-full border border-blush-2 bg-blush px-7 py-3 text-[0.95rem] text-ink transition-transform duration-300 ease-soft hover:-translate-y-0.5"
        >
          Download PDF
        </a>
      </div>

      <Section heading="Experience" entries={experience} />
      <Section heading="Education" entries={education} />
    </div>
  );
}
