import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  status?: "online" | "offline" | "busy";
  className?: string;
}

export function ProfileAvatar({ src, name, size = "md", showStatus = false, status = "online", className }: ProfileAvatarProps) {
  const getInitials = (n: string) => {
    return n ? n.split(' ').map((word) => word[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-slate-400",
    busy: "bg-rose-500",
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className={cn("border-2 border-white dark:border-slate-800 shadow-sm", sizeClasses[size])}>
        <AvatarImage src={src} alt={name} className="object-cover" />
        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-800",
            statusColors[status],
            size === "sm" ? "h-2.5 w-2.5" : size === "xl" ? "h-6 w-6 border-[3px]" : "h-3.5 w-3.5"
          )} 
        />
      )}
    </div>
  );
}
