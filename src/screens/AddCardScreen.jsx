import { useState } from 'react';
import { Ic } from '../icons';
import { GRAD_PRESETS, computeDueDate } from '../data';
import { CardArt } from '../components/CardArt';
import { Btn } from '../components/Btn';

const NETWORKS = ['VISA', 'MASTERCARD', 'AMEX'];

function Field({ label, t, children, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: t.textSoft, letterSpacing: 0.2 }}>{label}</div>
      {children}
      {error && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: t.danger }}>{error}</div>}
    </div>
  );
}

function Input({ value, onChange, t, placeholder, type = 'text', inputMode, prefix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', background: t.surface2, borderRadius: 14, border: `1px solid ${t.line}`, overflow: 'hidden' }}>
      {prefix && <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 17, color: t.textSoft, paddingLeft: 14 }}>{prefix}</span>}
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-ui)', fontSize: 16, color: t.text,
          padding: '13px 14px', width: '100%',
        }}
      />
    </div>
  );
}

function SegControl({ options, value, onChange, t }) {
  return (
    <div style={{ display: 'flex', background: t.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 3, gap: 2 }}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{
          flex: 1, border: 'none', borderRadius: 10, padding: '9px 4px',
          background: value === o ? t.surface : 'transparent',
          color: value === o ? t.text : t.textSoft,
          fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13,
          cursor: 'pointer', boxShadow: value === o ? t.shadow : 'none',
          transition: 'all .15s', WebkitTapHighlightColor: 'transparent',
        }}>{o}</button>
      ))}
    </div>
  );
}

function GradPicker({ value, onChange, t }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {GRAD_PRESETS.map((g, i) => {
        const active = g[0] === value[0];
        return (
          <button key={i} onClick={() => onChange(g)} style={{
            width: 52, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
            boxShadow: active ? `0 0 0 3px ${t.surface}, 0 0 0 5px ${t.accent}` : t.shadow,
            transition: 'box-shadow .15s', WebkitTapHighlightColor: 'transparent',
          }} />
        );
      })}
    </div>
  );
}

const EMPTY = {
  name: '', issuer: '', last4: '', network: 'VISA',
  grad: GRAD_PRESETS[0],
  balance: '', statement: '', min: '', limit: '', apr: '',
  dueDay: '',
};

