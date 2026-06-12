'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, Calendar, Stethoscope, Users, 
    CreditCard, Bell, Activity, LogOut, Pill, Clock, LayoutList, X
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAppStore();

    const menuItems = [
        { name: 'Overview', path: '/admin-dashboard', icon: LayoutDashboard },
        { name: 'Appointments', path: '/admin-dashboard/appointments', icon: Calendar },
        { name: 'Today\'s Queue', path: '/admin-dashboard/today', icon: LayoutList },
        { name: 'Doctors', path: '/admin-dashboard/doctors', icon: Stethoscope },
        { name: 'Slot Config', path: '/admin-dashboard/slots', icon: Clock },
        { name: 'Patients', path: '/admin-dashboard/patients', icon: Users },
        { name: 'Revenue', path: '/admin-dashboard/payments', icon: CreditCard },
        { name: 'Medicines', path: '/admin-dashboard/medicines', icon: Pill },
        { name: 'Reminders Panel', path: '/admin-dashboard/reminders', icon: Bell }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 flex flex-col h-full border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Header branding */}
                <div className="h-16 flex justify-between items-center px-6 border-b border-slate-800 shrink-0">
                    <span className="text-white font-bold text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-500" /> Admin Console
                    </span>
                    <button 
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => onClose()}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="h-4.5 w-4.5 shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t border-slate-800 shrink-0">
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl text-sm font-semibold hover:bg-slate-800 hover:text-rose-400 transition-all cursor-pointer"
                    >
                        <LogOut className="h-4.5 w-4.5 shrink-0" />
                        Exit Dashboard
                    </button>
                </div>
            </aside>
        </>
    );
}
