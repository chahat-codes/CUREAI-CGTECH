import type { Metadata } from "next";
import "./globals.css";
import AppChrome from "@/components/AppChrome";

export const metadata: Metadata = {
  title: "Cure AI | Find the Right Doctor in 30 Seconds",
  description: "Cure AI uses intelligent symptom understanding to connect patients with the most relevant specialists, book appointments instantly, and keep all health records in one secure place.",
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
      </body>
    </html>
  );
}
