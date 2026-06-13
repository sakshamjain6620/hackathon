'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAppStore } from '@/store/useAppStore';
import API from '@/lib/api';
import { toast } from 'sonner';
import { Activity, Loader2, ArrowLeft, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const registerSchema = zod.object({
    name: zod.string().min(2, 'Name must be at least 2 characters'),
    email: zod.string().email('Please enter a valid email address'),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
    age: zod.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Please enter a valid age'),
    gender: zod.string().min(1, 'Please select a gender'),
    phone: zod.string().min(10, 'Phone number must be at least 10 digits'),
    address: zod.string().optional(),
    emergencyContact: zod.string().optional()
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { setUser, setToken } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            gender: ''
        }
    });

    const onSubmit = async (values: RegisterFormValues) => {
        setIsLoading(true);
        try {
            const res = await API.post('/auth/register', values);
            const { token, user } = res.data.data;

            setToken(token);
            setUser(user);

            toast.success('Registration successful! Welcome to SwasthSetu.');
            router.push('/app/chat');
        } catch (err: any) {
            console.error(err);
            const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-12 text-[14px] font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400";

    return (
        <div className="flex-1 overflow-y-auto w-full relative">
            <div className="min-h-full flex flex-col items-center justify-center py-8 px-4">
                {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[450px] h-[450px] bg-gradient-to-br from-violet-500/10 to-indigo-500/6 rounded-full filter blur-3xl animate-float" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-orange-400/8 to-pink-400/5 rounded-full filter blur-3xl animate-float-delayed" />
            </div>

            <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl h-11 w-11 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50">
                        <Link href="/login">
                            <ArrowLeft className="h-[18px] w-[18px] text-slate-600" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="w-11 h-11" />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h1>
                    <p className="text-[15px] text-slate-500 mt-2 font-medium">Join SwasthSetu for smart healthcare</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-200/60 dark:border-slate-800 p-7">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name + Email row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                                <Input id="name" placeholder="John Doe" {...register('name')} className={inputClass} />
                                {errors.name && <p className="text-[11px] text-rose-500 font-semibold">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" {...register('email')} className={inputClass} />
                                {errors.email && <p className="text-[11px] text-rose-500 font-semibold">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Age + Gender + Phone row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Age</Label>
                                <Input id="age" type="number" placeholder="28" {...register('age')} className={inputClass} />
                                {errors.age && <p className="text-[11px] text-rose-500 font-semibold">{errors.age.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Gender</Label>
                                <Select onValueChange={(val: string | null) => val && setValue('gender', val)}>
                                    <SelectTrigger className={inputClass}>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-[11px] text-rose-500 font-semibold">{errors.gender.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Mobile</Label>
                                <Input id="phone" placeholder="9876543210" {...register('phone')} className={inputClass} />
                                {errors.phone && <p className="text-[11px] text-rose-500 font-semibold">{errors.phone.message}</p>}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" {...register('password')} className={inputClass} />
                            {errors.password && <p className="text-[11px] text-rose-500 font-semibold">{errors.password.message}</p>}
                        </div>

                        {/* Optional fields */}
                        <div className="relative pt-2">
                            <div className="absolute inset-x-0 top-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
                            <div className="relative flex justify-center -mt-3"><span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Optional</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Address</Label>
                                <Input id="address" placeholder="123 Street, City" {...register('address')} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergencyContact" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Emergency Contact</Label>
                                <Input id="emergencyContact" placeholder="9876598765" {...register('emergencyContact')} className={inputClass} />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl h-[52px] text-[15px] shadow-lg shadow-indigo-500/25 cursor-pointer mt-1 transition-all active:scale-[0.98] hover:shadow-xl hover:shadow-indigo-500/30"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Complete Registration
                                    <UserPlus className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-7 text-[14px] text-slate-500">
                    <span>
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Sign in
                        </Link>
                    </span>
                </div>
                </div>
            </div>
        </div>
    );
}
