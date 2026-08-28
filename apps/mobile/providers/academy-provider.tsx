import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKeys, toggleCompletedLesson } from "@nexa/shared-logic";
import type { Locale } from "@nexa/i18n";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

interface AcademyContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  completed: string[];
  toggleLesson: (lessonId: string) => Promise<void>;
  ready: boolean;
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

const STORAGE_TIMEOUT_MS = 2500;

function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Local storage timed out")), timeoutMs);
    operation.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      }
    );
  });
}

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void withTimeout(
      Promise.all([
        AsyncStorage.getItem(storageKeys.locale),
        AsyncStorage.getItem(storageKeys.completedLessons)
      ]),
      STORAGE_TIMEOUT_MS
    )
      .then(([savedLocale, savedCompleted]) => {
        if (!active) return;
        setLocaleState(savedLocale === "en" ? "en" : "fa");
        try {
          const parsed: unknown = savedCompleted ? JSON.parse(savedCompleted) : [];
          setCompleted(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []);
        } catch {
          setCompleted([]);
        }
      })
      .catch(() => {
        // Storage is a convenience, never a gate to opening the academy.
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    setLocaleState(next);
    try {
      await withTimeout(AsyncStorage.setItem(storageKeys.locale, next), STORAGE_TIMEOUT_MS);
    } catch {
      // Keep the in-memory selection so navigation is never blocked by storage.
    }
  }, []);

  const toggleLesson = useCallback(async (lessonId: string) => {
    setCompleted((current) => {
      const next = toggleCompletedLesson(current, lessonId);
      void AsyncStorage.setItem(storageKeys.completedLessons, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ locale, setLocale, completed, toggleLesson, ready }), [completed, locale, ready, setLocale, toggleLesson]);
  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy() {
  const context = useContext(AcademyContext);
  if (!context) throw new Error("useAcademy must be used inside AcademyProvider");
  return context;
}
