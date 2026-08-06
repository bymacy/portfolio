import Link from "next/link";

const nav = [
  { href: "/#work", label: "portfolio" },
  { href: "/about", label: "about" },
  { href: "/resume", label: "resume" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-script text-3xl leading-none text-ink transition-colors hover:text-blush-2"
          aria-label="bymacy — home"
        >
          bymacy
        </Link>

        <nav aria-label="Main">
          <ul className="flex items-center gap-7 text-[0.95rem] sm:gap-12">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative inline-block py-1 text-ink-2 transition-colors hover:text-ink"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blush-2 transition-[width] duration-300 ease-soft group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
