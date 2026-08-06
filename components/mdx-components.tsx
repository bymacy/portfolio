import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/** Typography for MDX case studies. Hand-set so there's no plugin dependency. */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 font-serif text-2xl font-light text-ink first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-10 font-serif text-xl font-light text-ink" {...props} />
  ),
  p: (props) => (
    <p className="mt-5 text-[1.02rem] leading-[1.75] text-ink-2" {...props} />
  ),
  ul: (props) => <ul className="mt-5 space-y-2.5" {...props} />,
  ol: (props) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5" {...props} />
  ),
  li: (props) => (
    <li
      className="relative pl-5 leading-[1.7] text-ink-2 marker:text-blush-2 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-blush-2 [ol_&]:pl-0 [ol_&]:before:hidden"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-medium text-ink" {...props} />,
  em: (props) => <em className="font-serif italic text-ink" {...props} />,
  a: ({ href = "", ...props }) => {
    const external = href.startsWith("http");
    const className =
      "underline decoration-blush-2 decoration-1 underline-offset-4 transition-colors hover:text-blush-2";

    return external ? (
      <a href={href} target="_blank" rel="noreferrer" className={className} {...props} />
    ) : (
      <Link href={href} className={className} {...props} />
    );
  },
  blockquote: (props) => (
    <blockquote
      className="mt-8 border-l-2 border-blush pl-6 font-serif text-lg italic text-ink"
      {...props}
    />
  ),
  hr: () => <hr className="my-14 border-line" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img className="mt-8 w-full rounded-2xl ring-1 ring-line" {...props} />
  ),
};
