// API base URL - points to the NestJS backend
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Kiosk ──────────────────────────────────────────────────────────────
export async function getAllKiosks() {
  const res = await fetch(`${API_BASE}/v1/kiosk/all`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch kiosks');
  return res.json();
}

export async function getKiosk(deviceId: string) {
  const res = await fetch(`${API_BASE}/v1/kiosk/${deviceId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch kiosk');
  return res.json();
}

// ── Order ──────────────────────────────────────────────────────────────
export async function getAllOrders() {
  const res = await fetch(`${API_BASE}/v1/order`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function getOrder(id: string) {
  const res = await fetch(`${API_BASE}/v1/order/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
}

export async function createOrder(formData: FormData) {
  const res = await fetch(`${API_BASE}/v1/order/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || 'Failed to create order');
  }
  return res.json();
}

// ── Payments ──────────────────────────────────────────────────────────
export async function initPayment(orderId: string) {
  const res = await fetch(`${API_BASE}/v1/payments/init/${orderId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to initialize payment');
  return res.json();
}

export async function getAllPayments() {
  const res = await fetch(`${API_BASE}/v1/payments`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
}
