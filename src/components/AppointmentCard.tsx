'use client';

import React from 'react';
import { Calendar, Clock, ChevronRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/app/StatusBadge';
import { ProfileAvatar } from '@/components/app/ProfileAvatar';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
    app: {
        id: string;
        doctor_name: string;
        doctor_specialization: string;
        appointment_date: string;
        appointment_time: string;
        token_no: number;
        amount: number;
        payment_status: 'paid' | 'pending' | 'cancelled' | 'failed';
        appointment_status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
        appointment_code?: string;
        symptoms?: string;
        doctor_avatar?: string;
    };
    onAction?: (appId: string) => void;
    onViewDetails?: (appId: string) => void;
}

export default function AppointmentCard({ app, onAction, onViewDetails }: AppointmentCardProps) {
    const isPast = app.appointment_status === 'completed' || app.appointment_status === 'cancelled';
    const doctorName = app.doctor_name?.startsWith('Dr.') ? app.doctor_name : `Dr. ${app.doctor_name || 'Doctor'}`;
    const dateLabel = app.appointment_date
        ? new Date(`${app.appointment_date}T00:00:00`).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : 'Date pending';
    const amount = Number(app.amount || 0);

    return (
        <div
            className={cn(
                'bg-white dark:bg-slate-900 rounded-[24px] p-5 flex flex-col gap-4 border w-full box-border overflow-hidden transition-all',
                isPast
                    ? 'opacity-80 border-slate-200/50 dark:border-slate-800'
                    : 'shadow-[0_4px_24px_rgba(0,0,0,0.03)] border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/30'
            )}
        >
            {/* Top: Doctor Info + Status */}
            <div className="flex items-center gap-3 w-full min-w-0">
                <ProfileAvatar name={doctorName} src={app.doctor_avatar} size="md" className="shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="font-extrabold text-[15px] text-slate-800 dark:text-slate-100 truncate">
                        {doctorName}
                    </h4>
                    <span className="text-[13px] text-slate-500 font-semibold truncate">
                        {app.doctor_specialization || 'Specialist'}
                    </span>
                </div>
                <div className="shrink-0">
                    <StatusBadge status={app.appointment_status as any} />
                </div>
            </div>

            {/* Date Time Fee row */}
            <div className="flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl px-4 py-3 border border-slate-200/50 dark:border-slate-700/50 w-full min-w-0">
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 min-w-0">
                        <Calendar className="h-[14px] w-[14px] text-indigo-500 shrink-0" />
                        <span className="text-[13px] font-bold truncate">{dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 min-w-0">
                        <Clock className="h-[14px] w-[14px] text-emerald-500 shrink-0" />
                        <span className="text-[13px] font-bold truncate">{app.appointment_time || 'Pending'}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end shrink-0 ml-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Fee</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">₹{amount}</span>
                </div>
            </div>

            {/* Appointment Code (if exists) */}
            {app.appointment_code && (
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Code</span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                        {app.appointment_code}
                    </span>
                </div>
            )}

            {/* Actions if pending */}
            {app.appointment_status === 'pending' && onAction && (
                <Button
                    onClick={() => onAction(app.id)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-[14px] h-11 shadow-md shadow-emerald-500/20 font-bold text-[13px] transition-all active:scale-[0.98]"
                >
                    <CreditCard className="h-4 w-4 mr-1.5" />
                    Pay & Confirm
                </Button>
            )}

            {/* Actions if details viewable */}
            {onViewDetails && (
                <Button
                    variant="outline"
                    onClick={() => onViewDetails(app.id)}
                    className="w-full border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[14px] h-11 font-bold text-[13px] text-slate-600 dark:text-slate-300 transition-all mt-1"
                >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1.5 opacity-50" />
                </Button>
            )}
        </div>
    );
}
