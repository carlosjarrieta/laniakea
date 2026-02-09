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
import { LanguageProvider } from "@/components/providers/language-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { organizationJsonLd } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Laniakea | AI Ad Orchestrator & Content Forge",
  description: "Orchestrate your social media campaigns and forge content with AI. Smart budgeting, multi-channel post generation, and ROI-focused automation.",
  keywords: ["social media management", "AI content generation", "ad orchestration", "ROI optimizer", "smart budgeting", "Laniakea"],
  openGraph: {
    title: "Laniakea | AI Ad Orchestrator & Content Forge",
    description: "The AI supercluster for your social media growth and ROI.",
    url: "https://laniakea.tech",
    siteName: "Laniakea",
    images: [
      {
        url: "https://laniakea.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Laniakea Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laniakea | AI Ad Orchestrator",
    description: "AI-powered social media orchestration platform.",
    creator: "@laniakea_tech",
    images: ["https://laniakea.tech/twitter-image.png"],
  },
  alternates: {
    canonical: "https://laniakea.tech",
    languages: {
      "es-ES": "https://laniakea.tech/es",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-violet-500/30 font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" richColors closeButton />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
