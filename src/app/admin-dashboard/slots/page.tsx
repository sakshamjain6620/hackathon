'use client';

import React, { useState, useEffect, useMemo } from 'react';
import API from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Trash2, Plus, Edit, Users, Activity, CheckCircle2 } from 'lucide-react';

export default function SlotManagementPage() {
    const [slots, setSlots] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filterDate, setFilterDate] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        doctor_id: '',
        slot_date: '',
        slot_time: '',
        max_patients: 10
    });

    const fetchData = async () => {
        try {
            const [slotsRes, doctorsRes] = await Promise.all([
                API.get('/admin/slots'),
                API.get('/doctors')
            ]);
            setSlots(slotsRes.data.data || []);
            setDoctors(doctorsRes.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load slots data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post('/admin/slots', formData);
            toast.success("Slot created successfully");
            setIsCreateOpen(false);
            setFormData({ doctor_id: '', slot_date: '', slot_time: '', max_patients: 10 });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create slot");
        }
    };

    const handleDeleteSlot = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slot?")) return;
        try {
            await API.delete(`/admin/slots/${id}`);
            toast.success("Slot deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete slot");
        }
    };

    // Derived states
    const filteredSlots = useMemo(() => {
        return slots.filter((s: any) => {
            const matchDate = filterDate ? s.slot_date === filterDate : true;
            const matchDoc = filterDoctor ? s.doctor_id === filterDoctor : true;
            return matchDate && matchDoc;
        });
    }, [slots, filterDate, filterDoctor]);

    const stats = useMemo(() => {
        let totalSlots = 0;
        let totalBooked = 0;
        let totalRemaining = 0;
        const availableDocs = new Set();

        filteredSlots.forEach((s: any) => {
            totalSlots += s.max_patients || 0;
            totalBooked += s.booked_slots || 0;
            totalRemaining += s.remaining_slots || 0;
            if (s.is_active && s.remaining_slots > 0) {
                availableDocs.add(s.doctor_id);
            }
        });

        return {
            totalSlots,
            totalBooked,
            totalRemaining,
            availableDoctorsCount: availableDocs.size
        };
    }, [filteredSlots]);

    if (isLoading) {
        return <div className="p-8">Loading slot management...</div>;
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Slot Management Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time view of doctor capacities and bookings.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(!isCreateOpen)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Create Slot
                </Button>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Capacity</p>
                        <h4 className="text-xl font-bold text-slate-800">{stats.totalSlots} Patients</h4>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Booked</p>
                        <h4 className="text-xl font-bold text-slate-800">{stats.totalBooked} Patients</h4>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Remaining Slots</p>
                        <h4 className="text-xl font-bold text-slate-800">{stats.totalRemaining} Available</h4>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Available Doctors</p>
                        <h4 className="text-xl font-bold text-slate-800">{stats.availableDoctorsCount} Doctors</h4>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-slate-600">Filter by Date:</label>
                    <input 
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border border-slate-300 rounded-md p-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-slate-600">Filter by Doctor:</label>
                    <select
                        value={filterDoctor}
                        onChange={(e) => setFilterDoctor(e.target.value)}
                        className="border border-slate-300 rounded-md p-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 min-w-[200px]"
                    >
                        <option value="">All Doctors</option>
                        {doctors.map((d: any) => (
                            <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                        ))}
                    </select>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setFilterDate(''); setFilterDoctor(''); }}>
                    Clear Filters
                </Button>
            </div>

            {isCreateOpen && (
                <div className="bg-white p-6 rounded-xl border mb-8 shadow-sm">
                    <h2 className="font-bold text-lg mb-4">Create New Slot</h2>
                    <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Doctor</label>
                            <select 
                                required
                                value={formData.doctor_id}
                                onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm"
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map((d: any) => (
                                    <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Date</label>
                            <input 
                                type="date" required
                                value={formData.slot_date}
                                onChange={(e) => setFormData({...formData, slot_date: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Time (HH:MM)</label>
                            <input 
                                type="time" required
                                value={formData.slot_time}
                                onChange={(e) => setFormData({...formData, slot_time: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Max Capacity</label>
                            <input 
                                type="number" min="1" required
                                value={formData.max_patients}
                                onChange={(e) => setFormData({...formData, max_patients: Number(e.target.value)})}
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                        </div>
                        <Button type="submit" className="md:col-span-4 bg-emerald-600 hover:bg-emerald-700">Save Slot</Button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Doctor</th>
                            <th className="p-4 font-semibold text-slate-600">Date & Time</th>
                            <th className="p-4 font-semibold text-slate-600 text-center">Capacity</th>
                            <th className="p-4 font-semibold text-slate-600 text-center">Booked</th>
                            <th className="p-4 font-semibold text-slate-600 text-center">Remaining</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredSlots.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-500">No slots found for the selected filters.</td></tr>
                        ) : filteredSlots.map((slot: any) => (
                            <tr key={slot.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-medium">
                                    Dr. {slot.doctor_name}
                                    <div className="text-xs text-slate-400 font-normal">{slot.doctor_specialization}</div>
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="font-semibold text-slate-700">{slot.slot_date}</div>
                                    <div className="text-xs text-slate-500">{slot.slot_time}</div>
                                </td>
                                <td className="p-4 text-center font-semibold text-slate-600">{slot.max_patients}</td>
                                <td className="p-4 text-center font-bold text-amber-600">{slot.booked_slots || 0}</td>
                                <td className="p-4 text-center font-bold text-emerald-600">{slot.remaining_slots || 0}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                                        slot.slot_status === 'Open' ? 'bg-emerald-100 text-emerald-700' :
                                        slot.slot_status === 'Full' ? 'bg-rose-100 text-rose-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {slot.slot_status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleDeleteSlot(slot.id)}
                                        className="text-rose-500 hover:bg-rose-50 p-2 rounded-md transition-colors"
                                        title="Delete Slot"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
