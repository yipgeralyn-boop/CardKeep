// Design tokens, mock card data, helpers, payoff math

// ─── Theme builder ─────────────────────────────────────────────
export function makeTheme({ dark = false, accent = '#5B4FD6', radius = 22 } = {}) {
  if (dark) {
    return {
      accent,
      canvas: '#15140F', surface: '#211F18', surface2: '#2B281F',
      text: '#F4F1E9', textSoft: '#B7B0A2', textFaint: '#7C766A',
      line: 'rgba(255,255,255,0.08)',
      good: '#46B583', goodSoft: 'rgba(70,181,131,0.16)',
      warn: '#E8A93D', warnSoft: 'rgba(232,169,61,0.16)',
      danger: '#EC6A5E', dangerSoft: 'rgba(236,106,94,0.16)',
      onAccent: '#FFFFFF',
      shadow: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
      radius, dark: true,
    };
  }
  return {
    accent,
    canvas: '#F4F1EA', surface: '#FFFFFF', surface2: '#FBF9F4',
    text: '#262219', textSoft: '#7E776A', textFaint: '#A8A192',
    line: 'rgba(38,34,25,0.08)',
    good: '#2E9E6B', goodSoft: 'rgba(46,158,107,0.12)',
    warn: '#D98C2B', warnSoft: 'rgba(217,140,43,0.13)',
    danger: '#DD5A4D', dangerSoft: 'rgba(221,90,77,0.12)',
    onAccent: '#FFFFFF',
    shadow: '0 1px 2px rgba(38,34,25,0.05), 0 10px 30px rgba(38,34,25,0.08)',
    radius, dark: false,
  };
}

// ─── Mock data — "today" is Thu Jun 4, 2026 ───────────────────
export const TODAY = new Date(2026, 5, 4);

export const CARDS = [
  {
    id: 'sapphire',
    name: 'Sapphire Reserve',
    issuer: 'Chase', network: 'VISA', last4: '4021',
    grad: ['#3D4E8C', '#26408B'],
    balance: 1284.50, statement: 1284.50, min: 35, limit: 12000, apr: 0.2249,
    due: new Date(2026, 5, 7), paid: false, autopay: false,
  },
  {
    id: 'everyday',
    name: 'Everyday Cash',
    issuer: 'Citi', network: 'MASTERCARD', last4: '8830',
    grad: ['#C26B3A', '#A04A2B'],
    balance: 642.18, statement: 642.18, min: 25, limit: 6000, apr: 0.1999,
    due: new Date(2026, 5, 13), paid: false, autopay: false,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    issuer: 'Amex', network: 'AMEX', last4: '1007',
    grad: ['#5A5F66', '#33373D'],
    balance: 3950.00, statement: 3950.00, min: 120, limit: 20000, apr: 0.2624,
    due: new Date(2026, 5, 20), paid: false, autopay: true,
  },
  {
    id: 'freedom',
    name: 'Freedom Flex',
    issuer: 'Chase', network: 'VISA', last4: '5567',
    grad: ['#2E8B6B', '#1F6E54'],
    balance: 0, statement: 318.40, min: 25, limit: 8000, apr: 0.2174,
    due: new Date(2026, 5, 28), paid: true, autopay: false,
  },
];

// ─── Helpers ───────────────────────────────────────────────────
export const money = (n, cents = true) =>
  '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

export const daysUntil = (d) => Math.round((d - TODAY) / 86400000);

export const fmtDate = (d) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const fmtDay = (d) =>
  d.toLocaleDateString('en-US', { weekday: 'long' });

export function cardStatus(card) {
  if (card.paid) return 'paid';
  const d = daysUntil(card.due);
  if (d < 0) return 'overdue';
  if (d <= 4) return 'soon';
  return 'upcoming';
}

export function statusColor(status, t) {
  if (status === 'paid') return { fg: t.good, bg: t.goodSoft };
  if (status === 'overdue') return { fg: t.danger, bg: t.dangerSoft };
  if (status === 'soon') return { fg: t.warn, bg: t.warnSoft };
  return { fg: t.textSoft, bg: t.dark ? 'rgba(255,255,255,0.06)' : 'rgba(38,34,25,0.05)' };
}

export function dueLabel(card) {
  if (card.paid) return 'Paid';
  const d = daysUntil(card.due);
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  return `Due in ${d} days`;
}

// ─── Payoff analysis (avalanche — highest APR first) ──────────
export function blendedApr(cards) {
  const debts = cards.filter((c) => c.balance > 0);
  const total = debts.reduce((s, c) => s + c.balance, 0);
  if (!total) return 0;
  return debts.reduce((s, c) => s + c.balance * c.apr, 0) / total;
}

export function simulatePayoff(cards, monthly) {
  let debts = cards
    .filter((c) => c.balance > 0)
    .map((c) => ({ id: c.id, balance: c.balance, apr: c.apr, min: c.min }));
  const start = debts.reduce((s, d) => s + d.balance, 0);
  const series = [start];
  let months = 0, interest = 0;
  const minSum = debts.reduce((s, d) => s + d.min, 0);
  if (start <= 0) return { months: 0, interest: 0, series: [0], payoffDate: TODAY, stalled: false };
  if (monthly < minSum + 1) return { months: Infinity, interest: Infinity, series, payoffDate: null, stalled: true };

  while (debts.some((d) => d.balance > 0.005) && months < 600) {
    debts.forEach((d) => { const i = d.balance * d.apr / 12; d.balance += i; interest += i; });
    let budget = monthly;
    debts.forEach((d) => { const pay = Math.min(d.balance, d.min); d.balance -= pay; budget -= pay; });
    debts.sort((a, b) => b.apr - a.apr);
    for (const d of debts) {
      if (budget <= 0) break;
      const pay = Math.min(d.balance, budget);
      d.balance -= pay; budget -= pay;
    }
    months++;
    series.push(Math.max(0, debts.reduce((s, d) => s + d.balance, 0)));
  }
  const payoffDate = new Date(TODAY.getFullYear(), TODAY.getMonth() + months, TODAY.getDate());
  return { months, interest, series, payoffDate, stalled: false };
}

export function recommendedPayment(cards, targetMonths = 12) {
  const total = cards.reduce((s, c) => s + c.balance, 0);
  if (total <= 0) return 0;
  const r = blendedApr(cards) / 12;
  const P = r === 0 ? total / targetMonths
    : total * r / (1 - Math.pow(1 + r, -targetMonths));
  return Math.ceil(P / 10) * 10;
}

export function fmtMonthYear(d) {
  return d ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—';
}

export function fmtMonths(n) {
  if (!isFinite(n)) return 'Never';
  if (n === 0) return 'Now';
  const y = Math.floor(n / 12), m = n % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}
