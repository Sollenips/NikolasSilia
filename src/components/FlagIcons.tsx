type FlagProps = { className?: string };

export function GreekFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 27 18" className={className} aria-hidden="true">
      <rect width="27" height="18" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12, 14, 16].map((y) => (
        <rect key={y} y={y} width="27" height="1" fill="#0D5EAF" />
      ))}
      <rect width="10" height="10" fill="#0D5EAF" />
      <rect x="4" width="2" height="10" fill="#FFFFFF" />
      <rect y="4" width="10" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export function UkFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true" preserveAspectRatio="none">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
