export function NetMark({ network, color = 'rgba(255,255,255,0.9)' }) {
  const s = { fontFamily: 'var(--font-ui)', fontWeight: 800, color, letterSpacing: 0.5 };
  if (network === 'VISA') return <span style={{ ...s, fontStyle: 'italic', fontSize: 15 }}>VISA</span>;
  if (network === 'AMEX') return <span style={{ ...s, fontSize: 11, letterSpacing: 1 }}>AMEX</span>;
  return (
    <svg width="34" height="22" viewBox="0 0 34 22">
      <circle cx="13" cy="11" r="10" fill="#EB6F2D" opacity="0.95"/>
      <circle cx="21" cy="11" r="10" fill="#F4B819" opacity="0.85"/>
    </svg>
  );
}
