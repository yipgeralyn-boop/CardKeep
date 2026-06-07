import { useState } from 'react';
import { Mascot } from '../Mascot';
import { Btn } from './Btn';
import { Ic } from '../icons';

const FEATURES = [
  'Unlimited cards (free: 1 card)',
  'Full payoff planning & simulator',
  'Smart due date reminders',
  'New statement tracking',
];

export function UpgradeSheet({ t, onClose, onPurchase }) {
  const [plan, setPlan] = useState('yearly');

  const prices = {
    monthly: { label: 'Monthly', price: '$6.99', sub: 'per month' },
    yearly:  { label: 'Yearly',  price: '$49.99', sub: 'per year · save 40%' },
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 300,
      background: 'linear-gradient(160deg, #1C1640 0%, #2D1B69 50%, #1C1640 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 24px 28px', overflowY: 'auto',
      animation: 'slideUp .35s cubic-bezier(.2,.8,.2,1) both',
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 18, right: 18,
        width: 34, height: 34, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        WebkitTapHighlightColor: 'transparent',
      }}>
        ✕
      </button>

      {/* Mascot */}
      <Mascot mood="cheer" size={90} t={{ ...t, accent: '#7B6FFF', good: '#2E9E6B', warn: '#E8A93D', dark: true, onAccent: '#fff' }} style={{ marginBottom: 4 }} />

      {/* Heading */}
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: '#fff', textAlign: 'center', marginBottom: 6, letterSpacing: -0.3 }}>
        CardKeep Pro ✨
      </div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.5, marginBottom: 22 }}>
        Unlock unlimited cards and everything{'\n'}CardKeep has to offer.
      </div>

      {/* Feature list */}
      <div style={{ width: '100%', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {FEATURES.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: 999, background: 'rgba(99,84,230,0.5)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ic.check width="13" height="13" style={{ color: '#A78BFA' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, color: 'rgba(255,255,255,0.88)' }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Plan toggle */}
      <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 18 }}>
        {Object.entries(prices).map(([key, p]) => {
          const active = plan === key;
          return (
            <button key={key} onClick={() => setPlan(key)} style={{
              flex: 1, border: `2px solid ${active ? '#7B6FFF' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 16, padding: '13px 10px', cursor: 'pointer',
              background: active ? 'rgba(123,111,255,0.2)' : 'rgba(255,255,255,0.05)',
              transition: 'all .15s', WebkitTapHighlightColor: 'transparent',
              position: 'relative',
            }}>
              {key === 'yearly' && (
                <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#7B6FFF', borderRadius: 999, padding: '2px 10px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 10.5, color: '#fff', whiteSpace: 'nowrap' }}>
                  BEST VALUE
                </div>
              )}
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff' }}>{p.price}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{p.sub}</div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button onClick={() => onPurchase(plan)} style={{
        width: '100%', border: 'none', borderRadius: t.radius, cursor: 'pointer',
        background: 'linear-gradient(135deg, #7B6FFF, #5B4FD6)',
        color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
        padding: '15px 0', marginBottom: 12,
        boxShadow: '0 4px 20px rgba(91,79,214,0.5)',
        WebkitTapHighlightColor: 'transparent',
      }}>
        Start 7-day free trial
      </button>

      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 6 }}>
        Then {plan === 'yearly' ? '$49.99/yr' : '$6.99/mo'} · Cancel anytime
      </div>

      <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: '8px 0', WebkitTapHighlightColor: 'transparent' }}>
        Maybe later
      </button>
    </div>
  );
}
