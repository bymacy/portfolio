/**
 * Destination: src/lib/journey.ts
 *
 * Single source of truth for the About page timeline.
 * Presentation lives in the components — this file is only content.
 */

export type RoleIconName =
  | "video"
  | "megaphone"
  | "palette"
  | "note"
  | "calendar"
  | "people";

export type Photo = {
  /** Drop files in /public/images/journey/ — 4:5 portrait crops look best. */
  src: string;
  alt: string;
  /** Handwritten note under the polaroid. Keep it short and human. */
  caption: string;
  /** Degrees. Small numbers only — this is a scrapbook, not a windstorm. */
  tilt: number;
};

export type Experience = {
  id: string;
  role: string;
  organization: string;
  year: string;
  icon: RoleIconName;
  points: string[];
  photo?: Photo;
};

export const experiences: Experience[] = [
  {
    id: "tiktok-marketing-lead",
    role: "TikTok Marketing Lead",
    organization: "AWS Cloud Club Philippines — Student Community Day",
    year: "2025",
    icon: "video",
    points: [
      "Spearheaded the TikTok strategy, producing short-form content that lifted event visibility and engagement.",
      "Used storytelling formats built for student communities nationwide.",
    ],
    photo: {
      src: "/images/journey/tiktok-lead.jpg",
      alt: "Filming a short-form video at Student Community Day",
      caption: "take 14 — worth it",
      tilt: -4,
    },
  },
  {
    id: "associate-marketing-director",
    role: "Associate Marketing Director",
    organization: "AWS Cloud Club PUP",
    year: "2025",
    icon: "megaphone",
    points: [
      "Directed campaigns and content strategy that strengthened the org's presence on campus.",
      "Oversaw promotions and engagement initiatives that grew turnout at tech events.",
    ],
    photo: {
      src: "/images/journey/marketing-director.jpg",
      alt: "Campaign planning session with the marketing team",
      caption: "planning day ♡",
      tilt: 5,
    },
  },
  {
    id: "creative-design-supervisor",
    role: "Creative Design Supervisor",
    organization: "AWS User Group BuildHers+ Philippines",
    year: "2025",
    icon: "palette",
    points: [
      "Led the design team toward one cohesive brand across every touchpoint.",
      "Delivered visuals that put inclusivity and innovation front and centre.",
    ],
    photo: {
      src: "/images/journey/buildhers.jpg",
      alt: "BuildHers+ branding artwork laid out on a desk",
      caption: "BuildHers+ palette",
      tilt: -6,
    },
  },
  {
    id: "marketing-secretary",
    role: "Marketing Secretary",
    organization: "AWS Cloud Club PUP",
    year: "2025",
    icon: "note",
    points: [
      "Managed content scheduling, publicity materials and event communications.",
      "Streamlined the marketing workflow to improve visibility and turnout.",
    ],
    photo: {
      src: "/images/journey/secretary.jpg",
      alt: "Content calendar pinned to a board",
      caption: "the calendar era",
      tilt: 4,
    },
  },
  {
    id: "event-head",
    role: "Event Head",
    organization: "“Dress for Success” Career Event",
    year: "2025",
    icon: "calendar",
    points: [
      "Ran logistics, budgeting and scheduling for 150+ participants.",
      "Led five committees and kept the program running end to end.",
    ],
    photo: {
      src: "/images/journey/dress-for-success.jpg",
      alt: "Dress for Success event day, participants seated in the hall",
      caption: "150 people, one run sheet",
      tilt: -3,
    },
  },
  {
    id: "member-engagement",
    role: "Member Engagement Co-Lead",
    organization: "Cisco NetConnect PUP",
    year: "2025",
    icon: "people",
    points: [
      "Co-led onboarding and retention initiatives for new members.",
      "Organised interactive campaigns that got the community collaborating.",
    ],
    photo: {
      src: "/images/journey/netconnect.jpg",
      alt: "NetConnect members at a community meetup",
      caption: "new members day",
      tilt: 6,
    },
  },
];

/* ── Education ────────────────────────────────────────────────────────── */

export type Education = {
  id: string;
  /** The line that carries the most weight — degree or strand. */
  qualification: string;
  school: string;
  location: string;
  period: string;
  /** Marks the entry as current. Drives the small "now" dot. */
  current?: boolean;
};

export const education: Education[] = [
  {
    id: "pup-bsit",
    qualification: "Bachelor of Science in Information Technology",
    school: "Polytechnic University of the Philippines",
    location: "Sta. Mesa, Manila",
    period: "Sep 2023 — Present",
    current: true,
  },
  {
    id: "csjdm-stem",
    qualification: "Science, Technology, Engineering, and Mathematics",
    school: "City of San Jose del Monte National Science High School",
    location: "San Jose del Monte, Bulacan",
    period: "Sep 2021 — Jul 2023",
  },
];

/* ── Awards ───────────────────────────────────────────────────────────── */

export type Award = {
  id: string;
  title: string;
  /** Who gave it, or where it was won. Optional — not every award has one. */
  issuer?: string;
  period: string;
};

export const awards: Award[] = [
  {
    id: "presidents-lister",
    title: "President's Lister",
    issuer: "Polytechnic University of the Philippines",
    period: "2023 — 2026",
  },
  
  {
    id: "dost",
    title: "DOST Scholarship Awardee",
    period: "2023 — Present",
  },
];