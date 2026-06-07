import { Ic } from '../icons';
import { money, fmtMonthYear, fmtMonths, blendedApr, simulatePayoff, recommendedPayment } from '../data';
import { CardArt } from '../components/CardArt';
import { Btn } from '../components/Btn';
import { Mascot } from '../Mascot';

function PayoffChart({ series, t, payoffDate }) {
  const W = 320, H = 132, pad = 6;
  const n = series.length;
  const max = Math.max(...series, 1);
  const pts = series.map((v, i) => {
    const x = pad + (i / Math.max(1, n - 1)) * (W - pad * 2);
    const y = pad + (1 - v / max) * (H - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H - pad} L${pts[0][0].toFixed(1)},${H - pad} Z`;
  const finite = isFinite(series[series.length - 1]) && payoffDate;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="payfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={t.accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={t.accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#payfill)" />
      <path d={line} fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {finite && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill={t.good} stroke={t.surface} strokeWidth="2.5" />}
      <circle cx={pts[0][0]} cy={pts[0][1]} r="4" fill={t.accent} stroke={t.surface} strokeWidth="2.5" />
    </svg>
  );
}

export function PayoffScreen({ t, cards, monthly, setMonthly }) {
  const debts  = cards.filter((c) => c.balance > 0);
  const total  = debts.reduce((s, c) => s + c.balance, 0);
  const minSum = debts.reduce((s, c) => s + c.min, 0);
  const apr    = blendedApr(cards);

  const sim    = simulatePayoff(cards, monthly);
  const rec    = recommendedPayment(cards, 12);
  const recSim = simulatePayoff(cards, rec);
  const interestSaved = isFinite(sim.interest) ? Math.max(0, sim.interest - recSim.interest) : null;

  const order  = [...debts].sort((a, b) => b.apr - a.apr);
  const attack = order[0];

  const sliderMin = Math.ceil((minSum + 20) / 10) * 10;
  const sliderMax = Math.max(sliderMin + 100, Math.ceil(total / 100) * 100);
  const usingRec  = monthly === rec;

  if (total <= 0) {
    return (
      <div style={{ padding: '6px 18px 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: t.text, marginBottom: 26 }}>Payoff plan</div>
        <div style={{ textAlign: 'center', padding: '40px 20px 48px', background: t.surface, borderRadius: t.radius, boxShadow: t.shadow }}>
          <Mascot mood="cheer" size={120} t={t} style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: t.text, marginBottom: 6 }}>Debt-free 🎉</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: t.textSoft }}>No outstanding balances to plan around. Keep it up!</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '6px 18px 0' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: t.text }}>Payoff plan</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft, marginTop: 2 }}>
          {money(total)} across {debts.length} cards · {(apr * 100).toFixed(1)}% blended APR
        </div>
      </div>

      {/* Projection hero */}
      <div style={{ background: t.surface, borderRadius: t.radius + 4, padding: '18px 18px 14px', boxShadow: t.shadow, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: t.accent }}>Debt-free by</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: t.text, letterSpacing: -0.5, marginTop: 3 }}>
              {sim.stalled ? 'Not yet' : fmtMonthYear(sim.payoffDate)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>Time to clear</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text, marginTop: 3, whiteSpace: 'nowrap' }}>{fmtMonths(sim.months)}</div>
          </div>
        </div>
        <PayoffChart series={sim.series} t={t} payoffDate={sim.payoffDate} />
        {sim.stalled && (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.danger, marginTop: 8 }}>
            That's below your combined minimums ({money(minSum)}). Increase the payment to make progress.
          </div>
        )}
      </div>

      {/* Slider */}
      <div style={{ background: t.surface, borderRadius: t.radius, padding: '16px 18px 18px', boxShadow: t.shadow, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, fontWeight: 600, color: t.text }}>Monthly payment</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: t.accent }}>{money(monthly, false)}</span>
        </div>
        <input type="range" min={sliderMin} max={sliderMax} step={10} value={Math.min(monthly, sliderMax)}
               onChange={(e) => setMonthly(parseInt(e.target.value))}
               style={{ width: '100%', accentColor: t.accent, height: 6, cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11.5, color: t.textFaint }}>min {money(sliderMin, false)}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11.5, color: t.textFaint }}>{money(sliderMax, false)}</span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: t.textSoft }}>Total interest</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: isFinite(sim.interest) ? t.text : t.danger, marginTop: 2 }}>
              {isFinite(sim.interest) ? money(sim.interest) : '∞'}
            </div>
          </div>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: t.textSoft }}>You'll pay back</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text, marginTop: 2 }}>
              {isFinite(sim.interest) ? money(total + sim.interest, false) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended callout */}
      {!usingRec && (
        <div style={{ borderRadius: t.radius, padding: 2, marginBottom: 16, background: `linear-gradient(135deg, ${t.accent}, ${t.accent}99)`, boxShadow: t.shadow }}>
          <div style={{ background: t.surface, borderRadius: t.radius - 2, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${t.accent}18`, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic.target width="19" height="19" />
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: t.text }}>Recommended</span>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft, lineHeight: 1.5, marginBottom: 14 }}>
              Pay <b style={{ color: t.text }}>{money(rec, false)}/mo</b> to be debt-free by <b style={{ color: t.text }}>{fmtMonthYear(recSim.payoffDate)}</b>
              {interestSaved && interestSaved > 5 ? <> — saving <b style={{ color: t.good }}>{money(interestSaved)}</b> in interest.</> : '.'}
            </div>
            <Btn t={t} full onClick={() => setMonthly(rec)}>Use {money(rec, false)}/mo</Btn>
          </div>
        </div>
      )}

      {/* Avalanche order */}
      <h2 style={{ margin: '4px 4px 12px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text }}>Smart payoff order</h2>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, color: t.textSoft, margin: '0 4px 14px', lineHeight: 1.5 }}>
        Put every spare dollar on <b style={{ color: t.text }}>{attack.name}</b> first — it has the highest interest rate. Keep minimums on the rest.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {order.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 13, background: t.surface, borderRadius: t.radius, padding: '12px 15px', boxShadow: t.shadow }}>
            <div style={{ width: 24, height: 24, borderRadius: 999, flexShrink: 0,
              background: i === 0 ? t.accent : t.surface2, color: i === 0 ? t.onAccent : t.textSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
            <CardArt card={c} size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>{c.name}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint, marginTop: 1 }}>{(c.apr * 100).toFixed(2)}% APR</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5, color: t.text }}>{money(c.balance)}</div>
              {i === 0 && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11.5, fontWeight: 700, color: t.accent, marginTop: 2 }}>ATTACK FIRST</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
