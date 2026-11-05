export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="var(--accent)" />
      <path d="M8 21c3-1 4-9 8-9s4 6 8 4" fill="none" stroke="var(--accent-ink)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="8" cy="21" r="2.4" fill="var(--accent-ink)" />
      <circle cx="24" cy="16" r="2.4" fill="var(--accent-ink)" />
    </svg>
  );
}
