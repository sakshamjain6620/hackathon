'use client';

import React from 'react';
import AIChatBox from '@/components/AIChatBox';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

export default function ChatPage() {
    return (
        <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col justify-center">
            {/* Header info */}
            <div className="mb-6 text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
                    <Sparkles className="h-3 w-3" />
                    AI Symptom Booking
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Book with SwasthSetu Agent</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Describe your health concerns naturally. The AI agent will detect your symptoms, classify urgency, recommend specialists, check slots, and generate a Razorpay payment order.
                </p>
            </div>

            {/* AIChatBox container */}
            <AIChatBox />

            {/* Hint Box */}
            <div className="mt-4 p-4 rounded-xl border border-blue-100 bg-blue-50/30 dark:bg-blue-950/10 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2 max-w-xl mx-auto">
                <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Hackathon Demo Tip:</span> Try writing symptoms like <span className="font-mono text-blue-600">"Mujhe cough aur extreme chest pain hai"</span> to trigger the high urgency Cardiologist referral, or <span className="font-mono text-blue-600">"I have a fever and sore throat"</span> for a General Physician recommendation.
                </div>
            </div>
        </div>
    );
}
