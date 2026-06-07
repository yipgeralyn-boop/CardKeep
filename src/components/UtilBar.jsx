export function UtilBar({ pct, t, color }) {
  return (
    <div style={{
      height: 7, borderRadius: 999,
      background: t.dark ? 'rgba(255,255,255,0.08)' : 'rgba(38,34,25,0.07)',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${Math.min(100, pct)}%`, height: '100%', borderRadius: 999,
        background: color || t.accent,
        transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
      }} />
    </div>
  );
}
