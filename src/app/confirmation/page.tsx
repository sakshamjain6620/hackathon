'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import {
  CheckCircle,
  MapPin,
  Activity,
  CalendarDays,
  Clock,
  User,
  CreditCard,
  LayoutDashboard,
  Sparkles,
  PartyPopper,
  MessageCircle,
  Stethoscope,
  Copy,
  Check,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id');

  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      router.push('/');
      return;
    }

    const fetchAppointment = async () => {
      try {
        const res = await API.get(`/appointments/${appointmentId}`);
        setAppointment(res.data.data);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load appointment details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, router]);

  // Show confirmation toast when appointment loads
  useEffect(() => {
    if (appointment) {
      toast.success(
        `🎉 Booking Confirmed! Token #${appointment.token_no || '—'} | Code: ${appointment.appointment_code || 'N/A'}`,
        { duration: 6000 }
      );
    }
  }, [appointment]);

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      toast.success('Appointment Code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      toast.error('Failed to copy code. Please select and copy manually.');
    }
    document.body.removeChild(textArea);
  };

  const handleCopyId = () => {
    if (appointment?.appointment_code) {
      const code = appointment.appointment_code;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          setCopied(true);
          toast.success('Appointment Code copied!');
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => fallbackCopyTextToClipboard(code));
      } else {
        fallbackCopyTextToClipboard(code);
      }
    }
  };

  const truncateId = (id: string, maxLen = 16) => {
    if (!id) return 'N/A';
    return id.length > maxLen ? id.slice(0, maxLen) + '…' : id;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
            <Activity className="h-7 w-7 text-emerald-500 animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full bg-emerald-200/30 animate-ping" />
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Retrieving booking receipt...
        </p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="h-16 w-16 rounded-3xl bg-rose-50 flex items-center justify-center">
          <Activity className="h-8 w-8 text-rose-400" />
        </div>
        <p className="text-rose-500 font-bold text-sm">
          Appointment details not found.
        </p>
        <Button asChild variant="outline" className="rounded-2xl cursor-pointer mt-2">
          <Link href="/app/chat">Book Another</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 flex flex-col">

      {/* ── Sticky Top Bar with Back Button ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100/80">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="h-8 w-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold hidden sm:inline">Back</span>
          </button>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Booking Receipt
          </span>

          <Link
            href="/app/home"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="h-8 w-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
              <Home className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6 sm:py-8">

          {/* ── Success Header ── */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-200/60">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow-sm" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center shadow-md animate-bounce" style={{ animationDuration: '2s' }}>
                <PartyPopper className="h-3 w-3 text-white" />
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-300/20 animate-ping" style={{ animationDuration: '2.5s' }} />
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Booking Confirmed!
            </h1>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mt-2">
              <Sparkles className="h-3 w-3" />
              Payment Successful
            </div>
          </div>

          {/* ── Queue Ticket Card ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 rounded-2xl text-white text-center shadow-xl shadow-blue-300/30 mb-4">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 px-5 pt-5 pb-4">
              <span className="text-[9px] font-bold uppercase tracking-[3px] text-blue-100/60 block mb-1.5">
                Queue Ticket
              </span>

              <h2 className="text-6xl font-black leading-none mb-0.5 drop-shadow-md">
                {appointment.token_no || '—'}
              </h2>

              <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-100/70 block mb-4">
                Token Number
              </span>

              <div className="border-t border-white/20 pt-3 grid grid-cols-2 gap-3">
                <div className="text-left">
                  <span className="text-[9px] text-blue-200/60 font-semibold uppercase tracking-wider block mb-0.5">
                    Consultant
                  </span>
                  <span className="text-[13px] font-bold text-white leading-tight block truncate">
                    Dr. {appointment.doctor_name || 'Assigned'}
                  </span>
                  {appointment.doctor_specialization && (
                    <span className="text-[10px] text-blue-100/50 font-medium block mt-0.5 truncate">
                      {appointment.doctor_specialization}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-blue-200/60 font-semibold uppercase tracking-wider block mb-0.5">
                    Slot Time
                  </span>
                  <span className="text-[13px] font-bold text-white leading-tight block">
                    {appointment.appointment_time || '—'}
                  </span>
                  <span className="text-[10px] text-blue-100/50 font-medium block mt-0.5">
                    {appointment.appointment_date || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Consultation Details Card ── */}
          <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 overflow-hidden mb-4">
            <div className="px-4 sm:px-5 pt-4 pb-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Consultation Details
              </h4>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">
                      Patient
                    </span>
                    <span className="text-[13px] font-bold text-slate-800 truncate block">
                      {appointment.patient_name || 'Patient'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">
                      Date
                    </span>
                    <span className="text-[13px] font-bold text-slate-800 block truncate">
                      {appointment.appointment_date || '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">
                      Time Slot
                    </span>
                    <span className="text-[13px] font-bold text-slate-800 block">
                      {appointment.appointment_time || '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">
                      Amount Paid
                    </span>
                    <span className="text-[13px] font-bold text-slate-800 block">
                      ₹{appointment.amount || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider with receipt tear effect */}
            <div className="relative">
              <div className="h-px bg-slate-100" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 rounded-r-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 rounded-l-full" />
            </div>

            {/* Reference IDs */}
            <div className="px-4 sm:px-5 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block mb-0.5">
                    Appt Code
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] font-semibold text-slate-600 truncate block" title={appointment.appointment_code}>
                      {appointment.appointment_code || truncateId(appointment.id)}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="h-5 w-5 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block mb-0.5">
                    Razorpay ID
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-slate-600 truncate block" title={appointment.razorpay_order_id}>
                    {truncateId(appointment.razorpay_order_id, 18)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Info Cards ── */}
          <div className="space-y-2.5 mb-6">
            {/* Clinic Address */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-3.5 py-3 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Clinic Address
                </span>
                <span className="text-[11px] text-slate-500 leading-relaxed block">
                  SwasthSetu Clinic, 123 Healthcare Avenue, Medical District, Mumbai - 400001
                </span>
              </div>
            </div>

            {/* SMS Notification */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-3.5 py-3 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  SMS Confirmation Sent
                </span>
                <span className="text-[11px] text-slate-500 leading-relaxed block">
                  A confirmation SMS with your appointment code has been sent to your registered phone number.
                </span>
              </div>
            </div>

            {/* Doctor Info */}
            {appointment.doctor_specialization && (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-3.5 py-3 flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <Stethoscope className="h-4 w-4 text-violet-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
                    Your Consultant
                  </span>
                  <span className="text-[11px] text-slate-500 leading-relaxed block">
                    Dr. {appointment.doctor_name} — {appointment.doctor_specialization}. Arrive 10 min before your slot.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 cursor-pointer rounded-xl h-11 border-slate-200 hover:bg-slate-50 font-semibold text-[13px]"
            >
              <Link href="/app/chat">
                Book Another
              </Link>
            </Button>

            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white cursor-pointer rounded-xl h-11 shadow-lg shadow-blue-200/50 font-semibold text-[13px]"
            >
              <Link href="/app/appointments" className="flex items-center justify-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Appointments
              </Link>
            </Button>
          </div>

          {/* Footer text */}
          <p className="text-center text-[10px] text-slate-400 mt-4 mb-2 font-medium">
            A copy of this receipt has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <Activity className="h-7 w-7 text-emerald-500 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-200/30 animate-ping" />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Loading confirmation...
          </p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}