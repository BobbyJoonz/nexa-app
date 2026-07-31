import {
  Vazirmatn_400Regular,
  Vazirmatn_500Medium,
  Vazirmatn_700Bold,
  useFonts
} from "@expo-google-fonts/vazirmatn";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NexaLoader } from "@/components/nexa-loader";
import { AcademyProvider, useAcademy } from "@/providers/academy-provider";
import { theme } from "@/theme";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppBootstrap() {
  const { ready } = useAcademy();
  const [minimumElapsed, setMinimumElapsed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMinimumElapsed(true), 700);
    return () => clearTimeout(timeout);
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
  return (
    <SafeAreaView style={errorStyles.safe}>
      <View style={errorStyles.card}>
        <Image source={require("../assets/nexa-logo.png")} style={errorStyles.logo} contentFit="contain" />
        <View style={errorStyles.rule} />
        <Text style={errorStyles.title}>برنامه درست بارگذاری نشد</Text>
        <Text style={errorStyles.body}>
          اطلاعات شما حذف نشده است. دوباره تلاش کنید؛ اگر مشکل ماند، نسخهٔ برنامه و تصویر این صفحه را برای پشتیبانی بفرستید.
        </Text>
        {__DEV__ ? <Text selectable style={errorStyles.debug}>{error.message}</Text> : null}
        <Pressable style={errorStyles.button} onPress={retry} accessibilityRole="button">
          <Text style={errorStyles.buttonText}>تلاش دوباره · Retry</Text>
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
