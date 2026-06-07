import { registerPlugin } from '@capacitor/core';

const WidgetBridge = registerPlugin('WidgetBridge', {
  web: {
    setWidgetData: async () => { /* no-op on web */ },
  },
});

// Call this whenever cards change — sends the next-due card to the widget
export async function syncWidget(cards) {
  const unpaid = cards.filter((c) => !c.paid).sort((a, b) => a.due - b.due);
  const next = unpaid[0] ?? cards[0];
  if (!next) return;

  const payload = {
    name:          next.name,
    balance:       next.balance,
    dueTimestamp:  next.due,    // already ms since epoch in your data model
    isPaid:        next.paid,
  };

  try {
    await WidgetBridge.setWidgetData({ json: JSON.stringify(payload) });
  } catch {
    // Silently ignore on web/simulator without the plugin
  }
}
