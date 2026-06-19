import { useState } from 'react';
import { Ic } from '../icons';
import { Btn } from '../components/Btn';

export function SettingsScreen({ t, userName, onNameChange, cards, onResetCycle, darkMode, onDarkToggle, isPro, onUpgrade, onRestore, userEmail, onSignOut }) {
  const [editing,   setEditing]   = useState(false);
  const [draft,     setDraft]     = useState('');
  const [resetting, setResetting] = useState(false);

  const initials = userName ? userName.trim().charAt(0).toUpperCase() : '?';
  const cardCount = cards.length;
  const paidCount = cards.filter((c) => c.paid).length;
  const statusLine = cardCount === 0
    ? 'No cards yet'
    : paidCount === cardCount
      ? `${cardCount} card${cardCount !== 1 ? 's' : ''} · all paid`
      : `${cardCount} card${cardCount !== 1 ? 's' : ''} · ${paidCount} paid`;

  const startEdit = () => {
    setDraft(userName);
    setEditing(true);
  };

  const saveName = () => {
    onNameChange(draft.trim());
    setEditing(false);
  };

  const handleReset = () => {
    onResetCycle();
    setResetting(false);
  };

  return (
    <div style={{ padding: '6px 18px 0' }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: t.text }}>Settings</div>
      </div>

      {/* Profile card */}
      <div style={{ background: t.surface, borderRadius: t.radius, padding: '16px 18px', boxShadow: t.shadow, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: editing ? 14 : 0 }}>
          <div style={{ width: 54, height: 54, borderRadius: 999, background: t.accent, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 1 }}>
              {userName || 'Your name'}
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textSoft, marginBottom: 1 }}>{userEmail}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint }}>{statusLine}</div>
          </div>
          {!editing && (
            <button onClick={startEdit} style={{ border: 'none', background: t.surface2, borderRadius: 10, padding: '7px 13px', cursor: 'pointer', color: t.accent, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13.5, WebkitTapHighlightColor: 'transparent' }}>
              Edit
            </button>
          )}
        </div>

        {editing && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.surface2, borderRadius: 12, padding: '11px 14px', border: `1.5px solid ${t.accent}`, marginBottom: 12 }}>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false); }}
                placeholder="Your name"
                style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, color: t.text }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn t={t} variant="soft" onClick={() => setEditing(false)} full>Cancel</Btn>
              <Btn t={t} onClick={saveName} full>Save</Btn>
            </div>
          </div>
        )}
      </div>

      {/* Appearance */}
      <h2 style={{ margin: '0 4px 12px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text }}>Appearance</h2>
      <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden', marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Ic.moon width="20" height="20" style={{ color: t.textSoft }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: t.text }}>Night mode</span>
          </div>
          <button onClick={() => onDarkToggle(!darkMode)} style={{
            width: 50, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 3,
            background: darkMode ? t.accent : (t.dark ? 'rgba(255,255,255,0.16)' : 'rgba(38,34,25,0.16)'),
            display: 'flex', justifyContent: darkMode ? 'flex-end' : 'flex-start',
            transition: 'all .2s', WebkitTapHighlightColor: 'transparent',
          }}>
            <span style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'all .2s' }} />
          </button>
        </div>
      </div>

      {/* Statement cycle */}
      <h2 style={{ margin: '0 4px 12px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: t.text }}>Statement cycle</h2>
      <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden', marginBottom: 22 }}>
        <div style={{ padding: '15px 18px' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: t.text, fontWeight: 600, marginBottom: 4 }}>New statement cycle</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, color: t.textSoft, lineHeight: 1.5, marginBottom: 14 }}>
            Resets all cards to unpaid and refreshes the due dates based on each card's billing day. Use this at the start of a new billing period.
          </div>
          {!resetting ? (
            <Btn t={t} variant="soft" onClick={() => setResetting(true)} full>
              <Ic.flag width="16" height="16" /> Reset all balances
            </Btn>
          ) : (
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: t.danger, marginBottom: 12, fontWeight: 600 }}>
                This will mark all cards as unpaid and restore their statement balances. Continue?
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn t={t} variant="soft" onClick={() => setResetting(false)} full>Cancel</Btn>
                <button onClick={handleReset} style={{
                  flex: 1, border: 'none', borderRadius: t.radius - 4, cursor: 'pointer',
                  background: t.danger, color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15,
                  padding: '12px 0', WebkitTapHighlightColor: 'transparent',
                }}>
                  Yes, reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Privacy note */}
      <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Ic.shield width="18" height="18" style={{ color: t.good, flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 3 }}>Your data stays on your device</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft, lineHeight: 1.5 }}>DueCard never connects to your bank or sends your information anywhere. Everything is stored locally on this device only.</div>
        </div>
      </div>

      {/* Pro status */}
      <div style={{ background: isPro ? `${t.accent}18` : t.surface, borderRadius: t.radius, boxShadow: t.shadow, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 2 }}>
            {isPro ? 'DueCard Pro ✨' : 'Free plan'}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: t.textSoft }}>
            {isPro ? 'Unlimited cards & all features' : '1 card included · upgrade for more'}
          </div>
        </div>
        {isPro ? (
          <button
            onClick={() => window.open('itms-apps://apps.apple.com/account/subscriptions', '_blank')}
            style={{ border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', background: t.surface2, color: t.textSoft, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 12.5, WebkitTapHighlightColor: 'transparent', flexShrink: 0 }}
          >
            Manage
          </button>
        ) : (
          <button onClick={onUpgrade} style={{ border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', background: t.accent, color: t.onAccent, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, WebkitTapHighlightColor: 'transparent', flexShrink: 0 }}>
            Upgrade
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint, padding: '6px 0 8px' }}>
        Tap ✨ below to restyle this app
      </div>

      {!isPro && onRestore && (
        <button onClick={onRestore} style={{ width: '100%', border: `1.5px solid ${t.line}`, borderRadius: t.radius, padding: '13px 0', cursor: 'pointer', background: 'transparent', color: t.textSoft, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, marginBottom: 8, WebkitTapHighlightColor: 'transparent' }}>
          Restore purchases
        </button>
      )}
      <button onClick={onSignOut} style={{ width: '100%', border: `1.5px solid ${t.danger}22`, borderRadius: t.radius, padding: '13px 0', cursor: 'pointer', background: 'transparent', color: t.danger, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, marginBottom: 8, WebkitTapHighlightColor: 'transparent' }}>
        Sign out
      </button>
    </div>
  );
}
