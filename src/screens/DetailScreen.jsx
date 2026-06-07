import { useState } from 'react';
import { Ic } from '../icons';
import { money, fmtDate, dueLabel, cardStatus, statusColor } from '../data';
import { CardArt } from '../components/CardArt';
import { StatusPill } from '../components/StatusPill';
import { UtilBar } from '../components/UtilBar';
import { Btn } from '../components/Btn';
import { SheetShell } from '../components/SheetShell';

function Stat({ label, value, t, accent }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: accent || t.text, marginTop: 3 }}>{value}</div>
    </div>
  );
}

// ── Log Payment sheet ─────────────────────────────────────────
function LogPaymentSheet({ t, card, onClose, onConfirm }) {
  const [selected, setSelected] = useState('full');
  const [custom, setCustom]     = useState('');

  const presets = [
    { id: 'min',  label: 'Minimum payment', sub: 'Avoids late fees',               amount: card.min },
    { id: 'full', label: 'Full balance',     sub: 'Clears the statement',           amount: card.balance },
  ];
  const amount = selected === 'custom'
    ? (parseFloat(custom) || 0)
    : presets.find((p) => p.id === selected)?.amount ?? 0;

  return (
    <SheetShell t={t} onClose={onClose} title="Log a payment">
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft, marginBottom: 14, marginTop: -8 }}>
        Record how much you paid at your bank — the balance will update.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {presets.map((p) => {
          const active = selected === p.id;
          return (
            <button key={p.id} onClick={() => setSelected(p.id)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: active ? `${t.accent}12` : t.surface2,
              border: `1.5px solid ${active ? t.accent : 'transparent'}`,
              borderRadius: 16, padding: '13px 16px',
              transition: 'all .15s', WebkitTapHighlightColor: 'transparent',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>{p.label}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft, marginTop: 2 }}>{p.sub}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: t.text }}>{money(p.amount)}</span>
                <span style={{ width: 20, height: 20, borderRadius: 999, flexShrink: 0, border: `2px solid ${active ? t.accent : t.line}`, background: active ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {active && <Ic.check width="11" height="11" style={{ color: t.onAccent }} />}
                </span>
              </div>
            </button>
          );
        })}

        {/* Custom amount */}
        <button onClick={() => setSelected('custom')} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: selected === 'custom' ? `${t.accent}12` : t.surface2,
          border: `1.5px solid ${selected === 'custom' ? t.accent : 'transparent'}`,
          borderRadius: 16, padding: '13px 16px',
          transition: 'all .15s', WebkitTapHighlightColor: 'transparent',
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>Custom amount</span>
          <span style={{ width: 20, height: 20, borderRadius: 999, flexShrink: 0, border: `2px solid ${selected === 'custom' ? t.accent : t.line}`, background: selected === 'custom' ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selected === 'custom' && <Ic.check width="11" height="11" style={{ color: t.onAccent }} />}
          </span>
        </button>

        {selected === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.surface2, borderRadius: 16, padding: '13px 16px', border: `1.5px solid ${t.accent}` }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: t.textSoft }}>$</span>
            <input
              autoFocus
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              inputMode="decimal"
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: t.text, width: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Summary line */}
      {amount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 14px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft }}>Remaining after payment</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: Math.max(0, card.balance - amount) === 0 ? t.good : t.text }}>
            {money(Math.max(0, card.balance - amount))}
          </span>
        </div>
      )}

      <Btn t={t} full disabled={amount <= 0} onClick={() => onConfirm(amount)}>
        Log {amount > 0 ? money(amount) : 'payment'}
      </Btn>
    </SheetShell>
  );
}

// ── Detail screen ─────────────────────────────────────────────
function NewStatementSheet({ t, onClose, onConfirm }) {
  const [value, setValue] = useState('');
  const amount = parseFloat(value) || 0;

  return (
    <SheetShell t={t} onClose={onClose} title="New statement">
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft, marginBottom: 14, marginTop: -8 }}>
        Enter the new balance from your latest statement. This resets the card for the new billing cycle.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.surface2, borderRadius: 16, padding: '13px 16px', border: `1.5px solid ${t.accent}`, marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: t.textSoft }}>$</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="0.00"
          inputMode="decimal"
          style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: t.text, width: '100%' }}
        />
      </div>
      <Btn t={t} full disabled={amount <= 0} onClick={() => onConfirm(amount)}>
        Set new statement {amount > 0 ? `· $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
      </Btn>
    </SheetShell>
  );
}

export function DetailScreen({ t, card, onBack, onLogPayment, onNewStatement, onEdit }) {
  const [showSheet,         setShowSheet]         = useState(false);
  const [showNewStatement,  setShowNewStatement]   = useState(false);
  const status = cardStatus(card);
  const sc     = statusColor(status, t);
  const util   = Math.round((card.balance / card.limit) * 100);

  const handleConfirm = (amount) => {
    setShowSheet(false);
    onLogPayment(amount);
  };

  const handleNewStatement = (amount) => {
    setShowNewStatement(false);
    onNewStatement(amount);
  };

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
              {card.paid ? `Cleared · ${fmtDate(card.due)}` : `Statement due ${fmtDate(card.due)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Balance breakdown */}
      <div style={{ background: t.surface, borderRadius: t.radius, padding: '18px 18px 16px', boxShadow: t.shadow, marginBottom: 14 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft }}>Current balance</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: t.text, letterSpacing: -0.5, marginTop: 2 }}>{money(card.balance)}</div>
          {card.balance < card.statement && card.balance > 0 && (
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.good, marginTop: 4 }}>
              {money(card.statement - card.balance)} already paid this cycle
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <Stat label="Minimum due" value={money(card.min)} t={t} accent={t.warn} />
          </div>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <Stat label="Statement balance" value={money(card.statement)} t={t} />
          </div>
        </div>

        {card.limit > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft }}>Credit used</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: util > 50 ? t.warn : t.text }}>
                {money(card.balance, false)} / {money(card.limit, false)} · {util}%
              </span>
            </div>
            <UtilBar pct={util} t={t} color={util > 50 ? t.warn : t.good} />
          </div>
        )}
      </div>

      {/* Log payment / undo */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        {!card.paid && (
          <Btn t={t} full onClick={() => setShowSheet(true)}>
            <Ic.check width="17" height="17" /> Log a payment
          </Btn>
        )}
        {card.paid && (
          <Btn t={t} variant="soft" full onClick={() => onLogPayment(0)}>
            Undo — mark as unpaid
          </Btn>
        )}
      </div>

      {/* New statement */}
      <div style={{ marginBottom: 14 }}>
        <Btn t={t} variant="soft" full onClick={() => setShowNewStatement(true)}>
          <Ic.flag width="16" height="16" /> New statement arrived
        </Btn>
      </div>

      {/* Details list */}
      <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
        {[
          ['Card number', `•••• •••• •••• ${card.last4}`],
          ['Issuer', card.issuer],
          ['Statement closes', fmtDate(new Date(card.due.getFullYear(), card.due.getMonth(), card.due.getDate() - 21))],
        ].map((row, i, arr) => (
          <div key={row[0]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${t.line}` : 'none' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, color: t.textSoft }}>{row[0]}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, fontWeight: 600, color: t.text }}>{row[1]}</span>
          </div>
        ))}
      </div>

      {showSheet && (
        <LogPaymentSheet t={t} card={card} onClose={() => setShowSheet(false)} onConfirm={handleConfirm} />
      )}
      {showNewStatement && (
        <NewStatementSheet t={t} onClose={() => setShowNewStatement(false)} onConfirm={handleNewStatement} />
      )}
    </div>
  );
}
