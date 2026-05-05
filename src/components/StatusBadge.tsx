'use client';

import type { KioskStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: KioskStatus;
  showLabel?: boolean;
}

const statusConfig: Record<KioskStatus, { label: string; bg: string; dot: string; text: string }> = {
  ONLINE:        { label: 'ONLINE',        bg: '#d4f0a0', dot: '#468432', text: '#1A2E0D' },
  OFFLINE:       { label: 'OFFLINE',       bg: '#fee2e2', dot: '#ef4444', text: '#991b1b' },
  MAINTENANCE:   { label: 'MAINTENANCE',   bg: '#FFEF91', dot: '#FFA02E', text: '#854d0e' },
  OUT_OF_PAPER:  { label: 'OUT OF PAPER',  bg: '#ffedd5', dot: '#f97316', text: '#9a3412' },
};

export default function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.OFFLINE;

  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
      style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.dot}20` }}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: cfg.dot }}
      />
      {showLabel && cfg.label}
    </span>
  );
}
