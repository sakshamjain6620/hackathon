import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "confirmed" | "pending" | "cancelled" | "paid" | "available" | "booked";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<StatusType, string> = {
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    paid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
    cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",
    available: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800/50",
    booked: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  };

  const labels: Record<StatusType, string> = {
    confirmed: "Confirmed",
    paid: "Paid",
    pending: "Pending",
    cancelled: "Cancelled",
    available: "Available",
    booked: "Booked",
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border", styles[status], className)}>
      {labels[status]}
    </span>
  );
}
