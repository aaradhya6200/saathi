// Full-bleed square app icon (green background, Saathi route mark), for next/og.
// The mark sits inside the central 60% so Android's round/squircle masks never clip it.
export function AppIconArt({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size, background: "#15803D", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 32 32" width={size * 0.6} height={size * 0.6}>
        <path d="M6 22c3.5-1 4.5-11 10-11s4.5 7 10 4.5" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="6" cy="22" r="3" fill="#FFFFFF" />
        <circle cx="26" cy="15.5" r="3" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
