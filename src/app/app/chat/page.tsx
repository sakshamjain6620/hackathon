'use client';

import React from 'react';
import AIChatBox from '@/components/AIChatBox';

export default function AppChatPage() {
    return (
        <div className="flex flex-col h-full min-h-0 bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
            <AIChatBox className="h-full border-none shadow-none rounded-none bg-transparent dark:bg-transparent" />
        </div>
    );
}
