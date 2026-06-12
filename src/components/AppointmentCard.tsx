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
                'bg-white dark:bg-slate-900 rounded-2xl p-4 flex flex-col gap-3 border w-full box-border overflow-hidden',
                isPast
                    ? 'opacity-80 border-slate-100 dark:border-slate-800'
                    : 'shadow-sm border-slate-100 dark:border-slate-800'
            )}
        >
            {/* Top: Doctor Info + Status */}
            <div className="flex items-center gap-3 w-full min-w-0">
                <ProfileAvatar name={doctorName} src={app.doctor_avatar} size="md" className="shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {doctorName}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium truncate">
                        {app.doctor_specialization || 'Specialist'}
                    </span>
                </div>
                <div className="shrink-0">
                    <StatusBadge status={app.appointment_status as any} />
                </div>
            </div>

            {/* Date Time Fee row */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-slate-700/50 w-full min-w-0">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 min-w-0">
                        <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="text-xs font-semibold truncate">{dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 min-w-0">
                        <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="text-xs font-semibold truncate">{app.appointment_time || 'Pending'}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fee</span>
                    <span className="text-base font-black text-slate-800 dark:text-slate-100 leading-none">₹{amount}</span>
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 shadow-sm font-semibold text-xs"
                >
                    <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                    Pay & Confirm
                </Button>
            )}

            {/* Actions if details viewable */}
            {onViewDetails && (
                <Button
                    variant="outline"
                    onClick={() => onViewDetails(app.id)}
                    className="w-full border-slate-200 dark:border-slate-700 rounded-xl h-10 font-semibold text-xs mt-1"
                >
                    View Details
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
            )}
        </div>
    );
}
