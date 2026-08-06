import type { Metadata, Viewport } from 'next';
import { Anton, Plus_Jakarta_Sans } from 'next/font/google';

import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import { site } from '@/lib/site';

import './globals.css';

/* Display: Anton — tall, condensed, unapologetic. Used only for headlines. */
const display = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
});

/* Body: Plus Jakarta Sans — geometric, quiet, wide range of weights. */
const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.wordmark.solid} ${site.wordmark.typed} — ${site.tagline}`,
    template: `%s — ${site.wordmark.solid} ${site.wordmark.typed}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.wordmark.solid} ${site.wordmark.typed}`,
    description: site.description,
    url: site.url,
    siteName: `${site.wordmark.solid} ${site.wordmark.typed}`,
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#FEDCE0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Keyboard users get out of the nav in one press */}
        <a
          href="#projects"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-plum focus:px-5 focus:py-2 focus:text-sm focus:text-blush"
        >
          Skip to projects
        </a>
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
