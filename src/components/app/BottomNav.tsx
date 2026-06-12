'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Calendar, FolderHeart, Pill, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/app/home', icon: Home },
        { name: 'Chat', path: '/app/chat', icon: MessageSquare },
        { name: 'Visits', path: '/app/appointments', icon: Calendar },
        { name: 'Records', path: '/app/records', icon: FolderHeart },
        { name: 'Rx', path: '/app/medicines', icon: Pill },
        { name: 'Profile', path: '/app/profile', icon: User },
    ];

    return (
        <div className="glass-card rounded-[2rem] px-3 py-2 flex items-center justify-between shadow-xl shadow-blue-900/5 dark:shadow-none border border-white/40 dark:border-white/10 mx-2">
            {navItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-[3.25rem] h-[3.25rem] rounded-2xl transition-all duration-300",
                            isActive 
                                ? "text-primary bg-primary/10" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        <item.icon className={cn(
                            "h-[1.125rem] w-[1.125rem] mb-1 transition-all duration-300", 
                            isActive ? "stroke-[2.5px] scale-110" : "stroke-2"
                        )} />
                        <span className={cn(
                            "text-[9px] tracking-tight transition-all duration-200",
                            isActive ? "font-semibold opacity-100" : "font-medium opacity-80"
                        )}>
                            {item.name}
                        </span>
                        {isActive && (
                            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-in zoom-in" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

