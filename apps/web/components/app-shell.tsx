"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpenText, Languages, ShieldCheck } from "lucide-react";
import { useAcademy } from "./academy-provider";
import { Button } from "./ui/button";

export function AppShell({
  children,
  compact = false
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const { locale, setLocale, translate } = useAcademy();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/models" className="brand-lockup" aria-label="NEXA Sunverter Academy">
          <Image src="/assets/brand/nexa-logo.png" width={122} height={45} alt="NEXA" priority />
          <span>{translate("brand.academy")}</span>
        </Link>
        <nav className="top-actions" aria-label="Primary">
          {!compact && (
            <Link className="nav-link" href="/academy/cm3500-24s/manuals">
              <BookOpenText size={18} />
              <span>{translate("nav.manuals")}</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
            aria-label={translate("common.language")}
          >
            <Languages size={18} />
            {locale === "fa" ? "EN" : "فا"}
          </Button>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <ShieldCheck size={18} />
        <p>{translate("safety.disclaimer")}</p>
      </footer>
    </div>
  );
}
