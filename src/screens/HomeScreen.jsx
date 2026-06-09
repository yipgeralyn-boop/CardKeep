import { Ic } from '../icons';
import { money, daysUntil, fmtDate, fmtDay, dueLabel, cardStatus, statusColor, simulatePayoff, fmtMonthYear } from '../data';
import { CardArt } from '../components/CardArt';
import { StatusPill } from '../components/StatusPill';
import { Btn } from '../components/Btn';
import { Mascot } from '../Mascot';

function CardRow({ card, t, onClick }) {
  const status = cardStatus(card);
  return (
    <button
      onClick={onClick}
      onPointerDown={(e) => (e.currentTarget.style.background = t.surface2)}
      onPointerUp={(e) => (e.currentTarget.style.background = t.surface)}
      onPointerLeave={(e) => (e.currentTarget.style.background = t.surface)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
        background: t.surface, border: 'none', cursor: 'pointer', padding: '13px 15px',
        borderRadius: t.radius, transition: 'background .15s', WebkitTapHighlightColor: 'transparent',
      }}
    >
      <CardArt card={card} size="sm" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15.5, color: t.text }}>{card.name}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint, marginTop: 2 }}>{card.issuer} •••• {card.last4}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: t.text }}>{money(card.paid ? card.statement : card.balance)}</div>
        <div style={{ marginTop: 6 }}><StatusPill status={status} label={dueLabel(card)} t={t} /></div>
      </div>
      <Ic.chevron width="15" height="15" style={{ color: t.textFaint, flexShrink: 0, marginLeft: -4 }} />
    </button>
  );
}

