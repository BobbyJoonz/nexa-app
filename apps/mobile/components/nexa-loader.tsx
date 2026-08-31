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

/**
 * Branded loading screen — plain RN Animated (no Reanimated).
 * v1.2.3 approach: reliable, no native module init, no worklets.
 * Reverted from Reanimated 4 to eliminate module-scope crash hypothesis.
 */
export function NexaLoader() {
  const progress = useRef(new Animated.Value(0)).current;
  const logoWidth = useRef(new Animated.Value(0)).current;
  const [measuredWidth, setMeasuredWidth] = useState(0);
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
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    if (measuredWidth === 0) return;
    Animated.timing(progress, {
      toValue: 1,
      duration: 4500,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: false
    }).start();
  }, [measuredWidth, progress, reduceMotion]);

  const onLogoLayout = (event: LayoutChangeEvent) => {
    const w = Math.round(event.nativeEvent.layout.width);
    logoWidth.setValue(w);
    setMeasuredWidth(w);
  };

  return (
    <View
      className="flex-1 items-center justify-center overflow-hidden bg-background"
      accessibilityRole="progressbar"
      accessibilityLabel="NEXA در حال بارگذاری"
    >
      {/* Decorative rings */}
      <View pointerEvents="none" className="absolute inset-0 opacity-32" style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(18,44,79,0.06)" }} />
      <View pointerEvents="none" className="absolute h-[390px] w-[390px] rounded-full" style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(18,44,79,0.12)" }} />
      <View pointerEvents="none" className="absolute h-[292px] w-[292px] rounded-full border border-dashed" style={{ borderColor: "rgba(18,44,79,0.12)" }} />

      <View className="w-full items-center px-7">
        <View
          className="w-full max-w-[350px] rounded-panel border border-border bg-white px-7 pb-6 pt-8"
          style={theme.shadow}
        >
          <View
            style={{ width: "100%", aspectRatio: LOGO_ASPECT_RATIO, overflow: "hidden", backgroundColor: "#FFFFFF" }}
            onLayout={onLogoLayout}
          >
            <Image
              source={require("../assets/nexa-logo.png")}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.13 }}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
            <Animated.View
              style={[
                { position: "absolute", top: 0, bottom: 0, left: 0, overflow: "hidden" },
                { width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, measuredWidth]
                })}
              ]}
            >
              <Image
                source={require("../assets/nexa-logo.png")}
                style={{ width: measuredWidth, height: "100%" }}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
            </Animated.View>
          </View>
          <View className="mt-5 h-[3px] overflow-hidden rounded-full bg-secondary">
            <Animated.View
              style={[
                { height: "100%", borderRadius: 99, backgroundColor: theme.colors.brandAccent },
                { width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"]
                })}
              ]}
            />
          </View>
        </View>

        <Text className="mt-7 text-center font-medium text-[15px] leading-[25px] text-primary" style={{ writingDirection: "rtl" }}>
          در حال آماده‌سازی آکادمی
        </Text>
        <Text className="mt-1 text-center text-[10px] font-semibold uppercase tracking-[1.1px] text-muted-foreground">
          Preparing Sunverter Academy
        </Text>
      </View>
    </View>
  );
}