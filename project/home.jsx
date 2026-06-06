// home.jsx — Home dashboard (hero next-due + card list)
// Depends on window: money, daysUntil, fmtDate, fmtDay, dueLabel, cardStatus,
//   statusColor, Ic, CardArt, StatusPill, UtilBar, Btn

function CardRow({ card, t, onClick }) {
  const status = cardStatus(card);
  return (
    <button onClick={onClick}
      onPointerDown={(e) => (e.currentTarget.style.background = t.surface2)}
      onPointerUp={(e) => (e.currentTarget.style.background = t.surface)}
      onPointerLeave={(e) => (e.currentTarget.style.background = t.surface)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
        background: t.surface, border: 'none', cursor: 'pointer', padding: '13px 15px',
        borderRadius: t.radius, transition: 'background .15s', WebkitTapHighlightColor: 'transparent',
      }}>
      <CardArt card={card} size="sm" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15.5, color: t.text }}>{card.name}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint, marginTop: 2 }}>{card.issuer} •••• {card.last4}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: t.text }}>{money(card.paid ? card.statement : card.balance)}</div>
        <div style={{ marginTop: 6 }}><StatusPill status={status} label={dueLabel(card)} t={t} /></div>
      </div>
    </button>
  );
}

function HeroCard({ card, t, onPay, onOpen }) {
  const d = daysUntil(card.due);
  const status = cardStatus(card);
  const sc = statusColor(status, t);
  const urgent = status === 'overdue' || status === 'soon';

  return (
    <div style={{
      borderRadius: t.radius + 6, padding: 3, marginBottom: 24,
      background: urgent
        ? `linear-gradient(150deg, ${sc.fg}55, ${sc.fg}14)`
        : t.surface,
      boxShadow: t.shadow,
    }}>
      <div style={{ background: t.surface, borderRadius: t.radius + 3, padding: '20px 20px 18px' }}>
        {/* label row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: sc.fg }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: sc.fg, boxShadow: `0 0 0 4px ${sc.bg}` }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, letterSpacing: 0.3, textTransform: 'uppercase' }}>Next payment due</span>
          </div>
          <Ic.spark width="18" height="18" style={{ color: t.textFaint }} />
        </div>

        {/* big countdown */}
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

        {/* countdown chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, marginBottom: 18,
          background: sc.bg, color: sc.fg, padding: '8px 13px', borderRadius: 12,
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap',
        }}>
          <Ic.cal width="15" height="15" />
          {d === 0 ? 'Due today' : d === 1 ? 'Due tomorrow' : d < 0 ? `${Math.abs(d)} days overdue` : `${fmtDay(card.due)} · in ${d} days`}
        </div>

        {/* min vs full */}
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

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn t={t} onClick={onPay} style={{ flex: 1 }}>Pay now</Btn>
          <Btn t={t} variant="soft" onClick={onOpen} style={{ flex: '0 0 auto' }}>Details</Btn>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ t, cards, onSelect, onPay, onOpenPlan }) {
  const unpaid = cards.filter((c) => !c.paid);
  const paid = cards.filter((c) => c.paid);
  const next = [...unpaid].sort((a, b) => a.due - b.due)[0];
  const totalDue = unpaid.reduce((s, c) => s + c.balance, 0);
  const paidCount = paid.length;
  const totalDebt = cards.reduce((s, c) => s + c.balance, 0);
  const planSim = totalDebt > 0 ? simulatePayoff(cards, 450) : null;

  return (
    <div style={{ padding: '6px 18px 0' }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Mascot mood="happy" size={50} t={t} style={{ marginTop: -2, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft }}>Good morning, Alex</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: t.text, letterSpacing: 0.1, marginTop: 1 }}>
              {unpaid.length ? "Let's stay ahead" : "You're all caught up"}
            </div>
          </div>
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 999, background: t.accent, color: t.onAccent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>A</div>
      </div>

      {/* hero */}
      {next && <HeroCard card={next} t={t} onPay={() => onPay(next)} onOpen={() => onSelect(next)} />}

      {/* summary chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <div style={{ flex: 1, background: t.surface, borderRadius: t.radius, padding: '13px 15px', boxShadow: t.shadow }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>Due this month</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, color: t.text, marginTop: 3 }}>{money(totalDue, false)}</div>
        </div>
        <div style={{ flex: 1, background: t.surface, borderRadius: t.radius, padding: '13px 15px', boxShadow: t.shadow }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft }}>Paid this month</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, color: t.good }}>{paidCount}</span>
            <Ic.check width="16" height="16" style={{ color: t.good }} />
          </div>
        </div>
      </div>

      {/* payoff teaser */}
      {planSim && !planSim.stalled && (
        <button onClick={onOpenPlan}
          onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.985)')}
          onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left',
            background: t.surface, border: 'none', cursor: 'pointer', padding: '14px 16px',
            borderRadius: t.radius, boxShadow: t.shadow, marginBottom: 22, transition: 'transform .12s',
            WebkitTapHighlightColor: 'transparent' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: `${t.accent}16`, color: t.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic.chart width="22" height="22" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>Debt-free by {fmtMonthYear(planSim.payoffDate)}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft, marginTop: 1 }}>{money(totalDebt, false)} left · see your payoff plan</div>
          </div>
          <Ic.chevron width="18" height="18" style={{ color: t.textFaint, flexShrink: 0 }} />
        </button>
      )}

      {/* card list */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px 10px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: t.text }}>Your cards</h2>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, color: t.accent, fontWeight: 600 }}>{cards.length} total</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards.map((c) => <CardRow key={c.id} card={c} t={t} onClick={() => onSelect(c)} />)}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, CardRow, HeroCard });
