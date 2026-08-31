'use client';

import React from 'react';

interface DamaraLogoProps {
  className?: string;
}

export function DamaraLogo({
  className = 'w-full max-w-[340px] sm:max-w-[440px] md:max-w-[540px] h-auto',
}: DamaraLogoProps) {
  return (
    <svg
      viewBox="0 0 760 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="DAMARA"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="damara-logo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="18%" stopColor="#FFFDF7" />
          <stop offset="38%" stopColor="#F8E5C4" />
          <stop offset="60%" stopColor="#E6BC7A" />
          <stop offset="82%" stopColor="#CF9445" />
          <stop offset="100%" stopColor="#B37528" />
        </linearGradient>
      </defs>
      <text
        x="380"
        y="92"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="var(--font-montserrat), system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="144"
        letterSpacing="-3px"
        stroke="#462912"
        strokeWidth="24"
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="stroke fill"
        fill="url(#damara-logo-grad)"
      >
        DAMARA
      </text>
    </svg>
  );
}
