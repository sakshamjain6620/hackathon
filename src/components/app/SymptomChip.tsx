import React from "react";
import { cn } from "@/lib/utils";

interface SymptomChipProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SymptomChip({ label, icon, selected = false, onClick, className }: SymptomChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300",
        "border shadow-sm active:scale-95",
        selected
          ? "bg-primary text-white border-primary shadow-primary/20"
          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-primary/50",
        className
      )}
    >
      {icon && <span className={cn("text-lg", selected ? "text-white" : "text-primary")}>{icon}</span>}
      {label}
    </button>
  );
}
