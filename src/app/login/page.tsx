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
import { Activity, ShieldCheck, UserCheck, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = zod.object({
    email: zod.string().email('Please enter a valid email address'),
    password: zod.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = zod.infer<typeof loginSchema>;

const DEMO_CREDENTIALS = {
    patient: { email: 'patient@swasthsetu.health', password: 'patient123' },
    admin: { email: 'admin@swasthsetu.health', password: 'admin123' },
} as const;

export default function LoginPage() {
    const router = useRouter();
    const { setUser, setToken } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeRole, setActiveRole] = useState<'patient' | 'admin'>('patient');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: DEMO_CREDENTIALS.patient.email,
            password: DEMO_CREDENTIALS.patient.password,
        }
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        try {
            const res = await API.post('/auth/login', values);
            const { token, user } = res.data.data;

            setToken(token);
            setUser(user);

            toast.success(`Welcome back, ${user.name}!`);

            // Redirect based on role
            if (user.role === 'admin') {
                router.push('/admin-dashboard');
            } else {
                router.push('/app/home');
            }
        } catch (err: any) {
            console.error(err);
            const errMsg = err.response?.data?.message || 'Invalid email or password. Please check your credentials.';
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Fill the form with demo credentials for the selected role
    const handleRoleSelect = (role: 'patient' | 'admin') => {
        setActiveRole(role);
        setValue('email', DEMO_CREDENTIALS[role].email, { shouldValidate: true });
        setValue('password', DEMO_CREDENTIALS[role].password, { shouldValidate: true });
        toast.info(`Demo credentials loaded for ${role === 'admin' ? 'Admin' : 'User'}`);
    };

    return (
        <div className="flex-1 flex items-center justify-center py-8 px-4 relative overflow-hidden min-h-0">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-teal-400/15 rounded-full filter blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-400/15 to-blue-400/15 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-300/10 rounded-full filter blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo and title */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg shadow-blue-200/50 mb-4">
                        <Activity className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign in to your SwasthSetu account</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">

                    {/* Role quick-select (Patient / Admin only) */}
                    <div className="mb-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                            Select demo role
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {/* User */}
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('patient')}
                                className={`py-3 px-4 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${activeRole === 'patient'
                                    ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200 shadow-sm'
                                    : 'border-slate-200 text-slate-500 bg-slate-50/50 hover:bg-slate-100/80'
                                    }`}
                            >
                                <UserCheck className="h-5 w-5" />
                                <span>User</span>
                                <span className="text-[9px] font-normal text-current opacity-70">
                                    patient@swasthsetu.health
                                </span>
                            </button>

                            {/* Admin */}
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('admin')}
                                className={`py-3 px-4 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${activeRole === 'admin'
                                    ? 'bg-indigo-50 border-indigo-400 text-indigo-600 ring-2 ring-indigo-200 shadow-sm'
                                    : 'border-slate-200 text-slate-500 bg-slate-50/50 hover:bg-slate-100/80'
                                    }`}
                            >
                                <ShieldCheck className="h-5 w-5" />
                                <span>Admin</span>
                                <span className="text-[9px] font-normal text-current opacity-70">
                                    admin@swasthsetu.health
                                </span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-600">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register('email')}
                                className="bg-slate-50/80 border-slate-200 rounded-xl h-11 text-sm focus:ring-2 focus:ring-blue-200"
                            />
                            {errors.email && (
                                <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-600">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className="bg-slate-50/80 border-slate-200 rounded-xl h-11 text-sm focus:ring-2 focus:ring-blue-200 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-2xl h-12 shadow-lg shadow-blue-200/50 cursor-pointer mt-2 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Verifying Account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Sign In
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Demo note */}
                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-500 text-center font-medium">
                            Click a role card above to auto-fill demo credentials, then press Sign In.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-5 text-xs text-slate-500">
                    <span>
                        Don&apos;t have a user account?{' '}
                        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
                            Register now
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
