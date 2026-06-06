// app.jsx — main application: state, tab nav, screen transitions, tweaks
// Depends on window: everything from data/components/home/detail/reminders + tweaks-panel

const { useState, useRef, useEffect } = React;

const FONT_PAIRS = {
  grotesque: { display: "'Bricolage Grotesque', sans-serif", ui: "'Figtree', sans-serif", label: 'Grotesque' },
  geometric: { display: "'Space Grotesk', sans-serif", ui: "'DM Sans', sans-serif", label: 'Geometric' },
};

const REMINDER_COPY = {
  warm:  (c) => `Heads up — ${c.name} is due soon. A quick tap keeps you on track 💛`,
  plain: (c) => `${c.name} payment of ${money(c.balance)} is due ${fmtDate(c.due)}.`,
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#5B4FD6",
  "dark": false,
  "radius": 22,
  "font": "grotesque",
  "tone": "warm"
}/*EDITMODE-END*/;

// Tab bar ----------------------------------------------------------
function TabBar({ tab, setTab, t }) {
  const tabs = [
    ['home', 'Home', Ic.home],
    ['plan', 'Plan', Ic.chart],
    ['reminders', 'Reminders', Ic.bell],
    ['settings', 'Settings', Ic.gear],
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingBottom: 26, paddingTop: 10,
      background: t.dark
        ? 'linear-gradient(to top, ' + t.canvas + ' 55%, transparent)'
        : 'linear-gradient(to top, ' + t.canvas + ' 55%, transparent)',
    }}>
      <div style={{
        margin: '0 auto', width: 'fit-content', display: 'flex', gap: 4,
        background: t.surface, borderRadius: 999, padding: 6, boxShadow: t.shadow,
        border: `1px solid ${t.line}`,
      }}>
        {tabs.map(([id, label, Icon]) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer',
              background: active ? t.accent : 'transparent', color: active ? t.onAccent : t.textSoft,
              borderRadius: 999, padding: active ? '10px 18px' : '10px 14px',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13.5,
              transition: 'all .22s cubic-bezier(.2,.8,.2,1)', WebkitTapHighlightColor: 'transparent',
            }}>
              <Icon width="19" height="19" />
              {active && <span>{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SettingsScreen({ t, reminders }) {
  const rows = [
    ['Profile', [['Name', 'Alex Rivera'], ['Email', 'alex@hey.com'], ['Linked bank', 'Checking •••• 2291']]],
    ['Defaults', [['Default payment', 'Statement balance'], ['Autopay new cards', 'Off'], ['Currency', 'USD ($)']]],
  ];
  return (
    <div style={{ padding: '6px 18px 0' }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: t.text }}>Settings</div>
      </div>
      {/* profile card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: t.surface, borderRadius: t.radius, padding: '16px 18px', boxShadow: t.shadow, marginBottom: 22 }}>
        <div style={{ width: 54, height: 54, borderRadius: 999, background: t.accent, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>A</div>
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17, color: t.text }}>Alex Rivera</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, color: t.textSoft, marginTop: 1 }}>4 cards · all in good standing</div>
        </div>
      </div>
      {rows.map(([title, items]) => (
        <div key={title} style={{ marginBottom: 22 }}>
          <h2 style={{ margin: '0 4px 12px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: t.text }}>{title}</h2>
          <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
            {items.map((row, i) => (
              <div key={row[0]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < items.length - 1 ? `1px solid ${t.line}` : 'none' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, color: t.textSoft }}>{row[0]}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, fontWeight: 600, color: t.text }}>{row[1]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint, padding: '6px 0 8px' }}>Tap the ✨ Tweaks button to restyle this app</div>
    </div>
  );
}

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const t = makeTheme({ dark: tw.dark, accent: tw.accent, radius: tw.radius });
  const pair = FONT_PAIRS[tw.font] || FONT_PAIRS.grotesque;

  const [cards, setCards] = useState(CARDS);
  const [tab, setTab] = useState('home');
  const [selected, setSelected] = useState(null); // card id
  const [sheet, setSheet] = useState(null); // {type:'pay'|'paid', cardId, amount}
  const [monthly, setMonthly] = useState(450); // payoff plan monthly payment

  const selCard = cards.find((c) => c.id === selected);
  const sheetCard = sheet && cards.find((c) => c.id === sheet.cardId);

  const openPay = (card) => setSheet({ type: 'pay', cardId: card.id });
  const confirmPay = (amount) => {
    setCards((prev) => prev.map((c) => c.id === sheet.cardId
      ? { ...c, paid: true, balance: Math.max(0, c.balance - amount) } : c));
    setSheet({ type: 'paid', cardId: sheet.cardId, amount });
  };

  // scroll container ref — reset scroll on screen change
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tab, selected]);

  const showDetail = selCard && (tab === 'home' || tab === 'reminders');

  return (
    <div style={{
      '--font-display': pair.display, '--font-ui': pair.ui,
      width: '100%', height: '100%', position: 'relative', background: t.canvas,
      transition: 'background .3s',
    }}>
      {/* scrollable content */}
      <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 58, paddingBottom: 112 }}>
        {showDetail ? (
          <DetailScreen t={t} card={selCard} onBack={() => setSelected(null)} onPay={() => openPay(selCard)} />
        ) : tab === 'home' ? (
          <HomeScreen t={t} cards={cards} onSelect={(c) => setSelected(c.id)} onPay={openPay} onOpenPlan={() => setTab('plan')} />
        ) : tab === 'plan' ? (
          <PayoffScreen t={t} cards={cards} monthly={monthly} setMonthly={setMonthly} />
        ) : tab === 'reminders' ? (
          <RemindersScreen t={t} cards={cards} onSelect={(c) => setSelected(c.id)}
            reminders={reminders} setReminders={setReminders} tone={tw.tone} />
        ) : (
          <SettingsScreen t={t} reminders={reminders} />
        )}
      </div>

      {/* tab bar — hidden when a sheet is open or detail pushed */}
      {!showDetail && <TabBar tab={tab} setTab={(x) => { setSelected(null); setTab(x); }} t={t} />}

      {/* sheets */}
      {sheet?.type === 'pay' && sheetCard && (
        <PaySheet t={t} card={sheetCard} onClose={() => setSheet(null)} onConfirm={confirmPay} />
      )}
      {sheet?.type === 'paid' && sheetCard && (
        <PaidSheet t={t} card={sheetCard} amount={sheet.amount} onClose={() => { setSheet(null); setSelected(null); }} />
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakColor label="Accent" value={tw.accent}
          options={['#5B4FD6', '#2E8B6B', '#D9694A', '#2A6FDB', '#B5478F']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakToggle label="Dark mode" value={tw.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakSlider label="Corner roundness" value={tw.radius} min={8} max={30} unit="px"
          onChange={(v) => setTweak('radius', v)} />
        <TweakSection label="Typography" />
        <TweakRadio label="Font pairing" value={tw.font} options={['grotesque', 'geometric']}
          onChange={(v) => setTweak('font', v)} />
        <TweakSection label="Reminders" />
        <TweakRadio label="Copy tone" value={tw.tone} options={['warm', 'plain']}
          onChange={(v) => setTweak('tone', v)} />
      </TweaksPanel>
    </div>
  );
}

// reminders settings live at module scope via a tiny store so SettingsScreen + RemindersScreen share
let reminders = { '7d': true, '3d': true, 'due': true };
function setReminders(next) { reminders = next; window.__rerender && window.__rerender(); }

// Mount inside the iOS frame --------------------------------------
function Root() {
  const [, force] = useState(0);
  const [scale, setScale] = useState(1);
  useEffect(() => { window.__rerender = () => force((n) => n + 1); }, []);
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 36) / 874));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice>
          <App />
        </IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
