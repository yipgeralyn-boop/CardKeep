import { useEffect, useState } from 'react';

const COLORS = ['#5B4FD6', '#E8A93D', '#46B583', '#EC6A5E', '#2A6FDB', '#F7C948', '#B5478F', '#52C88A'];

export function Confetti({ active, onDone }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;
    const p = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      x: Math.random() * 100,
      delay: Math.random() * 0.9,
      duration: 1.6 + Math.random() * 1.2,
      size: 7 + Math.random() * 9,
      aspect: 0.4 + Math.random() * 0.6,
      spin: (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 400),
    }));
    setPieces(p);
    const t = setTimeout(() => { setPieces([]); onDone?.(); }, 3200);
    return () => clearTimeout(t);
  }, [active]);

  if (!pieces.length) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 200 }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: -16,
          width: p.size,
          height: p.size * p.aspect,
          background: p.color,
          borderRadius: 2,
          animation: `confettiFall ${p.duration}s ${p.delay}s cubic-bezier(.25,.46,.45,.94) forwards`,
          '--spin': `${p.spin}deg`,
        }} />
      ))}
    </div>
  );
}
