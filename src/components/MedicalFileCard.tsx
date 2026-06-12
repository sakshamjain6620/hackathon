'use client';

import React from 'react';
import { Calendar, Stethoscope, FileText, ClipboardPlus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MedicalFileCardProps {
    record: {
        id: string;
        doctor_name: string;
        doctor_specialization: string;
        symptoms: string;
        diagnosis: string;
        doctor_notes: string;
        visit_summary: string;
        follow_up_advice: string;
        created_at: string;
    };
}

export default function MedicalFileCard({ record }: MedicalFileCardProps) {
    return (
        <div className="glass-card bg-white dark:bg-slate-900 rounded-[1.5rem] p-5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all duration-300">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">Clinical Report</h4>
                        <span className="text-[11px] text-slate-500 font-medium">Dr. {record.doctor_name} • {record.doctor_specialization}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(record.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                        <span className="text-[10px] text-slate-500 font-medium block mb-1 uppercase tracking-wider">Symptoms</span>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">{record.symptoms || 'General wellness review'}</p>
                    </div>

                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800/30">
                        <span className="text-[10px] text-emerald-600 font-medium block mb-1 uppercase tracking-wider">Diagnosis</span>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 line-clamp-2">
                            {record.diagnosis || 'Diagnosis pending'}
                        </p>
                    </div>
                </div>

                {record.follow_up_advice && (
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800/30 flex items-start gap-3">
                        <ClipboardPlus className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <span className="text-[10px] text-blue-600 font-medium block mb-0.5 uppercase tracking-wider">Follow-Up Advice</span>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                {record.follow_up_advice}
                            </p>
                        </div>
                    </div>
                )}

                <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 h-10 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
                    View Full File
                    <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
            </div>
        </div>
    );
}
