// components.jsx — reusable UI building blocks
// Depends on window: Ic, money, statusColor (from data.jsx)

// Mini network logo / wordmark
function NetMark({ network, color = 'rgba(255,255,255,0.9)' }) {
  const s = { fontFamily: 'var(--font-ui)', fontWeight: 800, color, letterSpacing: 0.5 };
  if (network === 'VISA') return <span style={{ ...s, fontStyle: 'italic', fontSize: 15 }}>VISA</span>;
  if (network === 'AMEX') return <span style={{ ...s, fontSize: 11, letterSpacing: 1 }}>AMEX</span>;
  // mastercard interlocking circles
  return (
    <svg width="34" height="22" viewBox="0 0 34 22">
      <circle cx="13" cy="11" r="10" fill="#EB6F2D" opacity="0.95"/>
      <circle cx="21" cy="11" r="10" fill="#F4B819" opacity="0.85"/>
    </svg>
  );
}

// The credit card visual. size: 'lg' | 'md' | 'sm'
function CardArt({ card, size = 'md', style = {} }) {
  const dims = {
    lg: { w: '100%', h: 200, pad: 22, name: 17, num: 16, r: 22 },
    md: { w: '100%', h: 168, pad: 18, name: 15, num: 14, r: 20 },
    sm: { w: 56, h: 38, pad: 7, name: 0, num: 0, r: 9 },
  }[size];
  const [c1, c2] = card.grad;
  return (
    <div style={{
      position: 'relative', width: dims.w, height: dims.h, borderRadius: dims.r,
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      overflow: 'hidden', flexShrink: 0,
      boxShadow: size === 'sm' ? '0 1px 3px rgba(0,0,0,0.2)' : '0 8px 22px rgba(0,0,0,0.22)',
      ...style,
    }}>
      {/* soft sheen */}
      <div style={{ position: 'absolute', top: '-40%', right: '-20%', width: '70%', height: '160%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 60%)' }} />
      <div style={{ position: 'absolute', bottom: '-60%', left: '-10%', width: '60%', height: '140%',
        background: 'radial-gradient(circle, rgba(0,0,0,0.18), transparent 60%)' }} />
      {size === 'sm' ? (
        <div style={{ position: 'absolute', bottom: dims.pad, left: dims.pad, width: 18, height: 13, borderRadius: 3,
          background: 'linear-gradient(135deg,#F4D88A,#C9A24A)' }} />
      ) : (
        <div style={{ position: 'relative', height: '100%', padding: dims.pad, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: dims.name, letterSpacing: 0.2 }}>{card.name}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11.5, opacity: 0.75, marginTop: 2 }}>{card.issuer}</div>
            </div>
            <div style={{ width: 30, height: 22, borderRadius: 5, background: 'linear-gradient(135deg,#F4D88A,#C9A24A)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: dims.num, letterSpacing: 2, opacity: 0.92 }}>
              ••••&nbsp;&nbsp;{card.last4}
            </div>
            <NetMark network={card.network} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, label, t }) {
  const { fg, bg } = statusColor(status, t);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, color: fg, fontFamily: 'var(--font-ui)',
      fontWeight: 600, fontSize: 12.5, padding: '4px 10px', borderRadius: 999,
      whiteSpace: 'nowrap',
    }}>
      {status === 'paid' && <Ic.check width="13" height="13" />}
      {label}
    </span>
  );
}

// utilization bar
function UtilBar({ pct, t, color }) {
  return (
    <div style={{ height: 7, borderRadius: 999, background: t.dark ? 'rgba(255,255,255,0.08)' : 'rgba(38,34,25,0.07)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', borderRadius: 999,
        background: color || t.accent, transition: 'width .6s cubic-bezier(.2,.8,.2,1)' }} />
    </div>
  );
}

// primary button
function Btn({ children, onClick, t, variant = 'primary', full, disabled, style = {} }) {
  const base = {
    border: 'none', cursor: disabled ? 'default' : 'pointer', borderRadius: Math.min(t.radius, 18),
    fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
    padding: '15px 20px', width: full ? '100%' : undefined,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    whiteSpace: 'nowrap',
    transition: 'transform .12s ease, opacity .2s', opacity: disabled ? 0.45 : 1,
    WebkitTapHighlightColor: 'transparent', ...style,
  };
  const variants = {
    primary: { background: t.accent, color: t.onAccent, boxShadow: `0 6px 16px ${t.accent}44` },
    soft: { background: t.dark ? 'rgba(255,255,255,0.09)' : 'rgba(38,34,25,0.05)', color: t.text },
    ghost: { background: 'transparent', color: t.accent },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      onPointerDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      style={{ ...base, ...variants[variant] }}>{children}</button>
  );
}

Object.assign(window, { NetMark, CardArt, StatusPill, UtilBar, Btn });
