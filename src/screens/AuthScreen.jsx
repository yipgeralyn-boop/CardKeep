import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';
import { Mascot } from '../Mascot';

const INPUT_STYLE = {
  width: '100%', boxSizing: 'border-box', outline: 'none',
  background: 'rgba(255,255,255,0.10)', borderRadius: 14,
  padding: '14px 16px', fontFamily: 'var(--font-ui)', fontSize: 15.5,
  color: '#fff', WebkitTapHighlightColor: 'transparent',
  border: '1.5px solid rgba(255,255,255,0.15)',
};

const FIELD_LABEL = {
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
  color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5, marginBottom: 6, display: 'block',
};

const FIREBASE_ERRORS = {
  'auth/invalid-credential':    'Incorrect email or password.',
  'auth/user-not-found':        'No account with that email.',
  'auth/wrong-password':        'Incorrect password.',
  'auth/email-already-in-use':  'An account already exists with this email.',
  'auth/weak-password':         'Password must be at least 6 characters.',
  'auth/invalid-email':         'Please enter a valid email address.',
  'auth/too-many-requests':     'Too many attempts. Try again later.',
};

export function AuthScreen() {
  const [mode,     setMode]     = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [resetSent, setResetSent] = useState(false);

  const t = { accent: '#7B6FFF', good: '#2E9E6B', warn: '#E8A93D', dark: true, onAccent: '#fff' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
      } else if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #1C1640 0%, #2D1B69 50%, #1C1640 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 24px 32px', overflowY: 'auto',
    }}>
      <Mascot mood="happy" size={84} t={t} style={{ marginBottom: 12 }} />

      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 4 }}>
        CardKeep
      </div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 36, textAlign: 'center' }}>
        {mode === 'signin' ? 'Welcome back — sign in to continue' :
         mode === 'signup' ? 'Create your free account' :
         'Reset your password'}
      </div>

      {resetSent ? (
        <div style={{ width: '100%', background: 'rgba(46,158,107,0.2)', border: '1px solid rgba(46,158,107,0.4)', borderRadius: 14, padding: '16px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>📬</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>Check your inbox</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, color: 'rgba(255,255,255,0.65)' }}>We sent a reset link to {email}</div>
          <button onClick={() => { setMode('signin'); setResetSent(false); }} style={{ marginTop: 16, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-ui)', fontSize: 13.5, cursor: 'pointer' }}>
            Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={FIELD_LABEL}>EMAIL</label>
            <input
              type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ ...INPUT_STYLE, '::placeholder': { color: 'rgba(255,255,255,0.3)' } }}
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label style={FIELD_LABEL}>PASSWORD</label>
              <input
                type="password" required autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={INPUT_STYLE}
              />
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(220,60,60,0.18)', border: '1px solid rgba(220,60,60,0.35)', borderRadius: 12, padding: '10px 14px', fontFamily: 'var(--font-ui)', fontSize: 13.5, color: '#FF9090' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', border: 'none', borderRadius: 16, cursor: loading ? 'default' : 'pointer',
            background: loading ? 'rgba(123,111,255,0.5)' : 'linear-gradient(135deg, #7B6FFF, #5B4FD6)',
            color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
            padding: '15px 0', marginTop: 4,
            boxShadow: loading ? 'none' : '0 4px 20px rgba(91,79,214,0.5)',
            WebkitTapHighlightColor: 'transparent', transition: 'all .15s',
          }}>
            {loading ? '...' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
          </button>
        </form>
      )}

      {!resetSent && (
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {mode === 'signin' && (
            <>
              <button onClick={() => { setMode('signup'); setError(''); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13.5, color: 'rgba(255,255,255,0.55)', WebkitTapHighlightColor: 'transparent' }}>
                Don't have an account? <span style={{ color: '#A78BFA', fontWeight: 700 }}>Create one</span>
              </button>
              <button onClick={() => { setMode('reset'); setError(''); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,0.35)', WebkitTapHighlightColor: 'transparent' }}>
                Forgot password?
              </button>
            </>
          )}
          {mode !== 'signin' && (
            <button onClick={() => { setMode('signin'); setError(''); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13.5, color: 'rgba(255,255,255,0.55)', WebkitTapHighlightColor: 'transparent' }}>
              Already have an account? <span style={{ color: '#A78BFA', fontWeight: 700 }}>Sign in</span>
            </button>
          )}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 24, fontFamily: 'var(--font-ui)', fontSize: 11.5, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '0 24px' }}>
        Your card data is stored securely. No bank access required.
      </div>
    </div>
  );
}
