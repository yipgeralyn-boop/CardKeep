import { Ic } from '../icons';
import { money, fmtDate, dueLabel, cardStatus, statusColor } from '../data';
import { CardArt } from '../components/CardArt';
import { StatusPill } from '../components/StatusPill';
import { UtilBar } from '../components/UtilBar';
import { Btn } from '../components/Btn';

function Stat({ label, value, t, accent }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: accent || t.text, marginTop: 3 }}>{value}</div>
    </div>
  );
}

export function DetailScreen({ t, card, onBack, onMarkPaid, onEdit }) {
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

      {/* Mark paid toggle */}
      <div style={{ marginBottom: 14 }}>
        <Btn t={t} variant={card.paid ? 'soft' : 'primary'} onClick={onMarkPaid} full>
          {card.paid ? <><Ic.check width="17" height="17" /> Paid — mark as unpaid</> : <><Ic.check width="17" height="17" /> Mark as paid</>}
        </Btn>
      </div>

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

