'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    User, Mail, Phone, Shield, LogOut, ChevronRight,
    Bell, Moon, HelpCircle, FileText, Heart, Settings, Crown, Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function AppProfilePage() {
    const router = useRouter();
    const { user, logout } = useAppStore();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully.');
        router.push('/login');
    };

    const getInitials = (name: string) => {
        return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    };

    const menuSections = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Edit Profile', desc: 'Update your personal information', color: 'bg-blue-50 text-blue-500', action: () => toast.info('Coming soon!') },
                { icon: Bell, label: 'Notifications', desc: 'Manage your alert preferences', color: 'bg-amber-50 text-amber-500', action: () => toast.info('Coming soon!') },
                { icon: Shield, label: 'Privacy & Security', desc: 'Password and data settings', color: 'bg-emerald-50 text-emerald-500', action: () => toast.info('Coming soon!') },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: Moon, label: 'Appearance', desc: 'Theme and display settings', color: 'bg-indigo-50 text-indigo-500', action: () => toast.info('Coming soon!') },
                { icon: Heart, label: 'Health Goals', desc: 'Set and track your goals', color: 'bg-rose-50 text-rose-500', action: () => toast.info('Coming soon!') },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help & FAQ', desc: 'Get answers to common questions', color: 'bg-teal-50 text-teal-500', action: () => toast.info('Coming soon!') },
                { icon: FileText, label: 'Terms & Policies', desc: 'Read our terms of service', color: 'bg-slate-100 text-slate-500', action: () => toast.info('Coming soon!') },
            ]
        }
    ];

    return (
        <div className="space-y-5 pb-6">
            {/* Profile header card with gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 shadow-lg">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="absolute top-10 right-10 w-8 h-8 bg-white/10 rounded-full" />

                <div className="relative z-10 px-5 pt-6 pb-5">
                    <div className="flex items-center gap-4 mb-5">
                        <Avatar className="h-20 w-20 border-[3px] border-white/30 shadow-xl">
                            <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white text-xl font-bold">
                                {getInitials(user?.name || 'User')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight">{user?.name || 'Guest User'}</h2>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Crown className="h-3 w-3 text-amber-300" />
                                <p className="text-xs text-white/70 capitalize font-medium">{user?.role || 'Patient'} Account</p>
                            </div>
                        </div>
                    </div>

                    {/* User info pills */}
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2">
                            <Mail className="h-3.5 w-3.5 text-white/70" />
                            <span className="text-xs text-white/90 font-medium">{user?.email || 'Not set'}</span>
                        </div>
                        {user?.phone && (
                            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2">
                                <Phone className="h-3.5 w-3.5 text-white/70" />
                                <span className="text-xs text-white/90 font-medium">{user.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu sections */}
            {menuSections.map((section) => (
                <div key={section.title}>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 px-1">{section.title}</h3>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        {section.items.map((item, i) => (
                            <React.Fragment key={item.label}>
                                <button
                                    onClick={item.action}
                                    className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50/80 transition-all duration-200 text-left cursor-pointer active:scale-[0.99]"
                                >
                                    <div className={`h-10 w-10 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                                </button>
                                {i < section.items.length - 1 && <div className="mx-4 h-px bg-slate-100" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            ))}

            {/* Logout button */}
            <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl h-12 font-semibold cursor-pointer shadow-sm transition-all active:scale-[0.98]"
            >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
            </Button>

            {/* App version */}
            <div className="text-center pt-2 space-y-1">
                <p className="text-[10px] text-slate-400 font-medium">
                    SwasthSetu v1.0.0
                </p>
                <p className="text-[10px] text-slate-300">
                    Made with ❤️ for better healthcare
                </p>
            </div>
        </div>
    );
}
