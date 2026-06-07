import { Ic } from '../icons';
import { statusColor } from '../data';

export function StatusPill({ status, label, t }) {
  const { fg, bg } = statusColor(status, t);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, color: fg, fontFamily: 'var(--font-ui)',
      fontWeight: 600, fontSize: 12.5, padding: '4px 10px', borderRadius: 999,
      whiteSpace: 'nowrap',
    }}>
      {status === 'paid' && <Ic.check width="13" height="13" />}
      {label}
    </span>
  );
}
