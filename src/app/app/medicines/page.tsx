'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import API from '@/lib/api';
import MedicineRoutineTable from '@/components/MedicineRoutineTable';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, Loader2, Clock, AlertCircle, Sparkles, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function AppMedicinesPage() {
    const router = useRouter();
    const { user, token } = useAppStore();
    const [routines, setRoutines] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token || !user) {
            router.push('/login');
            return;
        }
        loadRoutines();
    }, [user, token]);

    const loadRoutines = async () => {
        if (!user) return;
        try {
            const res = await API.get(`/patients/${user.id}/file`);
            setRoutines(res.data.data.medicineRoutines || []);
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to load medicine routines.');
        } finally {
            setIsLoading(false);
        }
    };

    const activeRoutines = routines.filter((r: any) => r.status === 'pending' || r.status === 'missed');
    const completedRoutines = routines.filter((r: any) => r.status === 'taken' || r.status === 'completed');

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <Loader2 className="h-7 w-7 text-amber-500 animate-spin" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-amber-200/30 animate-ping" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Loading your medicine routines...</p>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-6">
            {/* Gradient Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-5 text-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Pill className="h-5 w-5 text-white/80" />
                            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Medicine Tracker</span>
                        </div>
                        <h2 className="text-xl font-bold">My Medicines</h2>
                        <p className="text-xs text-white/70 mt-1">{activeRoutines.length} active · {completedRoutines.length} completed</p>
                    </div>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/20 font-semibold text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {activeRoutines.length} Active
                    </Badge>
                </div>
            </div>

            {/* Reminder card */}
            {activeRoutines.length > 0 && (
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50 py-0 rounded-2xl shadow-sm overflow-hidden">
                    <CardContent className="flex items-center gap-3 p-3.5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                            <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-amber-800">Daily Reminder</p>
                            <p className="text-[11px] text-amber-700/80">
                                You have {activeRoutines.length} active medicine{activeRoutines.length > 1 ? 's' : ''} to take today. Stay consistent for best results!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Time of day categories (visual enhancement) */}
            {activeRoutines.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
                        <div className="text-lg mb-1">🌅</div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Morning</p>
                        <p className="text-xs text-slate-400 mt-0.5">Before 12 PM</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
                        <div className="text-lg mb-1">☀️</div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Afternoon</p>
                        <p className="text-xs text-slate-400 mt-0.5">12 – 5 PM</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
                        <div className="text-lg mb-1">🌙</div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Night</p>
                        <p className="text-xs text-slate-400 mt-0.5">After 5 PM</p>
                    </div>
                </div>
            )}

            {/* Medicine routines */}
            {routines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center mb-4 shadow-sm">
                        <Pill className="h-9 w-9 text-amber-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">No medicine routines</p>
                    <p className="text-xs text-slate-400 max-w-[260px]">
                        Prescribed medicine routines from your doctors will appear here for easy tracking and reminders.
                    </p>
                </div>
            ) : (
                <MedicineRoutineTable routines={routines} onRefresh={loadRoutines} />
            )}
        </div>
    );
}
