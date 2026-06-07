import { NetMark } from './NetMark';

export function CardArt({ card, size = 'md', style = {} }) {
  const dims = {
    lg: { w: '100%', h: 200, pad: 22, name: 17, num: 16, r: 22 },
    md: { w: '100%', h: 168, pad: 18, name: 15, num: 14, r: 20 },
    sm: { w: 56,     h: 38,  pad: 7,  name: 0,  num: 0,  r: 9  },
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
      <div style={{ position: 'absolute', top: '-40%', right: '-20%', width: '70%', height: '160%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 60%)' }} />
      <div style={{ position: 'absolute', bottom: '-60%', left: '-10%', width: '60%', height: '140%',
        background: 'radial-gradient(circle, rgba(0,0,0,0.18), transparent 60%)' }} />

      {size === 'sm' ? (
        <div style={{ position: 'absolute', bottom: dims.pad, left: dims.pad, width: 18, height: 13,
          borderRadius: 3, background: 'linear-gradient(135deg,#F4D88A,#C9A24A)' }} />
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
