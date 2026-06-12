'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, User, CalendarDays, Clock, CreditCard, Activity, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/app/StatusBadge';
import { ProfileAvatar } from '@/components/app/ProfileAvatar';
import { Button } from '@/components/ui/button';

export default function AppointmentDetails() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAppointment = async () => {
            try {
                const res = await API.get(`/appointments/${id}`);
                setAppointment(res.data.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load appointment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Activity className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-500">Loading appointment details...</p>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-rose-500 font-bold">Appointment not found.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const doctorName = appointment.doctor_name?.startsWith('Dr.') ? appointment.doctor_name : `Dr. ${appointment.doctor_name}`;

    return (
        <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium text-sm"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Header Profile Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <ProfileAvatar name={doctorName} src={appointment.doctor_avatar} size="lg" />
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{doctorName}</h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                {appointment.doctor_specialization || 'Specialist'}
                            </p>
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
                        <StatusBadge status={appointment.appointment_status} />
                        {appointment.appointment_code && (
                            <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 mt-2 text-center shadow-sm">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block leading-tight mb-0.5">Appt Code</span>
                                <span className="font-mono font-black text-slate-800 dark:text-slate-200">{appointment.appointment_code}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" /> Patient Details
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                                <p className="font-bold text-slate-800 dark:text-slate-200">{appointment.patient_name}</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">Phone: {appointment.patient_phone || 'N/A'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" /> Schedule
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Date</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{appointment.appointment_date}</span>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Time</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-blue-500" /> {appointment.appointment_time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" /> Clinic Location
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                                <p className="font-bold text-slate-800 dark:text-slate-200">SwasthSetu Health Clinic</p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    123 Healthcare Avenue, Medical District, Mumbai - 400001
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <CreditCard className="h-3.5 w-3.5" /> Payment Status
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Consultation Fee</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">₹{appointment.amount}</span>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Status</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${appointment.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {appointment.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Notes Section if any */}
                {appointment.symptoms && (
                    <div className="px-6 pb-8 md:px-8">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                            <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5" /> Reported Symptoms
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{appointment.symptoms}"</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
