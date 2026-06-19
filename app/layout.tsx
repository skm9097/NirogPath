import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "NirogPath — From Screening to Control",
  description: "AI-powered NCD health tracking for Indian patients. Track BP, sugar, medications. Works offline.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "NirogPath" },
};

export const viewport: Viewport = {
  themeColor: "#1B6B4A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-[#F8FAFC]">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
