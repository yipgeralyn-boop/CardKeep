import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';

const RC_API_KEY = 'appl_nwENsRKiDvpcphdliqbOuabzVBw';
const isNative = () => !!(window.Capacitor?.isNativePlatform?.());

export async function initPurchases(userId) {
  if (!isNative()) return;
  await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
  await Purchases.configure({ apiKey: RC_API_KEY, appUserID: userId });
}

export async function checkProStatus() {
  if (!isNative()) return false;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch { return false; }
}

export async function purchasePlan(plan) {
  if (!isNative()) return false;
  try {
    const { offerings } = await Purchases.getOfferings();
    const pkg = plan === 'yearly'
      ? offerings.current?.annual
      : offerings.current?.monthly;
    if (!pkg) return false;
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch (e) {
    if (e.code !== 'PURCHASE_CANCELLED') throw e;
    return false;
  }
}

export async function restorePurchases() {
  if (!isNative()) return false;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch { return false; }
}
