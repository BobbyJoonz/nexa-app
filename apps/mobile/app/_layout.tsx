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
import { default as React, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
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

  // Safety net: hide the splash after 3s even if fonts haven't loaded yet,
  // so the app never stays stuck on a gray native splash screen.
  // (Must be registered BEFORE any conditional return — Rules of Hooks.)
  useEffect(() => {
    const timeout = setTimeout(() => {
      void SplashScreen.hideAsync().catch(() => undefined);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // While fonts load, render the loader card (pure RN Animated, no Reanimated).
  // Never return null — a null root leaves the gray native splash visible.
  if (!fontsLoaded && !fontError) {
    return <NexaLoader />;
  }

  return (
    <LayoutGuard>
      <AcademyProvider>
        <AppBootstrap />
      </AcademyProvider>
    </LayoutGuard>
  );
}

/**
 * Class-based error boundary INSIDE the root layout.
 * expo-router's exported ErrorBoundary only covers the layout's child
 * screens — errors thrown while rendering AcademyProvider, AppBootstrap,
 * NexaLoader or the fonts guard would otherwise propagate to the React root
 * and unmount the whole tree (eternal gray screen in release builds).
 *
 * Deliberately uses React.createElement + plain StyleSheet objects (no JSX,
 * no NativeWind) so this guard can still render when css-interop itself is
 * the thing that broke. The error message is shown in release too — visible
 * diagnostics beat a silent gray screen.
 */
class LayoutGuard extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    captureException(error, { boundary: "layout-guard", info: String(info) });
  }

  render() {
    if (this.state.error) {
      const message = this.state.error?.message ?? String(this.state.error);
      return React.createElement(
        SafeAreaView,
        { style: eb.root },
        React.createElement(
          View,
          { style: eb.card },
          React.createElement(Image, {
            source: require("../assets/nexa-logo.png"),
            style: { width: 156, height: 58 },
            contentFit: "contain",
          }),
          React.createElement(View, { style: eb.rule }),
          React.createElement(
            Text,
            { style: [eb.title, { writingDirection: "rtl" }] },
            t("fa", "error.title")
          ),
          React.createElement(
            Text,
            { style: [eb.body, { writingDirection: "rtl" }] },
            t("fa", "error.body")
          ),
          React.createElement(Text, { selectable: true, style: eb.debug }, message),
          React.createElement(
            Pressable,
            {
              style: eb.button,
              onPress: () => this.setState({ error: null }),
              accessibilityRole: "button",
            },
            React.createElement(
              Text,
              { style: eb.buttonLabel },
              t("fa", "error.retry")
            )
          )
        )
      );
    }
    return this.props.children;
  }
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  // JS-only, provider-free capture: the boundary must never depend on a
  // broken tree. No-op until Sentry is configured.
  captureException(error, { boundary: "root", message: error.message });
  // Pure createElement + plain StyleSheet — NOT NativeWind JSX — so this
  // boundary still renders even if the css-interop JSX wrapper is what broke.
  return React.createElement(
    SafeAreaView,
    { style: eb.root },
    React.createElement(
      View,
      { style: eb.card },
      React.createElement(Image, {
        source: require("../assets/nexa-logo.png"),
        style: { width: 156, height: 58 },
        contentFit: "contain",
      }),
      React.createElement(View, { style: eb.rule }),
      React.createElement(
        Text,
        { style: [eb.title, { writingDirection: "rtl" }] },
        t("fa", "error.title")
      ),
      React.createElement(
        Text,
        { style: [eb.body, { writingDirection: "rtl" }] },
        t("fa", "error.body")
      ),
      __DEV__
        ? React.createElement(
            Text,
            { selectable: true, style: eb.debug },
            error.message
          )
        : null,
      React.createElement(
        Pressable,
        {
          style: ({ pressed }: { pressed: boolean }) => [
            eb.button,
            pressed && { opacity: 0.8 },
          ],
          onPress: retry,
          accessibilityRole: "button",
        },
        React.createElement(Text, { style: eb.buttonLabel }, t("fa", "error.retry"))
      )
    )
  );
}

const eb = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F6F8", padding: 20 },
  card: { width: "100%", maxWidth: 430, alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#CCD5DE", backgroundColor: "#FBFCFD", padding: 28, shadowColor: "#0D223E", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 5 },
  rule: { height: 3, width: 34, borderRadius: 2, backgroundColor: "#891525", marginVertical: 24 },
  title: { textAlign: "center", fontSize: 22, fontWeight: "700", color: "#122C4F" },
  body: { marginTop: 12, textAlign: "center", fontSize: 13, lineHeight: 23, fontWeight: "500", color: "#5C6878" },
  debug: { marginTop: 16, width: "100%", borderRadius: 8, backgroundColor: "#FFF1F0", padding: 10, fontSize: 10, color: "#B42318" },
  button: { marginTop: 24, height: 50, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#122C4F" },
  buttonLabel: { fontSize: 14, fontWeight: "500", color: "#FFFFFF" }
});
