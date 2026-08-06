import Image from 'next/image';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Typography for MDX bodies. Defined explicitly instead of pulling in a prose
 * plugin, so project pages use the same scale and rhythm as the rest of the site.
 */
export const mdxComponents: MDXComponents = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-16 font-display text-3xl uppercase leading-none text-plum sm:text-4xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-12 text-lg font-semibold tracking-tight text-plum" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="mt-6 text-pretty text-base leading-[1.85] text-plum/85" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-plum/85" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mt-6 list-decimal space-y-3 pl-5 text-base leading-relaxed text-plum/85" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="pl-1.5 marker:text-plum-faint" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-plum" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="mt-10 border-l border-plum/40 pl-6 text-lg italic leading-relaxed text-plum"
      {...props}
    />
  ),
  hr: () => <hr className="my-14 border-hairline" />,
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
    <pre className="mt-8 overflow-x-auto rounded-2xl bg-shell p-6 text-sm leading-relaxed" {...props} />
  ),
  /** Usage in MDX: <Figure src="/images/projects/shot.png" caption="…" /> */
  Figure: ({ src, alt = '', caption }: { src: string; alt?: string; caption?: string }) => (
    <figure className="mt-12">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-petal">
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 60rem" className="object-cover" />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-eyebrow uppercase text-plum-faint">{caption}</figcaption>
      ) : null}
    </figure>
  ),
};
