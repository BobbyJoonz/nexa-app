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
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t } from "@nexa/i18n";
import { NexaLoader } from "@/components/nexa-loader";
import { AcademyProvider, useAcademy } from "@/providers/academy-provider";
import { theme } from "@/theme";
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
          contentStyle: { backgroundColor: theme.colors.canvas },
          animation: "slide_from_right"
        }}
      />
      {showExitHint ? (
        <View pointerEvents="none" style={exitHintStyles.wrap}>
          <View style={exitHintStyles.pill}>
            <Text style={exitHintStyles.text}>{t(locale, "common.exitHint")}</Text>
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
    <SafeAreaView style={errorStyles.safe}>
      <View style={errorStyles.card}>
        <Image source={require("../assets/nexa-logo.png")} style={errorStyles.logo} contentFit="contain" />
        <View style={errorStyles.rule} />
        <Text style={errorStyles.title}>{t(locale, "error.title")}</Text>
        <Text style={errorStyles.body}>{t(locale, "error.body")}</Text>
        {__DEV__ ? <Text selectable style={errorStyles.debug}>{error.message}</Text> : null}
        <Pressable style={errorStyles.button} onPress={retry} accessibilityRole="button">
          <Text style={errorStyles.buttonText}>{t(locale, "error.retry")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const errorStyles = StyleSheet.create({
  safe: { flex: 1, alignItems: "center", justifyContent: "center", padding: 22, backgroundColor: theme.colors.canvas },
  card: {
    width: "100%",
    maxWidth: 430,
    alignItems: "center",
    padding: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderSubtle,
    borderRadius: theme.radii.panel,
    backgroundColor: theme.colors.raised,
    ...theme.shadow
  },
  logo: { width: 156, height: 58 },
  rule: { width: 34, height: 3, marginVertical: 24, borderRadius: 99, backgroundColor: theme.colors.brandAccent },
  title: { color: theme.colors.brandPrimary, fontFamily: "Vazirmatn_700Bold", fontSize: 22, textAlign: "center", writingDirection: "rtl" },
  body: { marginTop: 12, color: theme.colors.textSecondary, fontFamily: "Vazirmatn_400Regular", fontSize: 13, lineHeight: 23, textAlign: "center", writingDirection: "rtl" },
  debug: { width: "100%", marginTop: 16, padding: 10, color: theme.colors.danger, borderRadius: 8, backgroundColor: "#FFF1F0", fontSize: 10 },
  button: { width: "100%", minHeight: 50, alignItems: "center", justifyContent: "center", marginTop: 24, borderRadius: theme.radii.control, backgroundColor: theme.colors.brandPrimary },
  buttonText: { color: "white", fontFamily: "Vazirmatn_500Medium", fontSize: 14 }
});

const exitHintStyles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, bottom: 64, alignItems: "center", zIndex: 999 },
  pill: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 999, backgroundColor: "rgba(13,34,62,.92)", ...theme.shadow },
  text: { color: "#FFFFFF", fontFamily: "Vazirmatn_500Medium", fontSize: 13, writingDirection: "rtl" }
});
