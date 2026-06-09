import { useState, useRef, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot }            from 'firebase/firestore';
import { auth, db } from './firebase';
import { syncWidget } from './plugins/widgetBridge';
import { makeTheme, serializeCard, deserializeCard, computeDueDate } from './data';
import { Ic } from './icons';
import { IOSDevice } from './IOSDevice';
import {
  useTweaks, TweaksPanel, TweakSection, TweakColor,
  TweakToggle, TweakSlider, TweakRadio,
} from './TweaksPanel';
import { Confetti }        from './components/Confetti';
import { UpgradeSheet }    from './components/UpgradeSheet';
import { HomeScreen }      from './screens/HomeScreen';
import { AddCardScreen }   from './screens/AddCardScreen';
import { DetailScreen }    from './screens/DetailScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { PayoffScreen }    from './screens/PayoffScreen';
import { SettingsScreen }  from './screens/SettingsScreen';
import { AuthScreen }      from './screens/AuthScreen';

const FONT_PAIRS = {
  grotesque: { display: "'Bricolage Grotesque', sans-serif", ui: "'Figtree', sans-serif" },
  geometric:  { display: "'Space Grotesk', sans-serif",      ui: "'DM Sans', sans-serif"  },
};

const TWEAK_DEFAULTS = {
  accent: '#5B4FD6', dark: false, radius: 22, font: 'grotesque', tone: 'warm',
};

const FREE_CARD_LIMIT = 1;

// ── Tab bar ──────────────────────────────────────────────────────
function TabBar({ tab, setTab, t }) {
  const tabs = [
    ['home',      'Home',      Ic.home],
    ['plan',      'Plan',      Ic.chart],
    ['reminders', 'Reminders', Ic.bell],
    ['settings',  'Settings',  Ic.gear],
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingBottom: 26, paddingTop: 10,
      background: `linear-gradient(to top, ${t.canvas} 55%, transparent)`,
    }}>
      <div style={{
        margin: '0 auto', width: 'fit-content', display: 'flex', gap: 4,
        background: t.surface, borderRadius: 999, padding: 6,
        boxShadow: t.shadow, border: `1px solid ${t.line}`,
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

// ── Main app — scoped to a single authenticated user ──────────────
// Re-mounts from scratch when uid changes, so every account starts clean.
function MainApp({ uid, userEmail }) {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const t    = makeTheme({ dark: tw.dark, accent: tw.accent, radius: tw.radius });
  const pair = FONT_PAIRS[tw.font] || FONT_PAIRS.grotesque;

  // All localStorage keys are scoped to this user's uid
  const key = (name) => `${name}_${uid}`;

  const [cards, setCards] = useState(() => {
    try {
      const raw = localStorage.getItem(key('duecard_cards'));
      return raw ? JSON.parse(raw).map(deserializeCard) : [];
    } catch { return []; }
  });

  const [userName, setUserName] = useState(() =>
    localStorage.getItem(key('duecard_name')) || ''
  );

  const [isPro,        setIsPro]        = useState(false);
  const [tab,          setTab]          = useState('home');
  const [selected,     setSelected]     = useState(null);
  const [monthly,      setMonthly]      = useState(450);
  const [reminders,    setReminders]    = useState({ '7d': true, '3d': true, due: true });
  const [addingCard,   setAddingCard]   = useState(false);
  const [editingCard,  setEditingCard]  = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUpgrade,  setShowUpgrade]  = useState(false);

  const saveCards = (next) => {
    setCards(next);
    localStorage.setItem(key('duecard_cards'), JSON.stringify(next.map(serializeCard)));
    syncWidget(next);
  };

  const saveName = (name) => {
    setUserName(name);
    localStorage.setItem(key('duecard_name'), name);
  };

  const selCard = cards.find((c) => c.id === selected);

  const newStatement = (id, amount) => {
    saveCards(cards.map((c) => c.id !== id ? c : { ...c, statement: amount, balance: amount, paid: false, due: computeDueDate(c.dueDay) }));
  };

  const logPayment = (id, amount) => {
    let justCleared = false;
    saveCards(cards.map((c) => {
      if (c.id !== id) return c;
      if (amount === 0) return { ...c, paid: false, balance: c.statement };
      const remaining = Math.max(0, c.balance - amount);
      if (remaining === 0) justCleared = true;
      return { ...c, balance: remaining, paid: remaining === 0 };
    }));
    if (justCleared) setShowConfetti(true);
  };

  const resetCycle = () => {
    saveCards(cards.map((c) => ({ ...c, paid: false, balance: c.statement, due: computeDueDate(c.dueDay) })));
  };

  const handleAddCard = () => {
    if (!isPro && cards.length >= FREE_CARD_LIMIT) {
      setShowUpgrade(true);
    } else {
      setAddingCard(true);
    }
  };

  const handlePurchase = () => {
    // Purchase is processed natively via RevenueCat in the iOS app.
    // A Cloud Function will set isPro=true in Firestore upon successful payment.
    // The onSnapshot listener above will pick it up automatically.
    setShowUpgrade(false);
  };

  const handleSaveCard = (card) => {
    if (editingCard) {
      saveCards(cards.map((c) => c.id === card.id ? card : c));
      setEditingCard(null);
      setSelected(card.id);
    } else {
      saveCards([...cards, card]);
      setAddingCard(false);
      setSelected(card.id);
    }
  };

  const handleDeleteCard = (id) => {
    saveCards(cards.filter((c) => c.id !== id));
    setEditingCard(null);
    setSelected(null);
  };

  // Subscribe to Pro status from Firestore — cannot be spoofed via DevTools
  useEffect(() => {
    const ref = doc(db, 'users', uid);
    return onSnapshot(ref, (snap) => {
      setIsPro(snap.exists() && snap.data()?.isPro === true);
    }, () => setIsPro(false)); // default to free on any error
  }, [uid]);

  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tab, selected]);

  const showDetail  = selCard && !editingCard && (tab === 'home' || tab === 'reminders');
  const showAddEdit = addingCard || editingCard;

  return (
    <div style={{
      '--font-display': pair.display, '--font-ui': pair.ui,
      width: '100%', height: '100%', position: 'relative', background: t.canvas,
      transition: 'background .3s',
    }}>
      <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 58, paddingBottom: 112 }}>
        {showAddEdit ? (
          <AddCardScreen t={t} card={editingCard} onSave={handleSaveCard}
            onDelete={handleDeleteCard} onBack={() => { setAddingCard(false); setEditingCard(null); }} />
        ) : showDetail ? (
          <DetailScreen t={t} card={selCard} onBack={() => setSelected(null)}
            onLogPayment={(amt) => logPayment(selCard.id, amt)}
            onNewStatement={(amt) => newStatement(selCard.id, amt)}
            onEdit={() => setEditingCard(selCard)} />
        ) : tab === 'home' ? (
          <HomeScreen t={t} cards={cards} userName={userName} onSelect={(c) => setSelected(c.id)}
            onOpenPlan={() => setTab('plan')} onAddCard={handleAddCard}
            isPro={isPro} freeLimit={FREE_CARD_LIMIT} onUpgrade={() => setShowUpgrade(true)} />
        ) : tab === 'plan' ? (
          <PayoffScreen t={t} cards={cards} monthly={monthly} setMonthly={setMonthly} />
        ) : tab === 'reminders' ? (
          <RemindersScreen t={t} cards={cards} onSelect={(c) => setSelected(c.id)}
            reminders={reminders} setReminders={setReminders} tone={tw.tone} userName={userName} />
        ) : (
          <SettingsScreen t={t} userName={userName} onNameChange={saveName}
            cards={cards} onResetCycle={resetCycle}
            darkMode={tw.dark} onDarkToggle={(v) => setTweak('dark', v)}
            isPro={isPro} onUpgrade={() => setShowUpgrade(true)}
            userEmail={userEmail} onSignOut={() => signOut(auth)} />
        )}
      </div>

      {!showDetail && !showAddEdit && <TabBar tab={tab} setTab={(x) => { setSelected(null); setTab(x); }} t={t} />}

      {showUpgrade && (
        <UpgradeSheet t={t} onClose={() => setShowUpgrade(false)} onPurchase={handlePurchase} />
      )}

      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
      {showConfetti && (
        <div style={{
          position: 'absolute', top: 70, left: 0, right: 0, zIndex: 201,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
          animation: 'pop .35s cubic-bezier(.2,.8,.2,1) both',
        }}>
          <div style={{
            background: t.surface, borderRadius: 999, padding: '10px 20px',
            boxShadow: t.shadow, display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: t.text,
          }}>
            🎉 Card cleared — great work!
          </div>
        </div>
      )}

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

