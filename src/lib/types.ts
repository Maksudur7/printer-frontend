// ─── Kiosk ───────────────────────────────────────────────
export type KioskStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'OUT_OF_PAPER';

export interface Kiosk {
  id: string;
  deviceId: string;
  name: string;
  location?: string;
  status: KioskStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Order ───────────────────────────────────────────────
export type PrintStatus =
  | 'WAITING_FOR_PAYMENT'
  | 'QUEUED'
  | 'PRINTING'
  | 'COMPLETED'
  | 'FAILED';

export interface Order {
  id: string;
  kioskId: string;
  fileName: string;
  pageCount: number;
  copyCount: number;
  isColor: boolean;
  userEmail: string;
  userPhone: string;
  totalAmount: number;
  printStatus: PrintStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ─────────────────────────────────────────────
export type PaymentMethod = 'CASH' | 'BKASH' | 'NAGAD' | 'STRIPE' | 'SSLCOMMERZ';

export interface PaymentInitiateResponse {
  paymentUrl: string;
  message?: string;
}

// ─── API Error ───────────────────────────────────────────
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
}
