'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShieldCheck, CreditCard, Sparkles, Activity } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden py-20 lg:py-28 flex flex-col items-center">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-emerald-400/10 rounded-full filter blur-3xl -z-10 animate-pulse" />

            <div className="container mx-auto px-4 max-w-5xl text-center flex flex-col items-center">
                {/* Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30 text-xs font-semibold uppercase tracking-wider mb-6"
                >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    Microsoft Foundry Powered Agent
                </motion.div>

                {/* Main Heading */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight"
                >
                    Your Virtual Healthcare Bridge <br />
                    <span className="gradient-text">SwasthSetu</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed"
                >
                    Connect patients, doctors, appointments, payments, prescriptions, and digital medical files in one unified, AI-driven clinic workflow system.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-16"
                >
                    <Button 
                        asChild
                        size="lg" 
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium px-8 shadow-lg shadow-blue-500/10 cursor-pointer"
                    >
                        <Link href="/chat" className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Book Appointment with AI
                        </Link>
                    </Button>
                    <Button 
                        asChild
                        variant="outline" 
                        size="lg" 
                        className="w-full sm:w-auto hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-pointer"
                    >
                        <Link href="/doctors">
                            Find Specialists
                        </Link>
                    </Button>
                </motion.div>

                {/* Feature Icons Row */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-left max-w-4xl"
                >
                    <div className="glass-card p-5 rounded-2xl">
                        <Activity className="h-8 w-8 text-emerald-500 mb-3" />
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">AI Diagnostics</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Understands symptoms and schedules slot referrals.</p>
                    </div>
                    <div className="glass-card p-5 rounded-2xl">
                        <ShieldCheck className="h-8 w-8 text-blue-500 mb-3" />
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Digital Files</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Zero physical papers. Online medical hospital records.</p>
                    </div>
                    <div className="glass-card p-5 rounded-2xl">
                        <CreditCard className="h-8 w-8 text-teal-500 mb-3" />
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Razorpay Payments</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Secure test checks, instant token generation.</p>
                    </div>
                    <div className="glass-card p-5 rounded-2xl">
                        <Sparkles className="h-8 w-8 text-indigo-500 mb-3" />
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Smart Reminders</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Dosage alerts sent to simulated WhatsApp.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