// ── Auth shell — resolves user then mounts MainApp ────────────────
function App() {
  const [tw]       = useTweaks(TWEAK_DEFAULTS);
  const pair       = FONT_PAIRS[tw.font] || FONT_PAIRS.grotesque;
  const [authUser, setAuthUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, (u) => setAuthUser(u ?? null)), []);

  if (authUser === undefined) return (
    <div style={{ width: '100%', height: '100%', background: '#1C1640', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: 999, border: '3px solid rgba(123,111,255,0.3)', borderTopColor: '#7B6FFF', animation: 'spin .8s linear infinite' }} />
    </div>
  );

  if (!authUser) return (
    <div style={{ '--font-display': pair.display, '--font-ui': pair.ui, width: '100%', height: '100%', position: 'relative' }}>
      <AuthScreen />
    </div>
  );

  // key={authUser.uid} forces a full remount when account switches — fresh state, fresh localStorage reads
  return <MainApp key={authUser.uid} uid={authUser.uid} userEmail={authUser.email} />;
}

// ── Root: scale phone to viewport ────────────────────────────────
export default function Root() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 36) / 874));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, boxSizing: 'border-box', overflow: 'hidden', background: '#E9E5DC' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice>
          <App />
        </IOSDevice>
      </div>
      <button onClick={() => window.postMessage({ type: '__activate_edit_mode' }, '*')} style={{
        position: 'fixed', bottom: 20, right: 20,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
        border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 999,
        padding: '10px 16px', cursor: 'pointer',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: 13, fontWeight: 600, color: '#29261b',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', gap: 6, zIndex: 9999,
      }}>✨ Tweaks</button>
    </div>
  );
}
