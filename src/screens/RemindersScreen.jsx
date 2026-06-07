import { Ic } from '../icons';
import { money, fmtDate, fmtDay, cardStatus, statusColor, daysUntil } from '../data';
import { CardArt } from '../components/CardArt';
import { StatusPill } from '../components/StatusPill';

function ReminderToggle({ on, t, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      width: 50, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 3,
      background: on ? t.good : (t.dark ? 'rgba(255,255,255,0.16)' : 'rgba(38,34,25,0.16)'),
      display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'all .2s', WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'all .2s' }} />
    </button>
  );
}

function TimelineRow({ card, t, onSelect, isLast }) {
  const status = cardStatus(card);
  const sc = statusColor(status, t);
  const d = daysUntil(card.due);

  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18 }}>
        <span style={{ width: 14, height: 14, borderRadius: 999, background: t.surface, border: `3px solid ${sc.fg}`, marginTop: 4, flexShrink: 0, zIndex: 1 }} />
        {!isLast && <span style={{ width: 2, flex: 1, background: t.line, marginTop: 2 }} />}
      </div>
      <button onClick={() => onSelect(card)} style={{
        flex: 1, marginBottom: isLast ? 0 : 12, background: t.surface, border: 'none', cursor: 'pointer',
        borderRadius: t.radius, padding: '13px 15px', boxShadow: t.shadow, textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 13, WebkitTapHighlightColor: 'transparent',
      }}>
        <CardArt card={card} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: t.text }}>{card.name}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft, marginTop: 2 }}>
            {card.paid ? `Paid · ${fmtDate(card.due)}` : `${fmtDay(card.due)}, ${fmtDate(card.due)}`}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5, color: t.text }}>{money(card.paid ? card.statement : card.balance)}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: sc.fg, marginTop: 3 }}>
            {card.paid ? 'Paid' : d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : d < 0 ? `${Math.abs(d)}d late` : `in ${d}d`}
          </div>
        </div>
      </button>
    </div>
  );
}

export function RemindersScreen({ t, cards, onSelect, reminders, setReminders, tone, userName }) {
  const sorted   = [...cards].sort((a, b) => { if (a.paid !== b.paid) return a.paid ? 1 : -1; return a.due - b.due; });
  const upcoming = sorted.filter((c) => !c.paid);
  const done     = sorted.filter((c) =>  c.paid);

  const settings = [
    ['7 days before', '7d'],
    ['3 days before', '3d'],
    ["Day it's due",  'due'],
  ];

  return (
    <div style={{ padding: '6px 18px 0' }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: t.text, letterSpacing: 0.1 }}>Reminders</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.textSoft, marginTop: 2 }}>{upcoming.length} payments coming up</div>
      </div>

      {/* Notification preview */}
      <div style={{ position: 'relative', borderRadius: t.radius + 4, padding: '15px 16px', marginBottom: 24,
        background: t.dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)', border: `1px solid ${t.line}`, boxShadow: t.shadow,
        display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: t.accent, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Ic.bell width="20" height="20" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, color: t.text, whiteSpace: 'nowrap' }}>
              {upcoming[0] ? `${upcoming[0].name} payment` : 'CardKeep'}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: t.textFaint, flexShrink: 0 }}>now</span>
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, color: t.textSoft, marginTop: 3, lineHeight: 1.4 }}>
            {upcoming[0]
              ? (() => {
                  const card = upcoming[0];
                  const d = daysUntil(card.due);
                  const when = d === 0 ? 'today' : d === 1 ? 'tomorrow' : `on ${fmtDate(card.due)}`;
                  const name = userName ? userName.trim().split(' ')[0] : '';
                  if (tone === 'plain') {
                    return `${money(card.balance)} due ${when}.`;
                  }
                  return `${name ? `${name}, your ` : 'Your '}${money(card.balance)} is due ${when}. Stay on track! 💛`;
                })()
              : (userName ? `Nice work, ${userName.trim().split(' ')[0]}! No payments due.` : 'No payments due. Nice work!')}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <h2 style={{ margin: '0 4px 14px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text }}>Upcoming</h2>
      <div>
        {upcoming.map((c, i) => (
          <TimelineRow key={c.id} card={c} t={t} onSelect={onSelect} isLast={i === upcoming.length - 1} />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h2 style={{ margin: '24px 4px 14px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text }}>Recently paid</h2>
          <div>
            {done.map((c, i) => (
              <TimelineRow key={c.id} card={c} t={t} onSelect={onSelect} isLast={i === done.length - 1} />
            ))}
          </div>
        </>
      )}

      {/* Reminder settings */}
      <h2 style={{ margin: '26px 4px 14px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text }}>Notify me</h2>
      <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
        {settings.map((s, i) => (
          <div key={s[1]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < settings.length - 1 ? `1px solid ${t.line}` : 'none' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: t.text }}>{s[0]}</span>
            <ReminderToggle on={reminders[s[1]]} t={t} onToggle={() => setReminders({ ...reminders, [s[1]]: !reminders[s[1]] })} />
          </div>
        ))}
      </div>
    </div>
  );
}
