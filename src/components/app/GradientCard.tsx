import React from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "purple" | "glass";
  noPadding?: boolean;
}

export function GradientCard({ 
  children, 
  className, 
  variant = "glass",
  noPadding = false 
}: GradientCardProps) {
  
  const variants = {
    primary: "bg-gradient-to-br from-teal-500/10 to-emerald-500/5 text-slate-800 dark:text-slate-100 border-teal-500/20 shadow-sm",
    secondary: "bg-gradient-to-br from-blue-500/10 to-indigo-500/5 text-slate-800 dark:text-slate-100 border-blue-500/20 shadow-sm",
    accent: "bg-gradient-to-br from-indigo-500/10 to-purple-500/5 text-slate-800 dark:text-slate-100 border-indigo-500/20 shadow-sm",
    purple: "bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 text-slate-800 dark:text-slate-100 border-purple-500/20 shadow-sm",
    glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100/80 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-100",
  };

  return (
    <div 
      className={cn(
        "rounded-2xl shadow-sm overflow-hidden border",
        variants[variant],
        noPadding ? "" : "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
