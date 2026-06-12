'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Bell, User as UserIcon, Search, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function AppHeader() {
    const { user, logout } = useAppStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    function getInitials(name?: string) {
      if (!name) return "A";
      return name
        .trim()
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    // Determine context
    const bottomNavRoutes = ['/app/home', '/app/chat', '/app/appointments', '/app/records', '/app/medicines', '/app/profile', '/app'];
    const isRootNode = bottomNavRoutes.some(route => pathname === route || pathname === '/app');
    const isHome = pathname === '/app/home' || pathname === '/app';
    const showBack = !isRootNode;

    const getPageTitle = () => {
        if (pathname.includes('/chat')) return 'AI Assistant';
        if (pathname.includes('/appointments')) return 'Appointments';
        if (pathname.includes('/records')) return 'My Records';
        if (pathname.includes('/medicines')) return 'My Medicines';
        if (pathname.includes('/profile')) return 'Profile';
        return '';
    };

    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-b-0 shadow-sm h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shrink-0">
            {isHome ? (
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500">Hello,</span>
                    <h1 className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                        {user?.name || 'Saksham'}!
                    </h1>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    {showBack && (
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <h1 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                        {getPageTitle()}
                    </h1>
                </div>
            )}
            
            <div className="flex items-center gap-3">
                {isHome && (
                    <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-primary transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800"></span>
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger className="relative h-10 w-10 flex-shrink-0 rounded-full select-none cursor-pointer p-0 overflow-hidden outline-none ring-2 ring-transparent hover:ring-primary/30 transition-all shadow-sm">
                        <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-white dark:border-slate-800 bg-white overflow-hidden rounded-full">
                            <AvatarImage src="https://i.pravatar.cc/150?u=saksham" className="object-cover h-10 w-10 rounded-full" />
                             <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-semibold h-10 w-10 flex items-center justify-center rounded-full">
                                 {getInitials('S')}
                             </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl rounded-2xl border-slate-100 dark:border-slate-800 p-2">
                        <DropdownMenuLabel className="font-normal p-2">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-semibold leading-none">{user?.name || 'Saksham'}</p>
                                <p className="text-xs leading-none text-slate-500 mt-1">{user?.email || 'patient@swasthsetu.com'}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                        <DropdownMenuItem className="cursor-pointer rounded-xl p-0">
                            <Link href="/app/profile" className="w-full flex items-center py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <UserIcon className="mr-3 h-4 w-4 text-slate-500" />
                                <span className="font-medium text-slate-700 dark:text-slate-300">My Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20 py-2.5 px-3 rounded-xl mt-1 transition-colors">
                            <span className="font-medium w-full text-left">Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
