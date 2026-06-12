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
    primary: "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-blue-500/20 border-blue-400/50",
    secondary: "bg-gradient-to-br from-teal-400 to-emerald-400 text-white shadow-emerald-500/20 border-teal-400/50",
    accent: "bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-indigo-500/20 border-indigo-400/50",
    purple: "bg-gradient-to-br from-purple-400 to-fuchsia-500 text-white shadow-purple-500/20 border-purple-400/50",
    glass: "glass-card text-slate-800 dark:text-slate-100",
  };

  return (
    <div 
      className={cn(
        "rounded-[1.75rem] shadow-xl overflow-hidden border",
        variants[variant],
        noPadding ? "" : "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
