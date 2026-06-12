'use client';

import React from 'react';
import AIChatBox from '@/components/AIChatBox';

export default function AppChatPage() {
    return (
        <div className="absolute top-16 bottom-[88px] left-0 right-0 z-20 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950">
            <AIChatBox className="h-full border-none shadow-none rounded-none bg-transparent dark:bg-transparent" />
        </div>
    );
}
