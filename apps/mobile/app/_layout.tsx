import "../global.css";
import {
  Vazirmatn_400Regular,
  Vazirmatn_500Medium,
  Vazirmatn_700Bold,
  useFonts
} from "@expo-google-fonts/vazirmatn";
import { Stack, router, type ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { BackHandler, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t } from "@nexa/i18n";
import { NexaLoader } from "@/components/nexa-loader";
import { AcademyProvider, useAcademy } from "@/providers/academy-provider";
import { captureException, initTelemetry } from "@/src/lib/telemetry";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppBootstrap() {
  const { ready, locale } = useAcademy();
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [showExitHint, setShowExitHint] = useState(false);
  const lastBackAt = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => setMinimumElapsed(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Android hardware back: one press navigates one step back; at the root
  // screen a second press (within 2s) exits the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (router.canGoBack()) return false; // let the native stack pop one screen
      const now = Date.now();
      if (now - lastBackAt.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      lastBackAt.current = now;
      setShowExitHint(true);
      setTimeout(() => setShowExitHint(false), 2000);
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!ready || !minimumElapsed) return <NexaLoader />;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F4F6F8" },
          animation: "slide_from_right"
        }}
      />
      {showExitHint ? (
        <View pointerEvents="none" className="absolute inset-x-0 bottom-16 z-[999] items-center">
          <View className="rounded-pill px-[18px] py-[11px] bg-[rgba(13,34,62,0.92)] shadow-card">
            <Text className="font-medium text-[13px] text-white" style={{ writingDirection: "rtl" }}>
              {t(locale, "common.exitHint")}
            </Text>
          </View>
        </View>
      ) : null}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Vazirmatn_400Regular,
    Vazirmatn_500Medium,
    Vazirmatn_700Bold
  });

  useEffect(() => {
    // Crash telemetry is dormant until a DSN exists in app.json (extra.sentry.dsn)
    // and is fully disabled in __DEV__; calling it here keeps activation one-sided.
    initTelemetry();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync().catch(() => undefined);
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AcademyProvider>
      <AppBootstrap />
    </AcademyProvider>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  // JS-only, provider-free capture: the boundary itself must never depend on a
  // broken tree. No-op until Sentry is configured.
  captureException(error, { boundary: "root", message: error.message });
  // Provider-free locale: the boundary must render even when the provider tree
  // is broken, so we use the pure dictionary with the fa default — the exact
  // behavior shipped today (localized boundary remains a backlog item).
  const locale = "fa" as const;
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-5">
      <View className="w-full max-w-[430px] items-center rounded-panel border border-border bg-card p-7 shadow-card">
        <Image source={require("../assets/nexa-logo.png")} style={{ width: 156, height: 58 }} contentFit="contain" />
        <View className="my-6 h-[3px] w-[34px] rounded-full bg-accent" />
        <Text className="text-center text-[22px] font-bold text-primary" style={{ writingDirection: "rtl" }}>
          {t(locale, "error.title")}
        </Text>
        <Text className="mt-3 text-center font-medium text-[13px] leading-[23px] text-muted-foreground" style={{ writingDirection: "rtl" }}>
          {t(locale, "error.body")}
        </Text>
        {__DEV__ ? (
          <Text selectable className="mt-4 w-full rounded-lg bg-[#FFF1F0] p-2.5 text-[10px] text-destructive">
            {error.message}
          </Text>
        ) : null}
        <Pressable
          className="mt-6 h-[50px] w-full items-center justify-center rounded-control bg-primary"
          onPress={retry}
          accessibilityRole="button"
        >
          <Text className="font-medium text-[14px] text-white">{t(locale, "error.retry")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
