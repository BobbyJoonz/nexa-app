"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { directionFor, t, type Locale, type TranslationKey } from "@nexa/i18n";
import {
  completionPercent,
  parseStoredList,
  storageKeys,
  toggleCompletedLesson
} from "@nexa/shared-logic";
import { NexaLoader } from "./nexa-loader";

interface AcademyContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  completed: string[];
  toggleLesson: (lessonId: string) => void;
  percent: (total: number) => number;
  translate: (key: TranslationKey) => string;
  ready: boolean;
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMinimumElapsed(true), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    try {
      const savedLocale = window.localStorage.getItem(storageKeys.locale);
      setLocaleState(savedLocale === "en" ? "en" : "fa");
      setCompleted(parseStoredList(window.localStorage.getItem(storageKeys.completedLessons)));
    } catch {
      // Browsers can block storage in private or embedded contexts. The app remains usable in memory.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = directionFor(locale);
    try {
      window.localStorage.setItem(storageKeys.locale, locale);
    } catch {
      // Locale still applies for the current session when persistence is unavailable.
    }
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const toggleLesson = useCallback((lessonId: string) => {
    setCompleted((current) => {
      const next = toggleCompletedLesson(current, lessonId);
      try {
        window.localStorage.setItem(storageKeys.completedLessons, JSON.stringify(next));
      } catch {
        // Completion remains available in memory for this session.
      }
      return next;
    });
  }, []);

  const value = useMemo<AcademyContextValue>(() => ({
    locale,
    setLocale,
    completed,
    toggleLesson,
    percent: (total) => completionPercent(completed, total),
    translate: (key) => t(locale, key),
    ready
  }), [completed, locale, ready, setLocale, toggleLesson]);

  return (
    <AcademyContext.Provider value={value}>
      {ready && minimumElapsed ? children : <NexaLoader />}
    </AcademyContext.Provider>
  );
}

export function useAcademy() {
  const context = useContext(AcademyContext);
  if (!context) throw new Error("useAcademy must be used inside AcademyProvider");
  return context;
}
