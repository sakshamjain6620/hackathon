'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import AdminSidebar from '@/components/AdminSidebar';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, token } = useAppStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (!token || !user || user.role !== 'admin') {
            toast.error('Access denied. Administrator privileges required.');
            router.push('/login');
        }
    }, [user, token]);

    if (!isMounted || !user || user.role !== 'admin') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 h-screen">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-500">Authenticating administrator access...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen bg-slate-100 overflow-hidden font-sans">
            <AdminSidebar />
            <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50">
                {children}
            </main>
        </div>
    );
}
