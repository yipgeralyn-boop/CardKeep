export function Btn({ children, onClick, t, variant = 'primary', full, disabled, style = {} }) {
  const base = {
    border: 'none', cursor: disabled ? 'default' : 'pointer',
    borderRadius: Math.min(t.radius, 18),
    fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
    padding: '15px 20px', width: full ? '100%' : undefined,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    whiteSpace: 'nowrap',
    transition: 'transform .12s ease, opacity .2s', opacity: disabled ? 0.45 : 1,
    WebkitTapHighlightColor: 'transparent', ...style,
  };
  const variants = {
    primary: { background: t.accent, color: t.onAccent, boxShadow: `0 6px 16px ${t.accent}44` },
    soft:    { background: t.dark ? 'rgba(255,255,255,0.09)' : 'rgba(38,34,25,0.05)', color: t.text },
    ghost:   { background: 'transparent', color: t.accent },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onPointerDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}
