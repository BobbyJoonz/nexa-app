import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runtime diagnostics | NEXA Sunverter Academy",
  robots: { index: false, follow: false }
};

export default function DiagnosticsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
