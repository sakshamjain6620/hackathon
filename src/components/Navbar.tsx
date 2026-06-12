'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Activity, Menu, X, LogOut, User as UserIcon, LayoutDashboard, Calendar, ClipboardList, Home } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin-dashboard';
        return '/patient-dashboard';
    };

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'AI Symptom Booking', path: '/chat', icon: Calendar },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b shadow-xs">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 dark:text-blue-400">
                    <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
                    <span className="tracking-tight">SwasthSetu</span>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                pathname === item.path 
                                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                    : 'text-slate-600 dark:text-slate-300'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth Section */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="rounded-full select-none cursor-pointer outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500">
                                <Avatar className="h-10 w-10 border border-blue-100 hover:border-blue-300 transition-colors">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-semibold leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 mt-1">
                                            {user.role}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer p-0">
                                    <Link href={getDashboardLink()} className="flex items-center gap-2 w-full px-1.5 py-1">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-rose-600 focus:text-rose-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                                Login
                            </Link>
                            <Link href="/register" className={buttonVariants({ className: "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium shadow-md" })}>
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav Menu */}
            {isOpen && (
                <div className="md:hidden border-b bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-3 shadow-lg">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 py-2 text-base font-medium rounded-md px-3 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                pathname === item.path 
                                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                                    : 'text-slate-700 dark:text-slate-300'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                    
                    <div className="border-t pt-3 flex flex-col gap-2">
                        {user ? (
                            <>
                                <Link 
                                    href={getDashboardLink()} 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 py-2 text-base font-medium rounded-md px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    Go to Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center gap-2 py-2 w-full text-left text-base font-medium text-rose-600 rounded-md px-3 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsOpen(false)} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                                    Login
                                </Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className={buttonVariants({ className: "w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white" })}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
