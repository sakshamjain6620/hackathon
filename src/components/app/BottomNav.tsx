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
        <div className="backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[2.5rem] px-3 py-2.5 flex items-center justify-between mx-auto max-w-sm relative">
            {navItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-[3.5rem] h-[3.5rem] rounded-[1.25rem] transition-all duration-300 gap-1 z-10",
                            isActive 
                                ? "text-indigo-600 bg-indigo-50/80 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm shadow-indigo-100 dark:shadow-none" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                    >
                        <item.icon className={cn(
                            "h-5 w-5 transition-all duration-300", 
                            isActive ? "stroke-[2.5px] scale-110" : "stroke-[1.5px]"
                        )} />
                        <span className={cn(
                            "text-[9px] tracking-tight transition-all duration-200",
                            isActive ? "font-bold opacity-100" : "font-medium opacity-80"
                        )}>
                            {item.name}
                        </span>
                        {isActive && (
                            <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-in zoom-in" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

