const links = [
  {
    href: "mailto:hello@bymacy.com",
    label: "Email Macy",
    icon: (
      <>
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
        <path d="M3.6 6.8 12 13l8.4-6.2" />
      </>
    ),
  },
  {
    href: "https://instagram.com/bymacy",
    label: "Instagram",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    href: "https://dribbble.com/bymacy",
    label: "Dribbble",
    icon: (
      <>
        <rect x="2.5" y="5" width="19" height="12" rx="2" />
        <path d="M1.5 19.5h21" />
        <path d="M12 9.2c1.6-1.3 3.4.5 0 2.6-3.4-2.1-1.6-3.9 0-2.6Z" />
      </>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer id="connect" className="mx-auto max-w-6xl px-6 sm:px-10">
      <hr className="border-line" />

      <div className="flex flex-col items-center gap-9 py-20">
        <h2 className="font-serif text-3xl font-light">let&rsquo;s connect!</h2>

        <ul className="flex items-center gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={link.label}
                className="flex size-16 items-center justify-center rounded-full border border-blush text-ink-2 transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-blush-2 hover:bg-blush/35 hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {link.icon}
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-sm text-ink-3">
          © {new Date().getFullYear()} bymacy. Made in the Philippines.
        </p>
      </div>
    </footer>
  );
}
