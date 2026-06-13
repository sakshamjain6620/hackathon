'use client';

import React, { useState } from 'react';
import API from '@/lib/api';
import { Pill, CheckCircle2, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RoutineItem {
    id: string;
    medicine_name: string;
    dosage: string;
    timing: string;
    routine_date: string;
    routine_time: string;
    status: 'pending' | 'taken' | 'missed' | 'completed';
    instructions?: string;
    before_after_food?: string;
    prescription_id: string;
}

interface MedicineRoutineTableProps {
    routines: RoutineItem[];
    onRefresh: () => void;
}

// Group routines by medicine name + prescription_id
function groupByMedicine(routines: RoutineItem[]) {
    const groups: Record<string, RoutineItem[]> = {};
    routines.forEach(r => {
        const key = `${r.prescription_id}::${r.medicine_name}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
    });
    return groups;
}

// Get unique sorted dates from a group
function getUniqueDates(items: RoutineItem[]) {
    return [...new Set(items.map(r => r.routine_date))].sort();
}

// Get unique timings from a group
function getUniqueTimings(items: RoutineItem[]) {
    const order = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const timings = [...new Set(items.map(r => r.routine_time))];
    return timings.sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

const TIMING_ICONS: Record<string, string> = {
    Morning: '🌅', Afternoon: '☀️', Evening: '🌆', Night: '🌙'
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.getDate() };
}

export default function MedicineRoutineTable({ routines, onRefresh }: MedicineRoutineTableProps) {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleMarkTaken = async (routineId: string) => {
        setLoadingMap(prev => ({ ...prev, [routineId]: true }));
        try {
            await API.put(`/medicines/routine/${routineId}/take`);
            toast.success('Dose logged! ✅');
            onRefresh();
        } catch {
            toast.error('Failed to log dose. Try again.');
        } finally {
            setLoadingMap(prev => ({ ...prev, [routineId]: false }));
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    // Today's quick-check section
    const todaysRoutines = routines.filter(r => r.routine_date === todayStr);
    const takenToday = todaysRoutines.filter(r => r.status === 'taken' || r.status === 'completed').length;
    const progress = todaysRoutines.length > 0 ? Math.round((takenToday / todaysRoutines.length) * 100) : 0;

    const groups = groupByMedicine(routines);

    if (routines.length === 0) return null;

    return (
        <div className="space-y-5">
            {/* Today's check-in card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                            <Pill className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Today's Doses</h3>
                            <p className="text-[11px] font-medium text-slate-500">{takenToday} of {todaysRoutines.length} taken</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-blue-600">{progress}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>

                {todaysRoutines.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-4 text-slate-400">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                        <p className="text-xs font-medium">No medicines scheduled for today!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {todaysRoutines.map(item => {
                            const isDone = item.status === 'taken' || item.status === 'completed';
                            const isMissed = item.status === 'missed';
                            return (
                                <div key={item.id} className={cn(
                                    "p-3 rounded-2xl border flex items-center gap-3 transition-all",
                                    isDone && "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800",
                                    isMissed && "bg-rose-50/70 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800",
                                    !isDone && !isMissed && "bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700"
                                )}>
                                    {isMissed ? (
                                        <XCircle className="h-6 w-6 text-rose-400 shrink-0" />
                                    ) : (
                                        <Checkbox
                                            checked={isDone}
                                            disabled={isDone || loadingMap[item.id]}
                                            onCheckedChange={() => handleMarkTaken(item.id)}
                                            className="h-6 w-6 rounded-full border-2 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn("font-bold text-sm", isDone && "line-through text-slate-400", isMissed && "text-rose-600")}>
                                                {item.medicine_name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 text-[11px] font-medium text-slate-500">
                                            <span>{TIMING_ICONS[item.routine_time]} {item.routine_time}</span>
                                            <span>·</span><span>{item.dosage}</span>
                                            {item.before_after_food && <><span>·</span><span className="text-blue-500">{item.before_after_food}</span></>}
                                        </div>
                                    </div>
                                    {loadingMap[item.id] && <Loader2 className="h-4 w-4 animate-spin text-blue-400 shrink-0" />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Per-medicine course progress grids */}
            {Object.entries(groups).map(([key, items]) => {
                const medicineName = items[0].medicine_name;
                const dates = getUniqueDates(items);
                const timings = getUniqueTimings(items);
                const totalDoses = items.length;
                const takenDoses = items.filter(r => r.status === 'taken' || r.status === 'completed').length;
                const courseProgress = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

                return (
                    <div key={key} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100/80 dark:border-slate-800">
                        {/* Medicine header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                    <Pill className="h-4 w-4 text-violet-500" /> {medicineName}
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    {items[0].dosage} · {timings.join(' + ')} · {dates.length} days
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-black text-violet-600">{courseProgress}%</div>
                                <div className="text-[10px] text-slate-400">{takenDoses}/{totalDoses} doses</div>
                            </div>
                        </div>

                        {/* Course progress bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                            <div className="bg-violet-500 h-full rounded-full transition-all duration-500" style={{ width: `${courseProgress}%` }} />
                        </div>

                        {/* Day-by-day grid */}
                        <div className="overflow-x-auto pb-1 -mx-1 px-1">
                            <div className="min-w-max">
                                {/* Header row: Day labels */}
                                <div className={cn("grid gap-1.5 mb-1.5")} style={{ gridTemplateColumns: `80px repeat(${dates.length}, 44px)` }}>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-end pb-1">Timing</div>
                                    {dates.map(dateStr => {
                                        const { day, date } = formatDate(dateStr);
                                        const isToday = dateStr === todayStr;
                                        return (
                                            <div key={dateStr} className={cn("text-center rounded-lg py-1", isToday && "bg-blue-50")}>
                                                <div className={cn("text-[9px] font-bold uppercase", isToday ? "text-blue-600" : "text-slate-400")}>{day}</div>
                                                <div className={cn("text-sm font-black leading-tight", isToday ? "text-blue-700" : "text-slate-600")}>{date}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Rows per timing */}
                                {timings.map(timing => (
                                    <div key={timing} className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: `80px repeat(${dates.length}, 44px)` }}>
                                        {/* Timing label */}
                                        <div className="flex items-center gap-1 pr-2">
                                            <span className="text-sm">{TIMING_ICONS[timing]}</span>
                                            <span className="text-[10px] font-semibold text-slate-500">{timing}</span>
                                        </div>

                                        {/* Status cell per date */}
                                        {dates.map(dateStr => {
                                            const routine = items.find(r => r.routine_date === dateStr && r.routine_time === timing);
                                            if (!routine) {
                                                return <div key={dateStr} className="h-10 w-10 rounded-xl bg-slate-50 border border-dashed border-slate-200 mx-auto" />;
                                            }
                                            const isDone = routine.status === 'taken' || routine.status === 'completed';
                                            const isMissed = routine.status === 'missed';
                                            const isPending = routine.status === 'pending';
                                            const isLoading = loadingMap[routine.id];
                                            const canCheck = isPending && routine.routine_date <= todayStr;

                                            return (
                                                <div key={dateStr} className="flex items-center justify-center">
                                                    <button
                                                        disabled={!canCheck || isLoading || isDone}
                                                        onClick={() => canCheck && handleMarkTaken(routine.id)}
                                                        className={cn(
                                                            "h-10 w-10 rounded-xl flex items-center justify-center transition-all border text-sm",
                                                            isDone && "bg-emerald-100 border-emerald-200 text-emerald-600",
                                                            isMissed && "bg-rose-100 border-rose-200 text-rose-500",
                                                            canCheck && !isDone && "bg-white border-blue-200 hover:bg-blue-50 cursor-pointer hover:scale-105",
                                                            !canCheck && isPending && "bg-slate-50 border-dashed border-slate-200 text-slate-300 cursor-default",
                                                        )}
                                                        title={isDone ? 'Taken ✅' : isMissed ? 'Missed ❌' : canCheck ? 'Mark as taken' : 'Upcoming'}
                                                    >
                                                        {isLoading
                                                            ? <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                                            : isDone ? <CheckCircle2 className="h-5 w-5" />
                                                            : isMissed ? <XCircle className="h-4 w-4" />
                                                            : canCheck ? <Clock className="h-4 w-4 text-blue-400" />
                                                            : <span className="text-xs">·</span>}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-[10px] text-slate-500 font-medium">Taken</span></div>
                            <div className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-rose-400" /><span className="text-[10px] text-slate-500 font-medium">Missed</span></div>
                            <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-400" /><span className="text-[10px] text-slate-500 font-medium">Due today</span></div>
                            <div className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded border border-dashed border-slate-300 inline-block" /><span className="text-[10px] text-slate-500 font-medium">Upcoming</span></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
