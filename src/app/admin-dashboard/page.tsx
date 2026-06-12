'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import API from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Calendar, CreditCard, Stethoscope, Users, 
    AlertTriangle, Bell, TrendingUp, Loader2, IndianRupee, LogOut, ShieldCheck, BarChart3,
    Clock, CheckCircle2, ListChecks, Zap, UserCheck, CalendarCheck, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

export default function AdminOverview() {
    const router = useRouter();
    const { user, token, logout } = useAppStore();
    const [stats, setStats] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'statistics'>('overview');

    const loadDashboardData = async () => {
        try {
            const [statsRes, revRes] = await Promise.all([
                API.get('/admin/stats'),
                API.get('/admin/revenue')
            ]);
            setStats(statsRes.data.data);
            setRevenueData(revRes.data.data);
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to load dashboard statistics.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token || !user || user.role !== 'admin') {
            toast.error('Unauthorized. Admin access only.');
            router.push('/login');
            return;
        }
        loadDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                        <Loader2 className="h-7 w-7 text-indigo-500 animate-spin" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-indigo-200/30 animate-ping" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Compiling dashboard metrics...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 h-full min-h-[400px]">
                <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Failed to load Dashboard</h3>
                <p className="text-slate-500 text-sm max-w-sm text-center">There was a problem communicating with the server. Please check your connection and try again.</p>
                <Button onClick={loadDashboardData} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-xl shadow-md">
                    Try Again
                </Button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
        { id: 'statistics' as const, label: 'Statistics', icon: Activity },
    ];

    // Overview tab data
    const overviewCards = [
        {
            title: "Total Appointments",
            value: stats.totalAppointments,
            desc: "All-time bookings",
            icon: Calendar,
            gradient: "from-blue-500 to-blue-600",
        },
        {
            title: "Total Revenue",
            value: `₹${stats.totalRevenue?.toLocaleString?.() || stats.totalRevenue}`,
            desc: "Collected payments",
            icon: IndianRupee,
            gradient: "from-emerald-500 to-teal-500",
        },
        {
            title: "Active Doctors",
            value: stats.activeDoctors,
            desc: "On-duty clinicians",
            icon: Stethoscope,
            gradient: "from-indigo-500 to-violet-500",
        },
        {
            title: "Emergency Cases",
            value: stats.emergencyCases,
            desc: "Urgent red alerts",
            icon: AlertTriangle,
            gradient: "from-rose-500 to-red-500",
        },
        {
            title: "Pending Bills",
            value: stats.pendingPayments,
            desc: "Awaiting checkout",
            icon: CreditCard,
            gradient: "from-amber-500 to-orange-500",
        },
        {
            title: "Reminders",
            value: stats.medicineReminders,
            desc: "Notification logs",
            icon: Bell,
            gradient: "from-teal-500 to-cyan-500",
        }
    ];

    // Statistics tab data - today's operational stats
    const todayStats = [
        {
            title: "Today's Appointments",
            value: stats.todayAppointments,
            desc: "Scheduled for today",
            icon: CalendarCheck,
            gradient: "from-blue-500 to-indigo-600",
            bgGlow: "bg-blue-500/10",
        },
        {
            title: "Queue Active",
            value: stats.queueLength,
            desc: "Patients checked in",
            icon: ListChecks,
            gradient: "from-violet-500 to-purple-600",
            bgGlow: "bg-violet-500/10",
        },
        {
            title: "Completed Today",
            value: stats.completedToday,
            desc: "Sessions done",
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-green-600",
            bgGlow: "bg-emerald-500/10",
        },
        {
            title: "Today's Revenue",
            value: `₹${stats.todayRevenue?.toLocaleString?.() || stats.todayRevenue}`,
            desc: "Collected today",
            icon: IndianRupee,
            gradient: "from-amber-500 to-orange-500",
            bgGlow: "bg-amber-500/10",
        },
    ];

    const systemCards = [
        {
            title: "Active Doctors",
            value: stats.activeDoctors,
            icon: Stethoscope,
            gradient: "from-indigo-500 to-blue-600",
        },
        {
            title: "Active Slots",
            value: stats.activeSlots,
            icon: Clock,
            gradient: "from-teal-500 to-cyan-600",
        },
        {
            title: "Total Patients",
            value: stats.totalPatients,
            icon: Users,
            gradient: "from-pink-500 to-rose-600",
        },
        {
            title: "Confirmed",
            value: stats.confirmedAppointments,
            icon: UserCheck,
            gradient: "from-green-500 to-emerald-600",
        },
    ];

    return (
        <div className="flex-1 space-y-6">
            {/* Gradient Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 p-6 text-white shadow-xl mx-6 mt-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="absolute top-12 right-20 w-6 h-6 bg-white/10 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <ShieldCheck className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-[2px] font-bold text-white/50 block">Admin Console</span>
                            <h1 className="text-2xl font-bold leading-tight">SwasthSetu Admin</h1>
                            <p className="text-xs text-blue-100/60 font-medium mt-0.5">Clinical operations & financial overview</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => { logout(); router.push('/login'); }}
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-white rounded-2xl cursor-pointer border border-white/10 text-xs font-semibold"
                    >
                        <LogOut className="h-4 w-4 mr-1.5" />
                        Sign Out
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6">
                <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200/50'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <tab.icon className="h-3.5 w-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
                <>
                    {/* Metrics cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 px-6 animate-stagger">
                        {overviewCards.map((card, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}>
                                        <card.icon className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">{card.value}</h3>
                                <p className="text-[10px] text-slate-400 font-medium">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid lg:grid-cols-3 gap-6 px-6 pb-8">
                        
                        {/* Revenue line chart */}
                        <Card className="lg:col-span-2 border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b bg-slate-50/50">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-blue-500" />
                                    </div>
                                    Revenue Trends
                                </CardTitle>
                                <CardDescription className="text-xs">Daily collection data (last 7 days)</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 h-72">
                                {revenueData.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-2">
                                        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                                            <BarChart3 className="h-7 w-7 text-blue-300" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">No financial data found yet.</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRevenueFill" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorRevenueStroke" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#3B82F6" />
                                                    <stop offset="100%" stopColor="#14B8A6" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                            <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} unit="₹" />
                                            <Tooltip 
                                                contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                                labelStyle={{ fontWeight: 'bold', color: '#1E293B' }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="url(#colorRevenueStroke)" strokeWidth={3} fill="url(#colorRevenueFill)" dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Operations Summary */}
                        <Card className="border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b bg-slate-50/50">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <BarChart3 className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    Efficiency
                                </CardTitle>
                                <CardDescription className="text-xs">Today's operational breakdown</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5 text-xs">
                                <div className="space-y-2">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-500">Confirmed Bookings</span>
                                        <span className="text-slate-800">{stats.confirmedAppointments} / {stats.totalAppointments}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-teal-500 h-full rounded-full transition-all duration-500" 
                                            style={{ width: `${stats.totalAppointments > 0 ? (stats.confirmedAppointments / stats.totalAppointments) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-500">Pending Billing</span>
                                        <span className="text-slate-800">{stats.pendingPayments} / {stats.totalAppointments}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500" 
                                            style={{ width: `${stats.totalAppointments > 0 ? (stats.pendingPayments / stats.totalAppointments) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-500">Emergency Cases</span>
                                        <span className="text-slate-800">{stats.emergencyCases} Cases</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-rose-500 to-red-500 h-full rounded-full transition-all duration-500" 
                                            style={{ width: `${stats.totalAppointments > 0 ? (stats.emergencyCases / stats.totalAppointments) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {/* ===== STATISTICS TAB ===== */}
            {activeTab === 'statistics' && (
                <div className="space-y-6 px-6 pb-8">
                    
                    {/* Section: Today's Operations */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Today's Operations</h2>
                                <p className="text-[10px] text-slate-400 font-medium">Real-time clinic metrics</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {todayStats.map((card, index) => (
                                <div 
                                    key={index} 
                                    className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                                >
                                    {/* Background glow effect */}
                                    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${card.bgGlow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}>
                                                <card.icon className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{card.value}</h3>
                                        <p className="text-[11px] font-bold text-slate-500 mt-1">{card.title}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: System Overview */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Activity className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800">System Overview</h2>
                                <p className="text-[10px] text-slate-400 font-medium">Infrastructure & capacity metrics</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {systemCards.map((card, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}>
                                            <card.icon className="h-4.5 w-4.5 text-white" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{card.title}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{card.value}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Capacity Gauges */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Today's Progress */}
                        <Card className="border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b bg-slate-50/50">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    Today's Progress
                                </CardTitle>
                                <CardDescription className="text-xs">Appointment completion & queue status</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5 text-xs">
                                <div className="space-y-2">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-500">Checked-in Queue</span>
                                        <span className="text-slate-800">{stats.queueLength} of {stats.todayAppointments} expected</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-700" 
                                            style={{ width: `${stats.todayAppointments > 0 ? (stats.queueLength / stats.todayAppointments) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-500">Completed Sessions</span>
                                        <span className="text-slate-800">{stats.completedToday} of {stats.todayAppointments} scheduled</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full transition-all duration-700" 
                                            style={{ width: `${stats.todayAppointments > 0 ? (stats.completedToday / stats.todayAppointments) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-500">Revenue Collected</span>
                                        <span className="text-slate-800">₹{stats.todayRevenue?.toLocaleString?.() || stats.todayRevenue}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700" 
                                            style={{ width: `${stats.totalRevenue > 0 ? Math.min((stats.todayRevenue / stats.totalRevenue) * 100 * 10, 100) : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Summary Grid */}
                        <Card className="border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b bg-slate-50/50">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <BarChart3 className="h-4 w-4 text-blue-500" />
                                    </div>
                                    All-Time Summary
                                </CardTitle>
                                <CardDescription className="text-xs">Cumulative clinic performance</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50/60 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-black text-blue-700">{stats.totalAppointments}</p>
                                        <p className="text-[10px] text-blue-500 font-bold mt-1">Total Bookings</p>
                                    </div>
                                    <div className="bg-emerald-50/60 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-black text-emerald-700">₹{stats.totalRevenue?.toLocaleString?.() || stats.totalRevenue}</p>
                                        <p className="text-[10px] text-emerald-500 font-bold mt-1">Total Revenue</p>
                                    </div>
                                    <div className="bg-violet-50/60 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-black text-violet-700">{stats.totalPatients}</p>
                                        <p className="text-[10px] text-violet-500 font-bold mt-1">Registered Patients</p>
                                    </div>
                                    <div className="bg-rose-50/60 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-black text-rose-700">{stats.emergencyCases}</p>
                                        <p className="text-[10px] text-rose-500 font-bold mt-1">Emergency Cases</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