function HeroCard({ card, t, onOpen }) {
  const d = daysUntil(card.due);
  const status = cardStatus(card);
  const sc = statusColor(status, t);
  const urgent = status === 'overdue' || status === 'soon';

  return (
    <div style={{
      borderRadius: t.radius + 6, padding: 3, marginBottom: 24,
      background: urgent ? `linear-gradient(150deg, ${sc.fg}55, ${sc.fg}14)` : t.surface,
      boxShadow: t.shadow,
    }}>
      <div style={{ background: t.surface, borderRadius: t.radius + 3, padding: '20px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: sc.fg }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: sc.fg, boxShadow: `0 0 0 4px ${sc.bg}` }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, letterSpacing: 0.3, textTransform: 'uppercase' }}>Next payment due</span>
          </div>
          <Ic.spark width="18" height="18" style={{ color: t.textFaint }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 4 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 52, lineHeight: 0.95, color: t.text, letterSpacing: -1 }}>
              {money(card.balance, false)}
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft, marginTop: 7 }}>
              {card.name} · due {fmtDate(card.due)}
            </div>
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, marginBottom: 18,
          background: sc.bg, color: sc.fg, padding: '8px 13px', borderRadius: 12,
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap',
        }}>
          <Ic.cal width="15" height="15" />
          {d === 0 ? 'Due today' : d === 1 ? 'Due tomorrow' : d < 0 ? `${Math.abs(d)} days overdue` : `${fmtDay(card.due)} · in ${d} days`}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: t.textSoft }}>Minimum</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text, marginTop: 2 }}>{money(card.min)}</div>
          </div>
          <div style={{ flex: 1, background: t.surface2, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.line}` }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: t.textSoft }}>Statement balance</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text, marginTop: 2 }}>{money(card.statement)}</div>
          </div>
        </div>

        <Btn t={t} variant="soft" onClick={onOpen} full>Log payment · manage card</Btn>
      </div>
    </div>
  );
}

function EmptyState({ t, onAdd }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px 48px', background: t.surface, borderRadius: t.radius + 4, boxShadow: t.shadow }}>
      <Mascot mood="idle" size={110} t={t} style={{ marginBottom: 10 }} />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: t.text, marginBottom: 8 }}>No cards yet</div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: t.textSoft, lineHeight: 1.5, marginBottom: 24 }}>
        Add your credit cards to track due dates and plan your payoff.
      </div>
      <Btn t={t} onClick={onAdd} full>
        <Ic.plus width="18" height="18" /> Add your first card
      </Btn>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 }}>
        <Ic.shield width="13" height="13" style={{ color: t.textFaint, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint }}>Your data stays on your device — never shared</span>
      </div>
    </div>
  );
}

export function HomeScreen({ t, cards, userName, onSelect, onOpenPlan, onAddCard, isPro, freeLimit }) {
  const unpaid = cards.filter((c) => !c.paid);
  const paid   = cards.filter((c) =>  c.paid);
  const next   = [...unpaid].sort((a, b) => a.due - b.due)[0];
  const totalDue   = unpaid.reduce((s, c) => s + c.balance, 0);
  const totalPaid  = cards.reduce((s, c) => s + Math.max(0, c.statement - c.balance), 0);
  const totalDebt  = cards.reduce((s, c) => s + c.balance, 0);
  const planSim   = totalDebt > 0 ? simulatePayoff(cards, 450) : null;

  const atFreeLimit = !isPro && freeLimit != null && cards.length >= freeLimit;
  const visibleCards = (!isPro && freeLimit != null) ? cards.slice(0, freeLimit) : cards;
  const lockedCount  = cards.length - visibleCards.length;
  const firstName = userName ? userName.trim().split(' ')[0] : '';
  const greeting  = !cards.length
    ? (firstName ? `Welcome, ${firstName}` : 'Welcome')
    : unpaid.length
      ? (firstName ? `Hey, ${firstName}` : "Let's stay ahead")
      : (firstName ? `Nice work, ${firstName}` : "You're all caught up");

  return (
    <div style={{ padding: '6px 18px 0' }}>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Mascot mood="happy" size={50} t={t} style={{ marginTop: -2, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft }}>DueCard</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: t.text, letterSpacing: 0.1, marginTop: 1 }}>
              {greeting}
            </div>
          </div>
        </div>
        <button onClick={onAddCard} style={{
          width: 42, height: 42, borderRadius: 999,
          background: atFreeLimit ? t.surface2 : t.accent,
          color: atFreeLimit ? t.textSoft : t.onAccent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: atFreeLimit ? `1.5px solid ${t.line}` : 'none',
          cursor: 'pointer',
          boxShadow: atFreeLimit ? 'none' : `0 4px 12px ${t.accent}55`,
          flexShrink: 0, WebkitTapHighlightColor: 'transparent',
        }}>
          {atFreeLimit ? <Ic.lock width="18" height="18" /> : <Ic.plus width="20" height="20" />}
        </button>
      </div>

      {/* Empty state */}
      {!cards.length && <EmptyState t={t} onAdd={onAddCard} />}

      {/* Hero card */}
      {next && <HeroCard card={next} t={t} onOpen={() => onSelect(next)} />}

      {/* Summary chips — only when cards exist */}
      {cards.length > 0 && <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <div style={{ flex: 1, background: t.surface, borderRadius: t.radius, padding: '13px 15px', boxShadow: t.shadow }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>Due this month</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, color: t.text, marginTop: 3 }}>{money(totalDue, false)}</div>
        </div>
        <div style={{ flex: 1, background: t.surface, borderRadius: t.radius, padding: '13px 15px', boxShadow: t.shadow }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>Paid this month</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, color: totalPaid > 0 ? t.good : t.text, marginTop: 3 }}>
            {money(totalPaid, false)}
          </div>
        </div>
      </div>}

      {/* Payoff teaser */}
      {planSim && !planSim.stalled && (
        <button
          onClick={onOpenPlan}
          onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.985)')}
          onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          style={{
            display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left',
            background: t.surface, border: 'none', cursor: 'pointer', padding: '14px 16px',
            borderRadius: t.radius, boxShadow: t.shadow, marginBottom: 22, transition: 'transform .12s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: `${t.accent}16`, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic.chart width="22" height="22" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>Debt-free by {fmtMonthYear(planSim.payoffDate)}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft, marginTop: 1 }}>{money(totalDebt, false)} left · see your payoff plan</div>
          </div>
          <Ic.chevron width="18" height="18" style={{ color: t.textFaint, flexShrink: 0 }} />
        </button>
      )}

      {/* Card list */}
      {cards.length > 0 && (
        <>
          <div style={{ padding: '0 4px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: t.text }}>Your cards</h2>
              <button onClick={onAddCard} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: atFreeLimit ? t.textSoft : t.accent, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13.5, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                {atFreeLimit ? <Ic.lock width="13" height="13" /> : <Ic.plus width="14" height="14" />}
                {atFreeLimit ? 'Pro' : 'Add'}
              </button>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint }}>Tap a card to log payments or update your statement</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleCards.map((c) => <CardRow key={c.id} card={c} t={t} onClick={() => onSelect(c)} />)}
          </div>
          {lockedCount > 0 && (
            <button onClick={onAddCard} style={{
              width: '100%', marginTop: 8, border: `1.5px dashed ${t.line}`, borderRadius: t.radius,
              background: 'transparent', cursor: 'pointer', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12, WebkitTapHighlightColor: 'transparent',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${t.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ic.lock width="18" height="18" style={{ color: t.accent }} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, color: t.text }}>{lockedCount} card{lockedCount > 1 ? 's' : ''} locked</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft, marginTop: 1 }}>Upgrade to Pro to unlock all cards</div>
              </div>
              <Ic.chevron width="15" height="15" style={{ color: t.textFaint }} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
