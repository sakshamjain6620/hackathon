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
            <div className="flex flex-col h-full min-h-0 bg-background">
                <AppHeader />
                <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 w-full scrollbar-none pb-4">
                    {children}
                </main>
                {/* Bottom Nav: sits at the bottom of the flex column, never clipped */}
                <div className="shrink-0 w-full flex justify-center px-4 pb-3 pt-1 bg-gradient-to-t from-background via-background/80 to-transparent">
                    <div className="w-full max-w-sm">
                        <BottomNav />
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
}
