import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "../context/AppStateContext";
import { AuthProvider } from "../context/AuthContext";
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
  title: "MediTrust — Patient-Sovereign Healthcare Network",
  description: "Cryptographically signed prescriptions, AI clinical safety, and patient-controlled consent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AuthProvider>
          <AppStateProvider>
            <TopNav />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <DemoController />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
