'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import API from '@/lib/api';
import DoctorCard from '@/components/DoctorCard';
import { Stethoscope, Loader2, Sparkles, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function DoctorsPage() {
    const router = useRouter();
    const { updateBooking, addChatMessage } = useAppStore();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await API.get('/doctors');
                setDoctors(res.data.data);
            } catch (err: any) {
                console.error(err);
                toast.error('Failed to retrieve clinician list.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Filter categories
    const specializations = ['All', 'General Physician', 'Cardiologist', 'ENT Specialist', 'Dermatologist', 'Orthopedic Surgeon', 'Pediatrician'];

    const filteredDoctors = doctors.filter(d => {
        const matchSpec = selectedSpecialization === 'All' || d.specialization === selectedSpecialization;
        const matchSearch = !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchSpec && matchSearch;
    });

    const handleBookNow = (doctor: any) => {
        // Pre-fill booking details in store
        updateBooking({
            selectedDoctor: doctor,
            specialization: doctor.specialization
        });

        // Initialize Chat messages with the chosen doctor context
        addChatMessage({
            sender: 'ai',
            text: `You have selected Dr. ${doctor.name} (${doctor.specialization}). Please pick a consultation date and slot:`,
            timestamp: new Date(),
            actionHint: 'select_slot'
        });

        // Route to AI chat
        router.push('/chat');
    };

    return (
        <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="text-center mb-8 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100/50 text-blue-600 text-xs font-semibold mb-3 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Specialist Referrals
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Our Medical Team</h1>
                <p className="text-sm text-slate-500">
                    Find and consult with experienced doctors across multiple specialties.
                </p>
            </div>

            {/* Search bar */}
            <div className="relative max-w-md mx-auto mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search doctors by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 shadow-sm transition-all"
                />
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                {specializations.map(spec => (
                    <button
                        key={spec}
                        onClick={() => setSelectedSpecialization(spec)}
                        className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
                            selectedSpecialization === spec
                                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md border-transparent'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 shadow-sm'
                        }`}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            {/* Content List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                            <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-blue-200/30 animate-ping" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Retrieving doctor directory...</p>
                </div>
            ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-20">
                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Stethoscope className="h-9 w-9 text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">No doctors found</p>
                    <p className="text-xs text-slate-400">Try a different filter or search term.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDoctors.map(doctor => (
                        <div key={doctor.id}>
                            <DoctorCard doctor={doctor} onBook={handleBookNow} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
