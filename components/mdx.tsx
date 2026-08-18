import Image from 'next/image';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Typography for MDX bodies. Defined explicitly instead of pulling in a prose
 * plugin, so project pages use the same scale and rhythm as the rest of the site.
 */
/**
 * Prose elements are pinned to a narrow, centred reading column — the
 * classic "text is narrow, media is wide" case-study layout. `Figure` is
 * deliberately left out of that column (see below) so screenshots can
 * breathe at the full width of the page instead of being squeezed to
 * paragraph width.
 */
const PROSE_COLUMN = 'mx-auto max-w-3xl';

export const mdxComponents: MDXComponents = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className={`${PROSE_COLUMN} mt-20 font-display text-3xl uppercase leading-none text-plum first:mt-0 sm:text-4xl`}
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className={`${PROSE_COLUMN} mt-12 text-lg font-semibold tracking-tight text-plum`} {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className={`${PROSE_COLUMN} mt-6 text-pretty text-base leading-[1.85] text-plum/85`} {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className={`${PROSE_COLUMN} mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-plum/85`}
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className={`${PROSE_COLUMN} mt-6 list-decimal space-y-3 pl-5 text-base leading-relaxed text-plum/85`}
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="pl-1.5 marker:text-plum-faint" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-plum" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className={`${PROSE_COLUMN} mt-10 border-l border-plum/40 pl-6 text-lg italic leading-relaxed text-plum`}
      {...props}
    />
  ),
  hr: () => <hr className={`${PROSE_COLUMN} my-14 border-hairline`} />,
  a: ({ href = '#', ...props }: ComponentPropsWithoutRef<'a'>) => {
    const isInternal = href.startsWith('/') || href.startsWith('#');
    const className =
      'underline decoration-hairline underline-offset-4 transition-colors hover:decoration-plum';

    return isInternal ? (
      <Link href={href} className={className} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props} />
    );
  },
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code className="rounded bg-shell px-1.5 py-0.5 text-[0.9em] text-plum" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre className={`${PROSE_COLUMN} mt-8 overflow-x-auto rounded-2xl bg-shell p-6 text-sm leading-relaxed`} {...props} />
  ),
  /**
   * Usage in MDX: <Figure src="/images/projects/shot.png" caption="…" />
   * Intentionally full-bleed within the article's max-w-5xl frame — the
   * same width as the cover image above it — instead of the narrow prose
   * column, so a run of screenshots reads as a gallery, not a sidebar.
   * aspect-video matches the game's own 16:9 screenshots almost exactly,
   * so object-cover crops next to nothing.
   */
  Figure: ({ src, alt = '', caption }: { src: string; alt?: string; caption?: string }) => (
    <figure className="mx-auto mt-10 max-w-3xl first:mt-0">
      <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-petal">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-center text-eyebrow uppercase text-plum-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  ),
};
