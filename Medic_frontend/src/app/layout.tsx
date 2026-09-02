import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "../context/AppStateContext";
import { TopNav } from "../components/layout/TopNav";
import { Footer } from "../components/layout/Footer";
import { DemoController } from "../components/layout/DemoController";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PATIENT-SOVEREIGN | Healthcare Intelligence",
  description: "Signature-Verified Prescription Intelligence Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AppStateProvider>
          <TopNav />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <DemoController />
        </AppStateProvider>
      </body>
    </html>
  );
}
