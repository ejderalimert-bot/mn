import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import SiteProtection from "@/components/SiteProtection";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Star Dublaj Studios",
  description: "En iyi oyun modları, profesyonel Türkçe dublajlar .",
  other: {
    google: "notranslate"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" translate="no" className="notranslate">
      <body className={`${inter.className} antialiased selection:!bg-transparent selection:!text-current`}>
        <AuthProvider>
          <AnalyticsProvider />
          <SiteProtection />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
