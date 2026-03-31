interface CategoryIconProps {
  categoryId: string;
  size?: number;
}

const iconPaths: Record<string, { bg: string; icon: JSX.Element }> = {
  korean: {
    bg: "hsl(0,75%,55%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="10" width="20" height="28" rx="2" />
        <line x1="18" y1="17" x2="30" y2="17" />
        <line x1="18" y1="22" x2="28" y2="22" />
        <line x1="18" y1="27" x2="26" y2="27" />
        <path d="M10 14l4-4v32" />
      </g>
    ),
  },
  math: {
    bg: "hsl(215,80%,55%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <text x="15" y="22" fill="white" stroke="none" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          12
        </text>
        <circle cx="28" cy="30" r="6" />
        <polygon points="16,30 20,26 24,30 20,34" fill="white" stroke="none" />
      </g>
    ),
  },
  social: {
    bg: "hsl(30,85%,55%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="18" r="8" />
        <path d="M18 14c2 4 8 4 12 0" />
        <path d="M16 18h16" />
        <circle cx="18" cy="34" r="4" />
        <circle cx="30" cy="34" r="4" />
        <line x1="22" y1="34" x2="26" y2="34" />
      </g>
    ),
  },
  science: {
    bg: "hsl(145,60%,42%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10v12l-6 10a4 4 0 004 4h12a4 4 0 004-4l-6-10V10" />
        <line x1="18" y1="10" x2="30" y2="10" />
        <circle cx="22" cy="30" r="1.5" fill="white" />
        <circle cx="27" cy="28" r="1" fill="white" />
      </g>
    ),
  },
  pe: {
    bg: "hsl(195,80%,55%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="12" r="3" fill="white" />
        <path d="M20 18l4 6 4-6" />
        <path d="M24 24v8" />
        <path d="M20 36l4-4 4 4" />
        <line x1="16" y1="22" x2="20" y2="18" />
        <line x1="32" y1="22" x2="28" y2="18" />
      </g>
    ),
  },
  music: {
    bg: "hsl(270,60%,58%)",
    icon: (
      <g fill="white">
        <circle cx="18" cy="32" r="4" />
        <rect x="21" y="12" width="2.5" height="20" />
        <path d="M23.5 12c0 0 6-2 6-6v8c0 0-6 2-6 6V12z" />
      </g>
    ),
  },
  art: {
    bg: "hsl(330,70%,62%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 10c-8 0-14 6-14 12s6 6 8 4c2-2 1-4 3-4s4 4 8 2 3-6-1-10c-2-2-3-4-4-4z" />
        <circle cx="16" cy="20" r="2" fill="hsl(0,75%,65%)" />
        <circle cx="22" cy="16" r="2" fill="hsl(45,90%,60%)" />
        <circle cx="28" cy="18" r="2" fill="hsl(215,80%,60%)" />
        <circle cx="26" cy="26" r="2" fill="hsl(145,60%,50%)" />
      </g>
    ),
  },
  creative: {
    bg: "hsl(45,90%,55%)",
    icon: (
      <g fill="white">
        <polygon points="24,10 26.5,18 35,18 28,23 30.5,31 24,26 17.5,31 20,23 13,18 21.5,18" />
        <circle cx="14" cy="12" r="1.5" />
        <circle cx="34" cy="14" r="1" />
        <circle cx="12" cy="28" r="1" />
        <circle cx="36" cy="26" r="1.5" />
      </g>
    ),
  },
  career: {
    bg: "hsl(230,55%,45%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="18" width="24" height="16" rx="2" />
        <path d="M20 18v-4a4 4 0 018 0v4" />
        <line x1="12" y1="26" x2="36" y2="26" />
        <circle cx="24" cy="26" r="2" fill="white" />
      </g>
    ),
  },
  daily: {
    bg: "hsl(90,55%,50%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 36V18l10-8 10 8v18H14z" />
        <rect x="20" y="26" width="8" height="10" />
        <path d="M28 16l-4-2-4 2" fill="white" stroke="none" opacity="0.4" />
      </g>
    ),
  },
  tools: {
    bg: "hsl(215,10%,55%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="10" />
        <circle cx="24" cy="24" r="4" />
        <path d="M24 10v4M24 34v4M10 24h4M34 24h4M13 13l3 3M32 32l3 3M35 13l-3 3M16 32l-3 3" />
      </g>
    ),
  },
  curriculum: {
    bg: "hsl(25,50%,45%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 10h16a2 2 0 012 2v24a2 2 0 01-2 2H14V10z" />
        <path d="M14 10a4 4 0 00-4 4v20a4 4 0 004 4" />
        <line x1="18" y1="18" x2="28" y2="18" />
        <line x1="18" y1="23" x2="26" y2="23" />
        <line x1="18" y1="28" x2="24" y2="28" />
      </g>
    ),
  },
  notice: {
    bg: "hsl(175,60%,42%)",
    icon: (
      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 10c-1 0-2 1-2 2v2c-5 1-8 5-8 10v4l-2 3h24l-2-3v-4c0-5-3-9-8-10v-2c0-1-1-2-2-2z" />
        <path d="M20 33a4 4 0 008 0" />
      </g>
    ),
  },
};

export default function CategoryIcon({ categoryId, size = 48 }: CategoryIconProps) {
  const data = iconPaths[categoryId];
  if (!data) return null;

  const svgSize = size;
  const circleR = svgSize / 2 - 1;

  return (
    <svg width={svgSize} height={svgSize} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r={circleR} fill={data.bg} opacity="0.15" />
      <circle cx="24" cy="24" r={circleR - 4} fill={data.bg} />
      {data.icon}
    </svg>
  );
}
