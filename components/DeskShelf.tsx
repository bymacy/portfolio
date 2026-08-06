/**
 * The desk shelf. Drawn as inline SVG so it inherits theme colours,
 * stays crisp at any size, and costs no image request.
 * Stroke colour comes from `currentColor` — set it on the wrapper.
 */
export default function DeskShelf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 250"
      role="img"
      aria-label="A wooden shelf holding pencils, two succulents, stacked books, a laptop, a framed photo and a pair of headphones."
      className={`w-full text-ink ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ---------- pencil cup ---------- */}
      <g>
        <line x1="78" y1="118" x2="78" y2="146" className="stroke-ink-2" />
        <line x1="89" y1="110" x2="89" y2="146" className="stroke-ink-2" />
        <line x1="100" y1="122" x2="100" y2="146" className="stroke-ink-2" />
        <circle cx="78" cy="116" r="3.4" className="fill-blush stroke-ink" />
        <circle cx="89" cy="108" r="3.4" className="fill-sage stroke-ink" />
        <circle cx="100" cy="120" r="3.4" className="fill-butter stroke-ink" />
        <path d="M68 142 h42 l-4 34 h-34 Z" className="fill-paper" />
      </g>

      {/* ---------- small succulent ---------- */}
      <g>
        <ellipse cx="136" cy="136" rx="6" ry="13" className="fill-sage" transform="rotate(-28 136 136)" />
        <ellipse cx="152" cy="136" rx="6" ry="13" className="fill-sage" transform="rotate(28 152 136)" />
        <ellipse cx="144" cy="130" rx="6.5" ry="15" className="fill-sage" />
        <path d="M126 152 h36 l-4 24 h-28 Z" className="fill-blush" />
        <rect x="122" y="146" width="44" height="9" rx="3.5" className="fill-blush" />
      </g>

      {/* ---------- large succulent ---------- */}
      <g>
        <ellipse cx="186" cy="128" rx="7" ry="15" className="fill-sage" transform="rotate(-52 186 128)" />
        <ellipse cx="218" cy="128" rx="7" ry="15" className="fill-sage" transform="rotate(52 218 128)" />
        <ellipse cx="192" cy="120" rx="7" ry="17" className="fill-sage" transform="rotate(-24 192 120)" />
        <ellipse cx="212" cy="120" rx="7" ry="17" className="fill-sage" transform="rotate(24 212 120)" />
        <ellipse cx="202" cy="114" rx="7.5" ry="19" className="fill-sage" />
        <path d="M180 150 h44 l-5 26 h-34 Z" className="fill-paper" />
        <rect x="174" y="143" width="56" height="10" rx="4" className="fill-paper" />
      </g>

      {/* ---------- stacked books ---------- */}
      <g>
        <rect x="246" y="158" width="92" height="18" rx="3" className="fill-sage" />
        <line x1="256" y1="158" x2="256" y2="176" />
        <rect x="252" y="141" width="82" height="17" rx="3" className="fill-blush" />
        <line x1="326" y1="141" x2="326" y2="158" />
        <rect x="244" y="126" width="90" height="15" rx="3" className="fill-butter" />
        <line x1="254" y1="126" x2="254" y2="141" />
      </g>

      {/* ---------- laptop ---------- */}
      <g>
        <rect x="362" y="94" width="156" height="74" rx="7" className="fill-paper" />
        <rect x="371" y="103" width="138" height="56" rx="4" className="fill-paper-2" strokeWidth={1.6} />
        <rect x="350" y="166" width="180" height="11" rx="5.5" className="fill-paper" />
        <line x1="424" y1="171.5" x2="456" y2="171.5" strokeWidth={1.6} className="stroke-ink-3" />
      </g>

      {/* ---------- framed photo ---------- */}
      <g>
        <rect x="546" y="118" width="60" height="58" rx="4" className="fill-paper" />
        <rect x="555" y="126" width="42" height="42" rx="2.5" className="fill-paper-2" strokeWidth={1.6} />
        <circle cx="566" cy="137" r="4" className="fill-butter" strokeWidth={1.6} />
        <path d="M556 160 l12-14 9 10 6-6 14 16" strokeWidth={1.6} className="fill-sage" />
      </g>

      {/* ---------- little bud ---------- */}
      <g>
        <path d="M618 176 q0 -18 13 -18 t13 18 Z" className="fill-paper" />
        <path d="M631 158 q0 -8 7 -10" />
        <path d="M638 148 q6 0 7 6 -6 1 -7 -6 Z" className="fill-sage" />
      </g>

      {/* ---------- headphones on stand ---------- */}
      <g>
        <ellipse cx="683" cy="173" rx="27" ry="5.5" className="fill-paper" />
        <line x1="683" y1="168" x2="683" y2="128" />
        <path d="M661 132 v-6 a22 22 0 0 1 44 0 v6" className="fill-blush" />
        <rect x="653" y="128" width="17" height="28" rx="8" className="fill-blush" />
        <rect x="696" y="128" width="17" height="28" rx="8" className="fill-blush" />
      </g>

      {/* ---------- the shelf itself (drawn last, sits in front) ---------- */}
      <g>
        <rect x="40" y="176" width="680" height="15" rx="6" className="fill-butter" />
        <rect x="340" y="164" width="10" height="39" rx="4" className="fill-paper" />
        <rect x="534" y="164" width="10" height="39" rx="4" className="fill-paper" />
      </g>
    </svg>
  );
}
