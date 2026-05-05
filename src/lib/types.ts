export type KioskStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'OUT_OF_PAPER';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PrintStatus = 'WAITING_FOR_PAYMENT' | 'QUEUED' | 'PRINTING' | 'COMPLETED' | 'FAILED';
export type PaymentMethod = 'CASH' | 'BKASH' | 'NAGAD' | 'SSLCOMMERZ';

export interface Kiosk {
  id: string;
  deviceId: string;
  name: string;
  location?: string;
  status: KioskStatus;
  qrCodeUrl?: string;
  paperLevel: number;
  inkLevel: number;
  lastHeartbeat: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  kioskId: string;
  userId?: string;
  userEmail?: string;
  userPhone?: string;
  filePath?: string;
  fileUrl?: string;
  fileName?: string;
  pageCount?: number;
  copyCount: number;
  isColor: boolean;
  totalAmount?: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  printStatus: PrintStatus;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  createdAt: string;
}

// Mock user type for auth
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
}
