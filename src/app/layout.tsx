import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import SiteProtection from "@/components/SiteProtection";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import CustomCursor from "@/components/CustomCursor";
import SiteInnovations from "@/components/SiteInnovations";
import CommandPalette from "@/components/CommandPalette";
import SocialChatWidget from "@/components/SocialChatWidget";
import { PerformanceProvider, PerformanceMode } from "@/context/PerformanceContext";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Star Dublaj Studios",
  description: "En iyi oyun modları, profesyonel Türkçe dublajlar .",
  other: {
    google: "notranslate"
  }
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawMode = cookieStore.get('dublio_perf_v2')?.value;
  const defaultMode = (rawMode === 'ultra' || rawMode === 'potato') ? rawMode as PerformanceMode : null;

  return (
    <html lang="tr" translate="no" className="notranslate">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased selection:!bg-transparent selection:!text-current cursor-none`}>
        <CustomCursor />
        <SiteInnovations />
        <CommandPalette />
        <SocialChatWidget />
        <AuthProvider>
          <PerformanceProvider defaultMode={defaultMode}>
            <AnalyticsProvider />
            <SiteProtection />
            {children}
          </PerformanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
