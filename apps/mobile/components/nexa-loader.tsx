import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Easing,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { theme } from "@/theme";

const LOGO_ASPECT_RATIO = 657 / 241;

/**
 * Branded loading screen shown from the very first frame.
 * - Progress reveal + track fill animated with Reanimated (worklets-based).
 * - Respects the OS reduce-motion preference (jumps straight to 100%).
 * - Static layout uses NativeWind classes; the animated reveal uses Reanimated styles.
 */
export function NexaLoader() {
  const progress = useSharedValue(0);
  const logoWidthSV = useSharedValue(0);
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
      progress.value = 1;
      return;
    }
    if (measuredWidth === 0) return;
    progress.value = withTiming(1, {
      duration: 4500,
      easing: Easing.bezier(0.16, 1, 0.3, 1)
    });
  }, [measuredWidth, progress.value, reduceMotion]);

  const onLogoLayout = (event: LayoutChangeEvent) => {
    const w = Math.round(event.nativeEvent.layout.width);
    logoWidthSV.value = w;
    setMeasuredWidth(w);
  };

  const logoRevealStyle = useAnimatedStyle(() => ({
    width: progress.value * logoWidthSV.value
  }));

  const trackStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`
  }));

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
                logoRevealStyle
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
                trackStyle
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