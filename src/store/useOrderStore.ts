import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PaymentMethod } from '@/lib/types';

interface OrderState {
  orderId: string | null;
  kioskId: string | null;
  kioskDeviceId: string | null;
  fileName: string | null;
  pageCount: number;
  copyCount: number;
  isColor: boolean;
  totalAmount: number;
  userEmail: string;
  userPhone: string;
  paymentMethod: PaymentMethod | null;

  setOrderId: (id: string) => void;
  setKioskId: (id: string) => void;
  setKioskDeviceId: (id: string) => void;
  setFileInfo: (fileName: string, pageCount: number) => void;
  setSettings: (copyCount: number, isColor: boolean) => void;
  setTotalAmount: (amount: number) => void;
  setUserContact: (email: string, phone: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  reset: () => void;
}

const initial = {
  orderId: null,
  kioskId: null,
  kioskDeviceId: null,
  fileName: null,
  pageCount: 1,
  copyCount: 1,
  isColor: false,
  totalAmount: 0,
  userEmail: '',
  userPhone: '',
  paymentMethod: null,
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      ...initial,
      setOrderId: (orderId) => set({ orderId }),
      setKioskId: (kioskId) => set({ kioskId }),
      setKioskDeviceId: (kioskDeviceId) => set({ kioskDeviceId }),
      setFileInfo: (fileName, pageCount) => set({ fileName, pageCount }),
      setSettings: (copyCount, isColor) => set({ copyCount, isColor }),
      setTotalAmount: (totalAmount) => set({ totalAmount }),
      setUserContact: (userEmail, userPhone) => set({ userEmail, userPhone }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      reset: () => set(initial),
    }),
    { name: 'print-order-store' }
  )
);
