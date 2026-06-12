'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import API from '@/lib/api';
import { toast } from 'sonner';
import { Send, Sparkles, User, CalendarDays, CreditCard, Bot, Stethoscope, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProfileAvatar } from '@/components/app/ProfileAvatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AIChatBox({ className }: { className?: string }) {
    const router = useRouter();
    const { user, token, chatMessages, addChatMessage, booking, updateBooking, clearChat, resetBooking } = useAppStore();
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // States for booking sub-interfaces in chat
    const [slotsData, setSlotsData] = useState<any[]>([]);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);
    const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(undefined);

    // Auto Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isTyping]);

    // Fetch slots when doctor and date are selected
    const fetchSlots = async (doctorId: string, dateStr: string) => {
        setIsSlotsLoading(true);
        try {
            const res = await API.get(`/doctors/${doctorId}/slots?date=${dateStr}`);
            setSlotsData(res.data.data.slots || []);
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to load doctor slots.');
        } finally {
            setIsSlotsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        
        // Handle Cancel command
        if (userMsg.toLowerCase() === 'cancel') {
            clearChat();
            resetBooking();
            return;
        }

        addChatMessage({
            sender: 'user',
            text: userMsg,
            timestamp: new Date()
        });

        setIsTyping(true);
        try {
            // Call AI Symptom Chat endpoint
            const res = await API.post('/ai/chat', { message: userMsg });
            console.log('🟢 AI API response:', res.data);
            const aiData = res.data.data;

            // Prepare chat message with proper fields
            const newAiMessage = {
                sender: 'ai' as const,
                text: aiData.message,
                timestamp: new Date(),
                actionHint: aiData.actionHint,
                // Preserve any additional structured data for UI components
                data: aiData,
            };
            addChatMessage(newAiMessage);

            // Update booking details if additional data is provided
            if (aiData.specialization || aiData.urgency || aiData.recommendedDoctors) {
                updateBooking({
                    symptoms: userMsg,
                    ...(aiData.urgency && { urgency: aiData.urgency }),
                    ...(aiData.specialization && { specialization: aiData.specialization }),
                    ...(aiData.recommendedDoctors && { recommendedDoctors: aiData.recommendedDoctors })
                });
            }
        } catch (err) {
            console.error(err);
            toast.error('AI agent encountered a problem. Please try again.');
        } finally {
            setIsTyping(false);
        }
    };

    // Doctor Selection
    const handleSelectDoctor = (doctor: any) => {
        updateBooking({ selectedDoctor: doctor });
        
        addChatMessage({
            sender: 'user',
            text: `I want to book an appointment with Dr. ${doctor.name}.`,
            timestamp: new Date()
        });

        addChatMessage({
            sender: 'ai',
            text: `Perfect! Dr. ${doctor.name} is selected. Please pick a date and slot for your consultation:`,
            timestamp: new Date(),
            actionHint: 'select_slot'
        });
    };

    // Date Picker trigger
    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;
        setSelectedDateObj(date);
        const dateStr = format(date, 'yyyy-MM-dd');
        updateBooking({ selectedDate: dateStr, selectedSlot: '' }); // Reset slot
        
        if (booking.selectedDoctor) {
            fetchSlots(booking.selectedDoctor.id, dateStr);
        }
    };

    // Slot Selection
    const handleSelectSlot = (slotTime: string) => {
        updateBooking({ selectedSlot: slotTime });

        addChatMessage({
            sender: 'user',
            text: `I select the slot on ${booking.selectedDate} at ${slotTime}.`,
            timestamp: new Date()
        });

        addChatMessage({
            sender: 'ai',
            text: `Great. Please verify your contact details below to proceed with the booking:`,
            timestamp: new Date(),
            actionHint: 'patient_form'
        });
    };

    // Details Form Submit
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const age = formData.get('age') as string;
        const gender = formData.get('gender') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const address = formData.get('address') as string;
        
        if (!name || !age || !gender || !phone || !email) {
            toast.warning('Please fill all required fields');
            return;
        }

        const patientForm = { name, age, gender, phone, email, address, emergencyContact: '' };
        updateBooking({ patientForm });

        addChatMessage({
            sender: 'user',
            text: `My contact details: ${name}, ${age}yo ${gender}, Ph: ${phone}.`,
            timestamp: new Date()
        });

        // Trigger pending appointment creation
        createAppointment(patientForm);
    };

    const createAppointment = async (patientForm: any) => {
        if (!token) {
            addChatMessage({
                sender: 'ai',
                text: "Please sign in or register to complete your appointment booking. You will be redirected to the login page.",
                timestamp: new Date(),
                actionHint: 'redirect_login'
            });
            return;
        }

        setIsTyping(true);
        try {
            // Create pending appointment
            const res = await API.post('/appointments', {
                doctorId: booking.selectedDoctor.id,
                appointmentDate: booking.selectedDate,
                appointmentTime: booking.selectedSlot,
                symptoms: booking.symptoms,
                urgencyLevel: booking.urgency,
                aiSummary: `AI diagnosed specialization: ${booking.specialization}. Symptoms: ${booking.symptoms}. Contact: ${patientForm.phone}.`,
                amount: booking.selectedDoctor.fee
            });

            const appDetails = res.data.data;
            updateBooking({ pendingAppointment: appDetails });

            setIsTyping(false);
            addChatMessage({
                sender: 'ai',
                text: `Pending appointment registered! Order receipt generated. Total fee: ₹${booking.selectedDoctor.fee}. Please click the button below to pay and confirm.`,
                timestamp: new Date(),
                actionHint: 'checkout_payment'
            });

        } catch (err: any) {
            console.error(err);
            setIsTyping(false);
            toast.error(err.response?.data?.message || 'Failed to create booking.');
        }
    };

    // Razorpay checkout
    const handleCheckout = async () => {
        console.log('--- handleCheckout Init ---');
        console.log('Pending Appointment State:', booking.pendingAppointment);

        const appointmentId = booking.pendingAppointment?.appointment?.id || 
                              booking.pendingAppointment?.razorpay?.appointment_id || 
                              booking.pendingAppointment?.id;
        
        console.log('Resolved appointmentId:', appointmentId);
        
        if (!appointmentId) {
            console.error('Checkout Error: appointmentId is missing from pendingAppointment object');
            toast.error('Invalid appointment context. Please try booking again.');
            return;
        }

        try {
            console.log('Calling API to create Razorpay order with appointmentId:', appointmentId);
            // 1. Create order
            const res = await API.post('/payments/create-order', { appointmentId });
            console.log('Create order API Response:', res.data);
            
            const orderData = res.data.data;
            if (!orderData || !orderData.order_id) {
                console.error('Checkout Error: API did not return valid order_id', orderData);
                toast.error('Failed to generate payment order from server.');
                return;
            }

            console.log('Loading Razorpay script...');
            // Load Razorpay script if not loaded
            const loadScript = (src: string) => {
                return new Promise((resolve) => {
                    if (document.querySelector(`script[src="${src}"]`)) {
                        console.log('Razorpay script already present in DOM.');
                        resolve(true);
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            console.log('Razorpay script loaded status:', isLoaded);

            if (!isLoaded) {
                console.error('Checkout Error: Razorpay script failed to load');
                toast.error('Failed to load payment gateway. Check network.');
                return;
            }

            if (!(window as any).Razorpay) {
                console.error('Checkout Error: window.Razorpay is undefined after script load');
                toast.error('Payment gateway initialization failed.');
                return;
            }

            console.log('Initializing Razorpay checkout window options...');
            // 2. Open checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'SwasthSetu Health',
                description: `Appointment Consultation Fee`,
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    console.log('Razorpay Payment Success Callback Triggered!');
                    console.log('Razorpay response:', response);
                    // 3. Verify Payment
                    try {
                        console.log('Calling API to verify payment signature...');
                        const verifyRes = await API.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            appointmentId: orderData.appointment_id || appointmentId
                        });
                        console.log('Verification Response:', verifyRes.data);

                        toast.success('Payment completed successfully!');
                        
                        addChatMessage({
                            sender: 'ai',
                            text: `🎉 Payment successful! Your appointment is confirmed (Token No: ${verifyRes.data.data.tokenNo}). Check the details below or in your records.`,
                            timestamp: new Date()
                        });

                        resetBooking();

                        router.push(`/confirmation?id=${orderData.appointment_id || appointmentId}`);
                    } catch (e: any) {
                        console.error('Payment Verification API Error:', e);
                        toast.error('Payment verification failed.');
                    }
                },
                prefill: {
                    name: booking.patientForm?.name,
                    email: booking.patientForm?.email,
                    contact: booking.patientForm?.phone
                },
                theme: {
                    color: '#2563EB' // blue color theme
                }
            };

            console.log('Creating Razorpay instance with options:', options);
            const rzp = new (window as any).Razorpay(options);
            
            rzp.on('payment.failed', function (response: any) {
                console.error('Razorpay Payment Failed Event:', response.error);
                toast.error(`Payment failed: ${response.error.description}`);
            });

            console.log('Opening Razorpay UI...');
            rzp.open();

        } catch (err: any) {
            console.error('Checkout Exception caught:', err);
            toast.error(err.response?.data?.message || 'Payment checkout failed. Please try again.');
        }
    };

    return (
        <div className={cn("flex flex-col flex-1 min-h-0 bg-slate-50/50 dark:bg-slate-900/10 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative", className)}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                        <Sparkles className="h-5 w-5 drop-shadow-sm" />
                    </div>
                    <div>
                        <h2 className="font-bold text-[15px] leading-none flex items-center gap-2 drop-shadow-sm">
                            Foundry AI 
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        </h2>
                        <span className="text-[10px] text-blue-100 font-medium">Smart Healthcare Agent</span>
                    </div>
                </div>
            </div>

            {/* Message Pane */}
            <ScrollArea className="flex-1 min-h-0 p-4 md:p-6 bg-transparent">
                <div className="space-y-6 max-w-3xl mx-auto pb-6">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className={cn("flex items-end gap-3", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
                                <div className="shrink-0 mb-1">
                                    {msg.sender === 'user' ? (
                                        <ProfileAvatar name={user?.name || 'User'} size="sm" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-[1.5rem] max-w-[85%] text-[13.5px] leading-relaxed shadow-sm transition-all relative overflow-hidden",
                                    msg.sender === 'user'
                                        ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-600 text-white rounded-br-sm shadow-blue-500/20"
                                        : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-100 dark:border-slate-700/50"
                                )}>
                                    {msg.sender === 'user' && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                                    )}
                                    <p className="whitespace-pre-line relative z-10">{msg.text}</p>
                                </div>
                            </div>

                            {/* Render Inline Interfaces depending on the Action Hint */}
                            {msg.sender === 'ai' && msg.actionHint === 'select_doctor' && msg.data?.recommendedDoctors && (
                                <div className="ml-11 mr-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {msg.data.recommendedDoctors.map((doc: any) => (
                                        <div key={doc.id} className="p-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col gap-3 group hover:border-blue-300 dark:hover:border-blue-500/50 transition-all">
                                            <div className="flex gap-3">
                                                <ProfileAvatar name={doc.name} size="md" />
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">Dr. {doc.name}</h4>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{doc.specialization}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.experience} Years Exp.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                                                    <Stethoscope className="h-3 w-3" />
                                                    ₹{doc.fee}
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleSelectDoctor(doc)}
                                                    className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg h-8 text-xs px-4"
                                                >
                                                    Select
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {msg.sender === 'ai' && msg.actionHint === 'select_slot' && booking.selectedDoctor && (
                                <div className="ml-11 mr-4 mt-2 p-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm max-w-sm space-y-4">
                                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">Pick a Date & Time</h4>
                                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Dr. {booking.selectedDoctor.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Popover>
                                            <PopoverTrigger className="w-full flex items-center justify-between font-medium cursor-pointer bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl h-11 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 px-4">
                                                {selectedDateObj ? format(selectedDateObj, 'PPP') : <span className="text-slate-400">Select Date...</span>}
                                                <CalendarDays className="h-4 w-4 text-slate-400" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDateObj}
                                                    onSelect={handleDateChange}
                                                    disabled={(date) => {
                                                        const today = new Date();
                                                        today.setHours(0,0,0,0);
                                                        return date < today;
                                                    }}
                                                    className="bg-white rounded-2xl"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {booking.selectedDate && (
                                        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-2 mb-2">Available Slots</span>
                                            {isSlotsLoading ? (
                                                <p className="text-xs text-slate-400 flex items-center gap-2"><Sparkles className="h-3 w-3 animate-spin"/> Loading...</p>
                                            ) : slotsData.length === 0 ? (
                                                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">No slots available for this day. Fully booked.</p>
                                            ) : (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {slotsData.map((slot) => (
                                                        <Button
                                                            key={slot.time}
                                                            variant={slot.isFull ? "ghost" : "outline"}
                                                            disabled={slot.isFull}
                                                            onClick={() => handleSelectSlot(slot.time)}
                                                            className={cn(
                                                                "h-12 flex flex-col items-center justify-center cursor-pointer rounded-xl transition-all border",
                                                                slot.isFull 
                                                                    ? "opacity-30 line-through bg-slate-50" 
                                                                    : "border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
                                                            )}
                                                        >
                                                            <span className="text-[12px] font-bold">{slot.time}</span>
                                                            <span className="text-[9px] font-medium text-slate-500">{slot.available} Left</span>
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {msg.sender === 'ai' && msg.actionHint === 'patient_form' && (
                                <form onSubmit={handleFormSubmit} className="ml-11 mr-4 mt-2 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm max-w-sm space-y-4">
                                    <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Patient Details</h4>
                                        <p className="text-[10px] text-slate-500">Please verify information for booking</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                                            <Input name="name" defaultValue={user?.name || ''} className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Age</label>
                                                <Input name="age" placeholder="e.g. 28" className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Gender</label>
                                                <Input name="gender" placeholder="e.g. Male" className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Mobile Number</label>
                                            <Input name="phone" defaultValue={user?.phone || ''} className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                                            <Input name="email" type="email" defaultValue={user?.email || ''} className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20" />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 rounded-xl shadow-md shadow-blue-500/20">
                                        Confirm Details
                                    </Button>
                                </form>
                            )}

                            {msg.sender === 'ai' && msg.actionHint === 'redirect_login' && (
                                <div className="ml-11 mt-2">
                                    <Link href="/login" className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white h-10 text-xs flex items-center justify-center px-4 w-fit">Go to Login</Link>
                                </div>
                            )}

                            {msg.sender === 'ai' && msg.actionHint === 'checkout_payment' && booking.pendingAppointment && (
                                <div className="ml-11 mr-4 mt-2 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm max-w-sm space-y-4">
                                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">Payment Summary</h4>
                                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Complete booking</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium">Consultation Fee</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">₹{booking.selectedDoctor?.fee}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium">Doctor</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">Dr. {booking.selectedDoctor?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium">Slot</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">{booking.selectedSlot}</span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleCheckout} 
                                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs h-12 rounded-xl shadow-lg shadow-emerald-500/20 group flex items-center justify-between px-5"
                                    >
                                        <span>Pay ₹{booking.selectedDoctor?.fee}</span>
                                        <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* AI typing state */}
                    {isTyping && (
                        <div className="flex items-end gap-3 animate-in fade-in duration-300">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0 mb-1">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="p-4 py-5 rounded-[1.5rem] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-100 dark:border-slate-700/50 rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Form Bar */}
            <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-t border-slate-100/50 dark:border-slate-800/50 z-10 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full p-1.5 pr-2 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all shadow-sm">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe symptoms, or type 'cancel' to restart..."
                        disabled={isTyping}
                        className="flex-1 bg-transparent border-none h-11 px-4 text-[14px] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium placeholder:text-slate-400"
                    />
                    <Button 
                        type="submit" 
                        disabled={isTyping || !input.trim()}
                        size="icon" 
                        className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shrink-0 h-11 w-11 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-blue-500/25 cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <Send className="h-[18px] w-[18px] ml-0.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
