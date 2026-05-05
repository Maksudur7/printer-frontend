'use client';

import type { KioskStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: KioskStatus;
  showLabel?: boolean;
}

const statusConfig: Record<KioskStatus, { label: string; bg: string; dot: string; text: string }> = {
  ONLINE:        { label: 'Online',        bg: '#dcfce7', dot: '#22c55e', text: '#166534' },
  OFFLINE:       { label: 'Offline',       bg: '#fee2e2', dot: '#ef4444', text: '#991b1b' },
  MAINTENANCE:   { label: 'Maintenance',   bg: '#fef9c3', dot: '#eab308', text: '#854d0e' },
  OUT_OF_PAPER:  { label: 'Out of Paper',  bg: '#ffedd5', dot: '#f97316', text: '#9a3412' },
};

export default function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.OFFLINE;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: cfg.dot }}
      />
      {showLabel && cfg.label}
    </span>
  );
}
