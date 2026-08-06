import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-gutter text-center">
      <p className="text-eyebrow uppercase text-plum-faint">Error 404</p>
      <h1 className="mt-6 font-display text-display-lg uppercase text-outline">Not here</h1>
      <p className="mt-6 max-w-sm text-balance text-base leading-relaxed text-plum-muted">
        That page has either moved or never existed. The work is still where you left it.
      </p>
      <Link
        href="/#projects"
        className="mt-10 rounded-full bg-plum px-7 py-3 text-sm font-medium text-blush transition-transform duration-500 ease-editorial hover:-translate-y-1"
      >
        Back to projects
      </Link>
    </section>
  );
}
