import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "./globals.css";
import type { Metadata } from "next";
import { AcademyProvider } from "@/components/academy-provider";

export const metadata: Metadata = {
  title: "NEXA Sunverter Academy",
  description: "Bilingual product education for the NEXA CM3500-24S hybrid solar inverter.",
  applicationName: "NEXA Sunverter Academy"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <AcademyProvider>{children}</AcademyProvider>
      </body>
    </html>
  );
}
