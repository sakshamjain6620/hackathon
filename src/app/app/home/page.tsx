'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import API from '@/lib/api';
import AppointmentCard from '@/components/AppointmentCard';
import { GradientCard } from '@/components/app/GradientCard';
import { SectionHeader } from '@/components/app/SectionHeader';
import { SymptomChip } from '@/components/app/SymptomChip';
import DoctorCard from '@/components/DoctorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    MessageSquare, Calendar, FolderHeart, Pill, Activity,
    Search, Loader2, HeartPulse, Stethoscope, Droplets, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function AppHomePage() {
    const router = useRouter();
    const { user, token } = useAppStore();
    const [patientFile, setPatientFile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token || !user) {
            router.push('/login');
            return;
        }
        loadPatientFile();
    }, [user, token]);

    const loadPatientFile = async () => {
        if (!user) return;
        try {
            const res = await API.get(`/patients/${user.id}/file`);
            setPatientFile(res.data.data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { name: 'AI Chat', icon: MessageSquare, href: '/app/chat', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 shadow-indigo-500/10' },
        { name: 'Records', icon: FolderHeart, href: '/app/records', color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 shadow-violet-500/10' },
        { name: 'Medicines', icon: Pill, href: '/app/medicines', color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10 shadow-orange-500/10' },
        { name: 'Visits', icon: Calendar, href: '/app/appointments', color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/10 shadow-teal-500/10' },
    ];

    const specializations = [
        { name: 'Neurologist', icon: '🧠' },
        { name: 'Cardiologist', icon: '🫀' },
        { name: 'Orthopedist', icon: '🦴' },
        { name: 'Pulmonologist', icon: '🫁' },
        { name: 'Dentist', icon: '🦷' },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-500">Loading your health dashboard...</p>
            </div>
        );
    }

    const appointments = patientFile?.appointments || [];
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingApps = appointments.filter((app: any) =>
        app.appointment_date >= todayStr &&
        (app.appointment_status === 'confirmed' || app.appointment_status === 'pending')
    );
    
    // Mock Doctor for recent visits
    const mockDoctor = {
        id: '1',
        name: 'Warner',
        specialization: 'Neurology',
        experience: 5,
        fee: 500,
        phone: '1234567890',
        email: 'doc@example.com',
        available_days: ['Mon', 'Wed', 'Fri'],
        slot_start_time: '10:00 AM',
        slot_end_time: '02:00 PM',
        avatar_url: 'https://i.pravatar.cc/150?u=warner',
        rating: 4.9,
        reviews: 320
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                    placeholder="Search doctors, medicines, articles..." 
                    className="w-full pl-12 h-[52px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none text-[15px] font-medium placeholder:text-slate-400 placeholder:font-normal focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
                />
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action) => (
                    <Link key={action.name} href={action.href} className="flex flex-col items-center gap-2.5 group">
                        <div className={`h-[60px] w-[60px] rounded-[18px] ${action.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{action.name}</span>
                    </Link>
                ))}
            </div>

            {/* Health Summary Banner */}
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-5 shadow-xl shadow-indigo-500/20 text-white animate-fade-in-up">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full filter blur-xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full filter blur-xl" />
                
                <div className="relative z-10 flex items-center">
                    <div className="flex-1">
                        <h3 className="text-white/80 font-bold text-[11px] uppercase tracking-wider mb-1">Health Status</h3>
                        <p className="text-[26px] font-extrabold text-white mb-4 leading-none">All Good!</p>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                                <HeartPulse className="h-4 w-4 text-rose-200" />
                                <span className="text-[13px] font-bold text-white">72 bpm</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                                <Droplets className="h-4 w-4 text-blue-200" />
                                <span className="text-[13px] font-bold text-white">B+</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-28 h-full opacity-60 mix-blend-overlay flex items-center justify-center">
                        <Activity className="h-28 w-28 text-white drop-shadow-2xl" strokeWidth={1.5} />
                    </div>
                </div>
            </div>

            {/* Specializations */}
            <div>
                <SectionHeader title="Specialist Doctors" actionText="See All" actionHref="/app/doctors" />
                <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-none px-1">
                    {specializations.map((spec) => (
                        <div key={spec.name} className="flex flex-col items-center gap-2 min-w-[76px] cursor-pointer group">
                            <div className="h-[72px] w-[72px] rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-md transition-all">
                                {spec.icon}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{spec.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Appointment */}
            {upcomingApps.length > 0 && (
                <div>
                    <SectionHeader title="Upcoming Appointment" />
                    <AppointmentCard app={upcomingApps[0]} />
                </div>
            )}

            {/* Recent Visits / Recommended Doctors */}
            <div>
                <SectionHeader title="My Recent Visit" actionText="See All" actionHref="/app/appointments" />
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-none px-1">
                    <div className="min-w-[280px]">
                        <DoctorCard doctor={mockDoctor} onBook={(d) => router.push(`/doctor/${d.id}`)} />
                    </div>
                    {/* Add one more mock to show scrolling */}
                    <div className="min-w-[280px]">
                        <DoctorCard doctor={{...mockDoctor, name: 'Sarah Mitchell', avatar_url: 'https://i.pravatar.cc/150?u=sarah'}} onBook={(d) => router.push(`/doctor/${d.id}`)} />
                    </div>
                </div>
            </div>
            
            {/* Spacer for bottom nav */}
            <div className="h-4"></div>
        </div>
    );
}
