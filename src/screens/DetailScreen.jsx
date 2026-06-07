import { useState, useMemo } from 'react';
import { Ic } from '../icons';
import { money, fmtDate, dueLabel, cardStatus, statusColor } from '../data';
import { CardArt } from '../components/CardArt';
import { StatusPill } from '../components/StatusPill';
import { UtilBar } from '../components/UtilBar';
import { Btn } from '../components/Btn';
import { SheetShell } from '../components/SheetShell';
import { Mascot } from '../Mascot';

function Stat({ label, value, t, accent }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: accent || t.text, marginTop: 3 }}>{value}</div>
    </div>
  );
}

export function DetailScreen({ t, card, onBack, onPay, onEdit }) {
  const status = cardStatus(card);
  const sc = statusColor(status, t);
  const util = Math.round((card.balance / card.limit) * 100);

  return (
    <div style={{ padding: '4px 18px 0' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: t.accent, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <Ic.back width="20" height="20" /> Cards
        </button>
        <button onClick={onEdit} style={{ border: 'none', background: t.surface, width: 38, height: 38, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: t.shadow, color: t.textSoft, WebkitTapHighlightColor: 'transparent' }}>
          <Ic.gear width="19" height="19" />
        </button>
      </div>

      {/* Card art */}
      <div style={{ marginBottom: 20 }}>
        <CardArt card={card} size="lg" />
      </div>

      {/* Status banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: sc.bg, borderRadius: t.radius, padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sc.fg }}>
            {status === 'paid' ? <Ic.check width="20" height="20" /> : <Ic.cal width="19" height="19" />}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: sc.fg }}>{dueLabel(card)}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft, marginTop: 1 }}>
              {card.paid ? `Paid on ${fmtDate(card.due)}` : `Statement due ${fmtDate(card.due)}`}
            </div>
          </div>
        </div>
        {card.autopay && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.accent, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 12.5 }}>
            <Ic.bolt width="15" height="15" /> Autopay
          </div>
        )}
      </div>

      {/* Balance breakdown */}
      <div style={{ background: t.surface, borderRadius: t.radius, padding: '18px 18px 16px', boxShadow: t.shadow, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft }}>Current balance</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: t.text, letterSpacing: -0.5, marginTop: 2 }}>{money(card.balance)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <Stat label="Minimum due" value={money(card.min)} t={t} accent={t.warn} />
          </div>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <Stat label="Statement balance" value={money(card.statement)} t={t} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft }}>Credit used</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: util > 50 ? t.warn : t.text }}>
              {money(card.balance, false)} / {money(card.limit, false)} · {util}%
            </span>
          </div>
          <UtilBar pct={util} t={t} color={util > 50 ? t.warn : t.good} />
        </div>
      </div>

      {/* Pay CTA */}
      {!card.paid && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <Btn t={t} onClick={onPay} full>Pay this card</Btn>
        </div>
      )}

      {/* Details list */}
      <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
        {[
          ['Card number', `•••• •••• •••• ${card.last4}`],
          ['Issuer', card.issuer],
          ['Statement closes', fmtDate(new Date(card.due.getFullYear(), card.due.getMonth(), card.due.getDate() - 21))],
          ['Autopay', card.autopay ? 'On · Statement balance' : 'Off'],
        ].map((row, i, arr) => (
          <div key={row[0]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${t.line}` : 'none' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, color: t.textSoft }}>{row[0]}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, fontWeight: 600, color: t.text }}>{row[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pay sheet ─────────────────────────────────────────────────
export function PaySheet({ t, card, onClose, onConfirm }) {
  const [amt, setAmt] = useState('full');
  const [custom, setCustom] = useState('');
  const value = amt === 'min' ? card.min : amt === 'full' ? card.statement : (parseFloat(custom) || 0);

  function Opt({ id, label, sub, val }) {
    const active = amt === id;
    return (
      <button onClick={() => setAmt(id)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
        background: active ? `${t.accent}12` : t.surface2, border: `1.5px solid ${active ? t.accent : 'transparent'}`,
        borderRadius: 16, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
        transition: 'all .15s', WebkitTapHighlightColor: 'transparent',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>{label}</div>
          {sub && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft, marginTop: 2 }}>{sub}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {val !== undefined && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: t.text }}>{money(val)}</span>}
          <span style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${active ? t.accent : t.line}`, background: active ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {active && <Ic.check width="13" height="13" style={{ color: t.onAccent }} />}
          </span>
        </div>
      </button>
    );
  }

  return (
    <SheetShell t={t} onClose={onClose} title="Make a payment">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <CardArt card={card} size="sm" />
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>{card.name}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint, marginTop: 1 }}>•••• {card.last4} · due {fmtDate(card.due)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        <Opt id="min"    label="Minimum payment"   sub="Avoids late fees"                val={card.min} />
        <Opt id="full"   label="Statement balance"  sub="Avoids interest · recommended"  val={card.statement} />
        <Opt id="custom" label="Custom amount" />
        {amt === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.surface2, borderRadius: 16, padding: '14px 16px', border: `1.5px solid ${t.accent}` }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: t.textSoft }}>$</span>
            <input
              autoFocus value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0.00" inputMode="decimal"
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: t.text, width: '100%' }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 14px' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft }}>Paying from</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: t.text }}>Checking •••• 2291</span>
      </div>

      <Btn t={t} full disabled={value <= 0} onClick={() => onConfirm(value)}>
        Pay {money(value)}
      </Btn>
    </SheetShell>
  );
}

// ── Paid celebration ──────────────────────────────────────────
const CHEERS = [
  'Good job, Alex! 🎉',
  'Nice — that\'s handled!',
  'Boom. One less to worry about.',
  'You\'re crushing it!',
];

export function PaidSheet({ t, card, amount, onClose }) {
  const msg = useMemo(() => CHEERS[Math.floor(Math.random() * CHEERS.length)], []);
  return (
    <SheetShell t={t} onClose={onClose} title="" compact>
      <div style={{ textAlign: 'center', padding: '8px 8px 4px' }}>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <Mascot mood="cheer" size={130} t={t} />
        </div>
        <div style={{
          display: 'inline-block', background: t.accent, color: t.onAccent,
          fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15,
          padding: '9px 16px', borderRadius: 16, position: 'relative',
          marginBottom: 18, animation: 'pop .35s .35s both', whiteSpace: 'nowrap', maxWidth: '100%',
        }}>
          {msg}
          <span style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 12, height: 12, background: t.accent, borderRadius: 2 }} />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 23, color: t.text, marginBottom: 6 }}>Payment scheduled</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: t.textSoft, marginBottom: 20, lineHeight: 1.45 }}>
          {money(amount)} to {card.name} will post in 1–2 business days. I'll remind you before the next one.
        </div>
        <Btn t={t} full onClick={onClose}>Done</Btn>
      </div>
    </SheetShell>
  );
}