export function AddCardScreen({ t, card, onSave, onDelete, onBack }) {
  const editing = !!card;
  const [f, setF] = useState(editing ? {
    name:     card.name,
    issuer:   card.issuer,
    last4:    card.last4,
    network:  card.network,
    grad:     card.grad,
    balance:  String(card.balance),
    statement:String(card.statement),
    min:      String(card.min),
    limit:    String(card.limit),
    apr:      String((card.apr * 100).toFixed(2)),
    dueDay:   String(card.dueDay),
  } : EMPTY);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (k) => (v) => setF((prev) => ({ ...prev, [k]: v }));

  const previewCard = {
    id: 'preview', name: f.name || 'Card name', issuer: f.issuer || 'Issuer',
    network: f.network, last4: f.last4 || '0000', grad: f.grad,
    balance: parseFloat(f.balance) || 0, statement: parseFloat(f.statement) || 0,
    min: parseFloat(f.min) || 0, limit: parseFloat(f.limit) || 0,
    apr: parseFloat(f.apr) / 100 || 0, due: new Date(), paid: false,
  };

  function validate() {
    const e = {};
    if (!f.name.trim()) e.name = 'Required';
    if (!f.balance && f.balance !== '0') e.balance = 'Required';
    if (!f.limit)   e.limit   = 'Required';
    if (!f.apr)     e.apr     = 'Required';
    if (!f.dueDay || parseInt(f.dueDay) < 1 || parseInt(f.dueDay) > 31) e.dueDay = '1–31';
    return e;
  }

  function save() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const dueDay = parseInt(f.dueDay);
    onSave({
      id:       card?.id || `card_${Date.now()}`,
      name:     f.name.trim(),
      issuer:   f.issuer.trim(),
      last4:    f.last4.slice(-4).padStart(4, '0'),
      network:  f.network,
      grad:     f.grad,
      balance:  parseFloat(f.balance) || 0,
      statement:parseFloat(f.statement || f.balance) || 0,
      min:      parseFloat(f.min) || 0,
      limit:    parseFloat(f.limit) || 0,
      apr:      parseFloat(f.apr) / 100,
      dueDay,
      due:      computeDueDate(dueDay),
      paid:     card?.paid ?? false,
    });
  }

  return (
    <div style={{ padding: '4px 18px 0' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: t.accent, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, padding: 0 }}>
          <Ic.back width="20" height="20" /> Cancel
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: t.text }}>
          {editing ? 'Edit card' : 'Add card'}
        </div>
        <button onClick={save} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: t.accent, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16, padding: 0 }}>
          Save
        </button>
      </div>

      {/* Live preview */}
      <div style={{ marginBottom: 22 }}>
        <CardArt card={previewCard} size="lg" />
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        <Field label="Card name" t={t} error={errors.name}>
          <Input value={f.name} onChange={set('name')} t={t} placeholder="e.g. Sapphire Reserve" />
        </Field>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Field label="Bank / issuer" t={t}>
              <Input value={f.issuer} onChange={set('issuer')} t={t} placeholder="Chase" />
            </Field>
          </div>
          <div style={{ flex: '0 0 100px' }}>
            <Field label="Last 4 digits" t={t}>
              <Input value={f.last4} onChange={(v) => set('last4')(v.replace(/\D/g, '').slice(0,4))} t={t} placeholder="1234" inputMode="numeric" />
            </Field>
          </div>
        </div>

        <Field label="Network" t={t}>
          <SegControl options={NETWORKS} value={f.network} onChange={set('network')} t={t} />
        </Field>

        <Field label="Card color" t={t}>
          <GradPicker value={f.grad} onChange={set('grad')} t={t} />
        </Field>

        <div style={{ height: 1, background: t.line }} />

        <Field label="Current balance" t={t} error={errors.balance}>
          <Input value={f.balance} onChange={set('balance')} t={t} placeholder="0.00" inputMode="decimal" prefix="$" />
        </Field>

        <Field label="Statement balance" t={t}>
          <Input value={f.statement} onChange={set('statement')} t={t} placeholder="Same as current balance" inputMode="decimal" prefix="$" />
        </Field>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Field label="Minimum payment" t={t}>
              <Input value={f.min} onChange={set('min')} t={t} placeholder="25.00" inputMode="decimal" prefix="$" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Credit limit" t={t} error={errors.limit}>
              <Input value={f.limit} onChange={set('limit')} t={t} placeholder="5000" inputMode="decimal" prefix="$" />
            </Field>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Field label="APR (%)" t={t} error={errors.apr}>
              <Input value={f.apr} onChange={set('apr')} t={t} placeholder="22.49" inputMode="decimal" />
            </Field>
          </div>
          <div style={{ flex: '0 0 110px' }}>
            <Field label="Due day" t={t} error={errors.dueDay}>
              <Input value={f.dueDay} onChange={(v) => set('dueDay')(v.replace(/\D/g, ''))} t={t} placeholder="7" inputMode="numeric" />
            </Field>
          </div>
        </div>

        <Btn t={t} full onClick={save}>
          {editing ? 'Save changes' : 'Add card'}
        </Btn>

        {editing && !confirmDelete && (
          <Btn t={t} variant="ghost" full onClick={() => setConfirmDelete(true)}
            style={{ color: t.danger }}>
            Delete card
          </Btn>
        )}

        {editing && confirmDelete && (
          <div style={{ background: t.dangerSoft, borderRadius: t.radius, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: t.danger, textAlign: 'center' }}>
              Delete {f.name || 'this card'}? This can't be undone.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn t={t} variant="soft" full onClick={() => setConfirmDelete(false)}>Cancel</Btn>
              <Btn t={t} full onClick={() => onDelete(card.id)} style={{ background: t.danger, color: '#fff', boxShadow: 'none' }}>Delete</Btn>
            </div>
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
