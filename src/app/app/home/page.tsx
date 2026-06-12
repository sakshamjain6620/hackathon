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
        { name: 'AI Chat', icon: MessageSquare, href: '/app/chat', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
        { name: 'Records', icon: FolderHeart, href: '/app/records', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
        { name: 'Medicines', icon: Pill, href: '/app/medicines', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
        { name: 'Payments', icon: Activity, href: '/app/appointments', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
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
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                    placeholder="Search doctor, medicines, articles..." 
                    className="w-full pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm shadow-slate-200/50 dark:shadow-none text-base placeholder:text-slate-400 focus-visible:ring-primary/20"
                />
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action) => (
                    <Link key={action.name} href={action.href} className="flex flex-col items-center gap-2 group">
                        <div className={`h-14 w-14 rounded-2xl ${action.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{action.name}</span>
                    </Link>
                ))}
            </div>

            {/* Health Summary Banner */}
            <GradientCard variant="primary" noPadding className="flex items-center overflow-hidden">
                <div className="p-5 flex-1 relative z-10">
                    <h3 className="text-white/90 font-medium text-sm mb-1">Health Status</h3>
                    <p className="text-2xl font-bold text-white mb-3">All Good!</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
                            <HeartPulse className="h-4 w-4 text-white" />
                            <span className="text-sm font-semibold text-white">72 bpm</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
                            <Droplets className="h-4 w-4 text-white" />
                            <span className="text-sm font-semibold text-white">B+</span>
                        </div>
                    </div>
                </div>
                <div className="relative w-32 h-full opacity-50 mix-blend-overlay flex items-center justify-center">
                    <Activity className="h-32 w-32 absolute -right-6 text-white" strokeWidth={1} />
                </div>
            </GradientCard>

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
