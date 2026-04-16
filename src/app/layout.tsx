import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import NextTopLoader from 'nextjs-toploader';
import { FirebaseAnalytics } from "@/components/providers/firebase-analytics";

export const metadata: Metadata = {
  title: "SmartMed | Your Intelligent Medicine Reminder",
  description: "Never miss a dose again with SmartMed. AI-powered medicine tracking and reminders for you and your family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans">
        <SessionProvider>
          <QueryProvider>
            <NextTopLoader
              color="#3b82f6"
              initialPosition={0.08}
              crawlSpeed={200}
              height={4}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
            />
            <FirebaseAnalytics />
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
