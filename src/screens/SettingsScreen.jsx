export function SettingsScreen({ t }) {
  const rows = [
    ['Profile',  [['Name', 'Alex Rivera'], ['Email', 'alex@hey.com'], ['Linked bank', 'Checking •••• 2291']]],
    ['Defaults', [['Default payment', 'Statement balance'], ['Autopay new cards', 'Off'], ['Currency', 'USD ($)']]],
  ];

  return (
    <div style={{ padding: '6px 18px 0' }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: t.text }}>Settings</div>
      </div>

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

      <div style={{ textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 12.5, color: t.textFaint, padding: '6px 0 8px' }}>
        Tap ✨ below to restyle this app
      </div>
    </div>
  );
}
