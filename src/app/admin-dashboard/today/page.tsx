'use client';

import React, { useState, useEffect } from 'react';
import API from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { QrCode, Search, CheckCircle2, Clock, User, AlertCircle } from 'lucide-react';

export default function TodayQueuePage() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [verifyCode, setVerifyCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchTodayQueue = async () => {
        try {
            const res = await API.get('/admin/appointments/today');
            setAppointments(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load today's queue");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayQueue();
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyCode.trim()) return;

        setIsVerifying(true);
        try {
            const res = await API.post('/admin/queue/verify', { code: verifyCode.trim().toUpperCase() });
            toast.success(`Success! Token #${res.data.data.token_no} assigned to ${res.data.data.patient_name}`);
            setVerifyCode('');
            fetchTodayQueue();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid or expired code");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleGenerateQueue = async () => {
        setIsGenerating(true);
        try {
            const res = await API.post('/admin/queue/generate');
            toast.success(res.data.message);
            fetchTodayQueue();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to generate queue");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading queue...</div>;
    }

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Queue Manager</h1>
                    <p className="text-slate-500 mt-1">Manage today's patient flow and verify check-ins.</p>
                    <Button 
                        onClick={handleGenerateQueue} 
                        disabled={isGenerating}
                        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
                        size="sm"
                    >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {isGenerating ? 'Generating...' : 'Generate Queue'}
                    </Button>
                </div>

                <form onSubmit={handleVerify} className="flex items-center gap-2 max-w-sm w-full">
                    <div className="relative flex-1">
                        <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Enter Appt Code (e.g. SV-2505-XXXX)"
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                        />
                    </div>
                    <Button type="submit" disabled={isVerifying || !verifyCode} className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                        Verify & Assign
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Today's Check-ins & Queue</h3>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                            {appointments.length} Patients
                        </span>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/50 border-b">
                                <tr>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Queue #</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Appt Code</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Patient</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Doctor</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Slot</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                                            No patients have checked in yet today.
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((app: any) => (
                                        <tr key={app.id} className="hover:bg-slate-50/50">
                                            <td className="px-5 py-3 font-black text-blue-600 text-base">
                                                {app.token_no ? `#${app.token_no}` : '-'}
                                            </td>
                                            <td className="px-5 py-3 font-mono text-sm text-slate-500">
                                                {app.appointment_status === 'checked_in' || app.appointment_status === 'completed' 
                                                    ? app.appointment_code 
                                                    : <span className="text-slate-400">••••••••••</span>}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-slate-800">{app.patient_name}</td>
                                            <td className="px-5 py-3 text-slate-600">Dr. {app.doctor_name}</td>
                                            <td className="px-5 py-3 text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-slate-400" />
                                                    {app.appointment_time}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                                                    app.appointment_status === 'checked_in' ? 'bg-emerald-100 text-emerald-700' :
                                                    app.appointment_status === 'completed' ? 'bg-slate-100 text-slate-600' :
                                                    app.appointment_status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {app.appointment_status === 'confirmed' 
                                                        ? 'Awaiting Check-in' 
                                                        : app.appointment_status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100/50 h-fit">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" /> Waitlist Rules
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2">
                            <span className="font-bold text-blue-600">1.</span>
                            Patients must present their Appt Code at the desk.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-blue-600">2.</span>
                            Enter the code to mark them as Checked In.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-blue-600">3.</span>
                            The system assigns a sequential Queue Token automatically.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
