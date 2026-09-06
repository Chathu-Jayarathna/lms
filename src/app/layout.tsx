import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Thakral Global Learning (TGL) | AI-Powered Employability LMS",
  description:
    "An AI-powered Learning Management System dedicated to employability skills development, technical interview prep, and career readiness for Thakral Global Learning.",
  keywords: [
    "Employability LMS",
    "Thakral Global Learning",
    "TGL LMS",
    "AI Skill Coach",
    "Career Readiness",
    "Technical Skills Development",
  ],
  authors: [{ name: "Thakral Global Learning" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 flex flex-col antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
