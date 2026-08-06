/**
 * Big hero wordmark. Set in Sacramento so it stays selectable text and
 * scales with the viewport. If you have the real hand-lettered logo,
 * drop the SVG in `public/` and swap the <span> for an <Image />.
 */
export default function Wordmark() {
  return (
    <div className="relative inline-block">
      <span className="block font-script text-[clamp(5rem,17vw,13rem)] leading-[0.78] tracking-tight text-ink">
        bymacy
      </span>

      {/* flower accent, tucked into the tail of the y */}
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="absolute bottom-[14%] right-[6%] w-[clamp(2rem,5vw,3.25rem)]"
      >
        <g stroke="var(--color-ink)" strokeWidth={2} strokeLinejoin="round">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="24"
              cy="13"
              rx="8"
              ry="10"
              fill="var(--color-blush)"
              transform={`rotate(${deg} 24 24)`}
            />
          ))}
          <circle cx="24" cy="24" r="6" fill="var(--color-butter)" />
        </g>
      </svg>
    </div>
  );
}
