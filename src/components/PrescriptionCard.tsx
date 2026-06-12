'use client';

import React, { useState } from 'react';
import API from '@/lib/api';
import { FileText, Download, Calendar, Loader2, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Medicine {
    id: string;
    medicine_name: string;
    dosage: string;
    timing: string;
    duration_days: number;
    before_after_food: string;
}

interface PrescriptionCardProps {
    prescription: {
        id: string;
        doctor_name: string;
        doctor_specialization: string;
        diagnosis: string;
        instructions: string;
        follow_up_date?: string;
        created_at: string;
        medicines: Medicine[];
    };
}

export default function PrescriptionCard({ prescription }: PrescriptionCardProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            // Retrieve file via Axios using blob responseType to pass JWT header
            const res = await API.get(`/prescriptions/${prescription.id}/pdf`, {
                responseType: 'blob'
            });

            // Trigger browser download
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `prescription_${prescription.id.slice(0, 8)}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('Prescription PDF downloaded successfully.');
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to download prescription PDF.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Card className="glass-card hover:translate-y-0 border border-slate-100 bg-white/70 shadow-xs">
            <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-3.5">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-teal-500" />
                        <div>
                            <h4 className="font-bold text-sm text-slate-800">Medical Rx Prescription</h4>
                            <span className="text-xs text-slate-400 font-semibold">Dr. {prescription.doctor_name} ({prescription.doctor_specialization})</span>
                        </div>
                    </div>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading}
                        className="h-8 text-xs font-semibold cursor-pointer border-slate-200"
                    >
                        {isDownloading ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                            <Download className="h-3 w-3 mr-1 text-slate-500" />
                        )}
                        PDF Rx
                    </Button>
                </div>

                {/* Body details */}
                <div className="space-y-4 text-xs text-slate-600">
                    <div>
                        <span className="font-bold text-slate-700 block mb-1">Diagnosis:</span>
                        <p className="font-semibold text-slate-800 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50">
                            {prescription.diagnosis || 'General Checkup'}
                        </p>
                    </div>

                    {/* Medicines List */}
                    <div className="space-y-2">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                            <Pill className="h-3.5 w-3.5 text-blue-500" />
                            Prescribed Medicines:
                        </span>
                        
                        <div className="space-y-2.5">
                            {prescription.medicines.map((med) => (
                                <div key={med.id} className="p-3 bg-white border rounded-xl flex items-center justify-between gap-3 shadow-xs">
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-[13px]">{med.medicine_name}</h5>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{med.timing} • {med.before_after_food}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md block">
                                            {med.dosage}
                                        </span>
                                        <span className="text-[9px] text-slate-400 block mt-1">Duration: {med.duration_days} days</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* General instructions */}
                    {prescription.instructions && (
                        <div>
                            <span className="font-bold text-slate-700 block mb-1">Instructions:</span>
                            <p className="leading-relaxed bg-slate-50/20 p-2 rounded-lg border">{prescription.instructions}</p>
                        </div>
                    )}

                    {prescription.follow_up_date && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-blue-50/30 px-3 py-2 rounded-lg border border-blue-100/40">
                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                            <span>Follow Up Consultation Date: <strong className="text-blue-700 font-bold">{prescription.follow_up_date}</strong></span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
