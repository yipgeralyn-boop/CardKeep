// mascot.jsx — "Sprout", the app mascot. Accent-tinted, expression-driven.
// Depends on window: (none — pure). Exports: Mascot, MascotCheer
// mood: 'idle' | 'happy' | 'cheer'

function Mascot({ mood = 'idle', size = 120, t, style = {} }) {
  const accent = t.accent;
  const bodyDark = t.dark ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.10)';
  const belly = t.dark ? '#F4EFE2' : '#FFF8EC';
  const eye = '#2A2620';
  const cheek = 'rgba(236,106,94,0.5)';
  const leaf = t.good;
  const cheer = mood === 'cheer';
  const happy = mood === 'happy' || cheer;

  // eyes
  const Eyes = happy
    ? (
      <g>
        <path d="M74 110 q9 -13 18 0" stroke={eye} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M108 110 q9 -13 18 0" stroke={eye} strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    )
    : (
      <g>
        <circle cx="83" cy="110" r="7" fill={eye} />
        <circle cx="117" cy="110" r="7" fill={eye} />
        <circle cx="85.5" cy="107.5" r="2.4" fill="#fff" />
        <circle cx="119.5" cy="107.5" r="2.4" fill="#fff" />
      </g>
    );

  // mouth
  const Mouth = cheer
    ? <path d="M86 130 q14 20 28 0 q-14 6 -28 0 z" fill={eye} />
    : <path d="M88 128 q12 11 24 0" stroke={eye} strokeWidth="5.5" fill="none" strokeLinecap="round" />;

  // arms
  const Arms = cheer
    ? (
      <g>
        <path d="M40 96 q-12 -20 2 -34" stroke={accent} strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M160 96 q12 -20 -2 -34" stroke={accent} strokeWidth="15" fill="none" strokeLinecap="round" />
      </g>
    )
    : (
      <g>
        <ellipse cx="36" cy="126" rx="13" ry="17" fill={accent} transform="rotate(18 36 126)" />
        <ellipse cx="164" cy="126" rx="13" ry="17" fill={accent} transform="rotate(-18 164 126)" />
      </g>
    );

  const sparkle = (cx, cy, r, delay) => (
    <path d={`M${cx} ${cy - r} L${cx + r * 0.32} ${cy - r * 0.32} L${cx + r} ${cy} L${cx + r * 0.32} ${cy + r * 0.32} L${cx} ${cy + r} L${cx - r * 0.32} ${cy + r * 0.32} L${cx - r} ${cy} L${cx - r * 0.32} ${cy - r * 0.32} Z`}
      fill={t.warn} style={{ transformOrigin: `${cx}px ${cy}px`, animation: `sparklePop .5s ${delay}s ease both` }} />
  );

  return (
    <div style={{ width: size, height: size, display: 'inline-block', ...style,
      animation: cheer ? 'mascotBounce .7s cubic-bezier(.2,1.5,.45,1) both' : (mood === 'idle' ? 'mascotIdle 3.4s ease-in-out infinite' : 'none') }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* sprout leaves */}
        <g>
          <rect x="96.5" y="40" width="7" height="22" rx="3.5" fill={leaf} />
          <path d="M100 50 C98 34, 86 26, 72 26 C76 40, 86 50, 100 52 Z" fill={leaf} />
          <path d="M100 50 C102 36, 114 28, 128 29 C123 42, 113 50, 100 52 Z" fill={leaf} opacity="0.88" />
        </g>
        {Arms}
        {/* body */}
        <ellipse cx="100" cy="120" rx="68" ry="64" fill={accent} />
        <ellipse cx="100" cy="120" rx="68" ry="64" fill={bodyDark} opacity="0.0" />
        {/* belly */}
        <ellipse cx="100" cy="130" rx="45" ry="46" fill={belly} />
        {/* feet */}
        <ellipse cx="80" cy="180" rx="14" ry="9" fill={accent} />
        <ellipse cx="120" cy="180" rx="14" ry="9" fill={accent} />
        {/* cheeks */}
        <ellipse cx="70" cy="124" rx="8" ry="5.5" fill={cheek} />
        <ellipse cx="130" cy="124" rx="8" ry="5.5" fill={cheek} />
        {Eyes}
        {Mouth}
        {/* sparkles on cheer */}
        {cheer && (
          <g>
            {sparkle(38, 60, 11, 0.15)}
            {sparkle(166, 56, 9, 0.28)}
            {sparkle(150, 110, 7, 0.4)}
            {sparkle(54, 104, 6, 0.34)}
          </g>
        )}
      </svg>
    </div>
  );
}

Object.assign(window, { Mascot });
