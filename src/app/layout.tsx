import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwasthSetu | AI Healthcare Agent & Clinic Workflow Automation",
  description: "AI-powered healthcare booking, secure payments, prescriptions, reminders and digital patient medical folders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-[100dvh] overflow-hidden antialiased`}
    >
      <body className="h-[100dvh] overflow-hidden flex flex-col bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <QueryProvider>
          <main className="flex-1 flex flex-col min-h-0 relative z-10">
            {children}
          </main>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
