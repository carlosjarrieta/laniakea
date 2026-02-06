import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LanguageProvider, useLanguage } from "@/components/providers/language-provider";

export async function generateMetadata(): Promise<Metadata> {
  // Para testear en inglés, cambiemos esto a 'en' temporalmente o usemos una lógica
  const testLocale = 'en'; 
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/locales/${testLocale}`, { 
      next: { revalidate: 3600 } 
    });
    const translations = await res.json();
    
    return {
      title: translations.metadata?.title || "Laniakea | Ad Orchestrator",
      description: translations.metadata?.description || "AI-powered ad orchestration platform",
    };
  } catch (error) {
    console.error("Error fetching metadata translations:", error);
    return {
      title: "Laniakea | Ad Orchestrator",
      description: "AI-powered ad orchestration platform",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Para testear la versión en inglés cambiamos esto a 'en'
  const currentLocale = 'en'; 

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-violet-500/30 font-sans`}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
