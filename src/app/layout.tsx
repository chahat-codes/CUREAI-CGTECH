import type { Metadata } from "next";
import "./globals.css";
import AppChrome from "@/components/AppChrome";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";

const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cureai.health"),
  title: {
    default: "Cure AI | Your AI Health Companion",
    template: "%s | Cure AI",
  },
  description: "Find nearby specialists, prepare for a consultation with an AI-assisted health intake, manage records and track clinic queues.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cure AI | Your AI Health Companion",
    description: "Healthcare discovery, pre-consultation assistance, appointments and secure health records in one platform.",
    type: "website",
    siteName: "Cure AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased no-scrollbar"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] relative">
        <AppChrome>{children}</AppChrome>
        {isProduction && <GoogleAnalytics />}
        {isProduction && <MicrosoftClarity />}
      </body>
    </html>
  );
}
