import type { Metadata } from "next";
import { Sacramento, Newsreader, Karla } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sacramento",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bymacy.com"),
  title: {
    default: "bymacy — ui/ux designer & frontend developer",
    template: "%s — bymacy",
  },
  description:
    "Portfolio of Macy, a ui/ux designer and frontend developer making warm, careful interfaces.",
  openGraph: {
    title: "bymacy — ui/ux designer & frontend developer",
    description:
      "Portfolio of Macy, a ui/ux designer and frontend developer making warm, careful interfaces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sacramento.variable} ${newsreader.variable} ${karla.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
