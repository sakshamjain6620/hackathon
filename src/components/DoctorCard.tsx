'use client';

import React from 'react';
import { Star, DollarSign, Clock, Calendar as CalendarIcon, Phone } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DoctorCardProps {
    doctor: {
        id: string;
        name: string;
        specialization: string;
        experience: number;
        fee: number;
        phone: string;
        email: string;
        available_days: string[];
        slot_start_time: string;
        slot_end_time: string;
        avatar_url?: string;
        rating?: number;
        reviews?: number;
    };
    onBook?: (doctor: any) => void;
    compact?: boolean;
}

export default function DoctorCard({ doctor, onBook, compact = false }: DoctorCardProps) {
    const getInitials = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DR';
    };

    const isAvailableToday = doctor.available_days.includes('Mon'); // Mock logic

    return (
        <div className={cn(
            "glass-card bg-white dark:bg-slate-900 rounded-[1.5rem] p-4 flex flex-col transition-all duration-300",
            !compact && "shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
        )}>
            <div className="flex gap-4">
                <div className="relative">
                    <Avatar className="h-16 w-16 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <AvatarImage src={doctor.avatar_url} alt={doctor.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-accent/80 text-white font-bold rounded-2xl">
                            {getInitials(doctor.name)}
                        </AvatarFallback>
                    </Avatar>
                    {isAvailableToday && (
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">Dr. {doctor.name}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{doctor.specialization}</p>
                        </div>
                        {isAvailableToday && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 text-[9px] px-1.5 py-0">
                                Available Today
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                            <span className="bg-orange-100 text-orange-600 p-0.5 rounded">
                                <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                            </span>
                            <span>{doctor.rating || 4.8} <span className="text-slate-400 font-normal">({doctor.reviews || 124})</span></span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>{doctor.experience} yrs exp</span>
                    </div>
                </div>
            </div>

            {!compact && (
                <>
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs">
                            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{doctor.slot_start_time} - {doctor.slot_end_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                                <DollarSign className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-100">₹{doctor.fee}</span>
                        </div>
                    </div>

                    {onBook && (
                        <Button 
                            onClick={() => onBook(doctor)} 
                            className="w-full mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md shadow-primary/25 h-11"
                        >
                            Select Doctor
                        </Button>
                    )}
                </>
            )}
            
            {compact && onBook && (
                 <Button 
                    onClick={() => onBook(doctor)} 
                    variant="outline"
                    className="w-full mt-3 rounded-xl border-primary text-primary hover:bg-primary/5 h-9 text-xs"
                >
                    View Details
                </Button>
            )}
        </div>
    );
}
