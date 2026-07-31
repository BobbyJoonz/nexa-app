import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent
} from "react-native";
import { theme } from "@/theme";

const LOGO_ASPECT_RATIO = 657 / 241;

export function NexaLoader() {
  const progress = useRef(new Animated.Value(0)).current;
  const [logoWidth, setLogoWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(reduceMotion ? 1 : 0);
    if (reduceMotion || logoWidth === 0) return;

    Animated.timing(progress, {
      toValue: 1,
      duration: 1150,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: false
    }).start();
  }, [logoWidth, progress, reduceMotion]);

  const onLogoLayout = (event: LayoutChangeEvent) => {
    setLogoWidth(Math.round(event.nativeEvent.layout.width));
  };

  return (
    <View style={styles.screen} accessibilityRole="progressbar" accessibilityLabel="NEXA در حال بارگذاری">
      <View pointerEvents="none" style={styles.grid} />
      <View pointerEvents="none" style={styles.orbitOuter} />
      <View pointerEvents="none" style={styles.orbitInner} />

      <View style={styles.content}>
        <View style={styles.logoCard}>
          <View style={styles.logoStage} onLayout={onLogoLayout}>
            <Image
              source={require("../assets/nexa-logo.png")}
              style={[styles.logo, styles.logoGhost]}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
            <Animated.View
              style={[
                styles.logoReveal,
                { width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, logoWidth] }) }
              ]}
            >
              <Image
                source={require("../assets/nexa-logo.png")}
                style={[styles.logo, { width: logoWidth }]}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
            </Animated.View>
          </View>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.trackValue,
                { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }
              ]}
            />
          </View>
        </View>

        <Text style={styles.title}>در حال آماده‌سازی آکادمی</Text>
        <Text style={styles.subtitle}>Preparing Sunverter Academy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: theme.colors.canvas
  },
  grid: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.32,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(18,44,79,0.06)"
  },
  orbitOuter: {
    position: "absolute",
    width: 390,
    height: 390,
    borderRadius: 195,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(18,44,79,0.12)"
  },
  orbitInner: {
    position: "absolute",
    width: 292,
    height: 292,
    borderRadius: 146,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(18,44,79,0.12)"
  },
  content: { width: "100%", alignItems: "center", paddingHorizontal: 28 },
  logoCard: {
    width: "100%",
    maxWidth: 350,
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderSubtle,
    borderRadius: theme.radii.panel,
    backgroundColor: "#FFFFFF",
    shadowColor: theme.colors.brandPrimaryStrong,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.11,
    shadowRadius: 36,
    elevation: 6
  },
  logoStage: {
    width: "100%",
    aspectRatio: LOGO_ASPECT_RATIO,
    overflow: "hidden",
    backgroundColor: "#FFFFFF"
  },
  logo: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  logoGhost: { opacity: 0.13 },
  logoReveal: { position: "absolute", top: 0, bottom: 0, left: 0, overflow: "hidden" },
  track: {
    height: 3,
    marginTop: 22,
    overflow: "hidden",
    borderRadius: 99,
    backgroundColor: theme.colors.technical
  },
  trackValue: { height: "100%", borderRadius: 99, backgroundColor: theme.colors.brandAccent },
  title: {
    marginTop: 28,
    color: theme.colors.brandPrimary,
    fontFamily: "Vazirmatn_500Medium",
    fontSize: 15,
    lineHeight: 25,
    textAlign: "center",
    writingDirection: "rtl"
  },
  subtitle: {
    marginTop: 3,
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  }
});
