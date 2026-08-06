"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail } from "lucide-react";

import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { springSoft } from "@/lib/motion";
import { site } from "@/lib/site";

/* REPLACE the three hrefs in lib/site.ts, not here. */
const links = [
  {
    label: "Instagram",
    href: site.socials.instagram,
    Icon: Instagram,
    external: true,
  },
  {
    label: "LinkedIn",
    href: site.socials.linkedin,
    Icon: Linkedin,
    external: true,
  },
  { label: "Email", href: `mailto:${site.email}`, Icon: Mail, external: false },
];

export default function Footer() {
  return (
    <footer id="contact" aria-label="Contact" className="relative bg-paper">
      <Reveal delay={0}>
        <div className="mb-14 flex items-center justify-center gap-3">
          <span className="h-px w-24 bg-hairline" />
          <span className="text-lg text-rose">♡</span>
          <span className="h-px w-24 bg-hairline" />
        </div>
      </Reveal>

      <div className="mx-auto flex max-w-[110rem] flex-col items-center px-gutter py-section text-center">
        <Reveal delay={0.1} className="mt-6">
          <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] text-rose">
            ♡ Dont be a stranger.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 flex items-center gap-5 sm:gap-7">
          {links.map(({ label, href, Icon, external }) => (
            <motion.a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.09, y: -6 }}
              whileTap={{ scale: 0.96 }}
              transition={springSoft}
              data-cursor="link"
              className="group flex h-16 w-16 items-center justify-center rounded-full bg-rose text-paper transition-shadow duration-500 ease-editorial hover:shadow-[0_0_0_1px_rgba(62,34,48,0.22),0_18px_45px_-12px_rgba(223,111,161,0.75)] sm:h-20 sm:w-20"
            >
              <span className="sr-only">{label}</span>
              <Icon
                aria-hidden
                className="h-6 w-6 sm:h-7 sm:w-7"
                strokeWidth={1.6}
              />
            </motion.a>
          ))}
        </Reveal>

        <Reveal delay={0.28} className="mt-14">
          <a
            href={`mailto:${site.email}`}
            className="text-sm tracking-[0.08em] text-plum-muted underline decoration-hairline underline-offset-8 transition-colors hover:text-plum hover:decoration-plum"
          >
            {site.email}
          </a>
        </Reveal>

        <div className="mt-20 flex w-full max-w-3xl flex-col items-center gap-4 border-t border-hairline pt-8 text-eyebrow uppercase text-plum-faint sm:flex-row sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {site.name}
          </span>
          <span>Designed &amp; built with love</span>
        </div>
      </div>
    </footer>
  );
}
