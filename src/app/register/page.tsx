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

    return (
        <div className="flex-1 flex items-center justify-center py-8 px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-teal-400/15 rounded-full filter blur-3xl -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-400/15 to-blue-400/15 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="w-full max-w-lg relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <Button variant="ghost" size="icon" asChild className="rounded-2xl h-10 w-10 bg-white/80 shadow-sm border border-slate-100 cursor-pointer">
                        <Link href="/login">
                            <ArrowLeft className="h-4 w-4 text-slate-600" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-md">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="w-10 h-10" /> {/* Spacer */}
                </div>

                <div className="text-center mb-5">
                    <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-sm text-slate-500 mt-1">Register as a patient to get started</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-xs font-semibold text-slate-600">Full Name</Label>
                                <Input id="name" placeholder="John Doe" {...register('name')} className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm" />
                                {errors.name && <p className="text-[10px] text-rose-500 font-semibold">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-xs font-semibold text-slate-600">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" {...register('email')} className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm" />
                                {errors.email && <p className="text-[10px] text-rose-500 font-semibold">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="age" className="text-xs font-semibold text-slate-600">Age</Label>
                                <Input id="age" type="number" placeholder="28" {...register('age')} className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm" />
                                {errors.age && <p className="text-[10px] text-rose-500 font-semibold">{errors.age.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="gender" className="text-xs font-semibold text-slate-600">Gender</Label>
                                <Select onValueChange={(val: string | null) => val && setValue('gender', val)}>
                                    <SelectTrigger className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-[10px] text-rose-500 font-semibold">{errors.gender.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="phone" className="text-xs font-semibold text-slate-600">Mobile</Label>
                                <Input id="phone" placeholder="9876543210" {...register('phone')} className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm" />
                                {errors.phone && <p className="text-[10px] text-rose-500 font-semibold">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-600">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" {...register('password')} className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm" />
                            {errors.password && <p className="text-[10px] text-rose-500 font-semibold">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="address" className="text-xs font-semibold text-slate-600">Home Address <span className="text-slate-400 font-normal">(optional)</span></Label>
                            <Input id="address" placeholder="123 Street Name, City" {...register('address')} className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm" />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="emergencyContact" className="text-xs font-semibold text-slate-600">Emergency Contact <span className="text-slate-400 font-normal">(optional)</span></Label>
                            <Input id="emergencyContact" placeholder="9876598765" {...register('emergencyContact')} className="bg-slate-50/80 border-slate-200 rounded-xl h-10 text-sm" />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-2xl h-12 shadow-lg shadow-blue-200/50 cursor-pointer mt-2 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Complete Registration
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-5 text-xs text-slate-500">
                    <span>
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                            Login here
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
