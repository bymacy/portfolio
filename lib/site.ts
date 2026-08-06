import type { NavItem } from './types';

/**
 * ── REPLACE ME ──────────────────────────────────────────────────────────────
 * Everything a future edit is likely to touch lives here, so you never have to
 * hunt through components for a handle or an email address.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const site = {
  name: 'Macy',
  wordmark: { solid: 'BY', typed: 'MACY' },
  url: 'https://bymacy.com', // REPLACE: your deployed domain
  tagline: 'UI/UX Designer & Frontend Developer',
  description:
    'Portfolio of Macy — an Information Technology student designing and building interfaces that feel gentle, intentional and a little playful.',
  location: 'Philippines', // REPLACE if you'd rather show a city
  roles: ['UI/UX Designer', 'Frontend Developer'],
  email: 'macyj.temblique@gmail.com', // REPLACE: your email
  socials: {
    instagram: 'https://instagram.com/misikeyn', // REPLACE
    linkedin: 'https://linkedin.com/in/mabliq', // REPLACE
  },
  images: {
    // REPLACE both with your own cut-out PNGs (transparent background).
    hero: '/images/portrait-hero.png',
    about: '/images/about.PNG',
  },
} as const;

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home', sectionId: 'home' },
  { label: 'Projects', href: '#projects', sectionId: 'projects' },
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];
