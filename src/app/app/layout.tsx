import React from 'react';
import AppHeader from '@/components/app/AppHeader';
import BottomNav from '@/components/app/BottomNav';
import { MobileContainer } from '@/components/app/MobileContainer';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileContainer>
            <div className="flex flex-col h-full min-h-0 bg-background relative">
                <AppHeader />
                <main className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden w-full scrollbar-none px-4 pt-4 pb-32">
                    {children}
                </main>
                <div className="absolute bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
                    <div className="pointer-events-auto w-full max-w-sm">
                        <BottomNav />
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
}
