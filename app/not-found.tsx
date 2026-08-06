import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:px-10">
      <p className="font-script text-7xl text-blush-2">oops</p>
      <h1 className="mt-4 font-serif text-3xl font-light">
        This page isn&rsquo;t on the shelf.
      </h1>
      <p className="mt-3 text-ink-2">
        The link may be old, or the project moved.
      </p>
      <Link
        href="/#work"
        className="mt-9 rounded-full border border-blush-2 bg-blush px-7 py-3 text-[0.95rem] text-ink transition-transform duration-300 ease-soft hover:-translate-y-0.5"
      >
        Back to the portfolio
      </Link>
    </div>
  );
}
