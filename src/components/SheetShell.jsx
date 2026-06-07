export function SheetShell({ t, children, onClose, title, compact }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', animation: 'fade .25s ease' }}
      />
      <div style={{
        position: 'relative', background: t.surface,
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        padding: '12px 22px 38px',
        animation: 'slideUp .32s cubic-bezier(.2,.9,.3,1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background: t.line, margin: '0 auto 16px' }} />
        {title
          ? <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, color: t.text, marginBottom: 18 }}>{title}</div>
          : null}
        {children}
      </div>
    </div>
  );
}
