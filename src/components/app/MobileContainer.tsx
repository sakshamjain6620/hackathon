import React from "react";
import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  isDashboard?: boolean;
}

export function MobileContainer({ children, className, isDashboard = false }: MobileContainerProps) {
  // If it's a dashboard (Admin/Doctor), we don't wrap it in the mobile frame on desktop
  if (isDashboard) {
    return <div className={cn("w-full h-full", className)}>{children}</div>;
  }

  return (
    <div className="h-full w-full flex justify-center bg-slate-100/50 dark:bg-slate-900/50 sm:p-4 md:p-6 lg:p-8">
      <div 
        className={cn(
          "w-full h-full sm:max-w-md sm:max-h-[calc(100dvh-4rem)] bg-background relative overflow-hidden overflow-x-hidden max-w-[100vw]",
          "sm:border sm:border-slate-200 dark:sm:border-slate-800",
          "sm:rounded-[2.5rem] sm:shadow-2xl sm:shadow-slate-200/50 dark:sm:shadow-none",
          "flex flex-col mx-auto",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
