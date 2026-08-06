"use client";

import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { EASE_EDITORIAL, springSnappy } from "@/lib/motion";
import { navItems, site } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  /* Scroll-spy: whichever section owns the middle of the viewport wins. */
  useEffect(() => {
    if (!isHome) return;

    const sections = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  /* Don't let the page scroll behind the open mobile sheet. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkHref = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE_EDITORIAL, delay: 0.2 }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-editorial",
          scrolled
            ? "border-b border-hairline bg-blush/80 py-3 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-6",
        )}
      >
        <nav className="mx-auto flex max-w-[110rem] items-center justify-between px-gutter">
          <Link
            href="/"
            className="font-sans text-lg font-semibold tracking-wide text-plum transition-opacity hover:opacity-70"
          >
            {site.wordmark.solid} {site.wordmark.typed}
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = isHome && active === item.sectionId;
              return (
                <li key={item.href}>
                  <Link
                    href={linkHref(item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className="relative block px-4 py-2 text-eyebrow uppercase text-plum-muted transition-colors hover:text-plum"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        transition={springSnappy}
                        className="absolute inset-0 -z-10 rounded-full bg-plum"
                      />
                    ) : null}
                    <span className={clsx(isActive && "text-paper")}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
              transition={springSnappy}
              className="block h-px w-6 bg-plum"
            />
            <motion.span
              animate={
                menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }
              }
              transition={springSnappy}
              className="block h-px w-6 bg-plum"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-blush px-gutter md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.06 * index,
                    ease: EASE_EDITORIAL,
                  }}
                >
                  <Link
                    href={linkHref(item.href)}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-display-md uppercase text-plum"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
