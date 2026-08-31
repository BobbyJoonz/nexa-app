import { cssInterop } from "nativewind";
import { Image as ExpoImage } from "expo-image";

/**
 * NativeWind v4 only auto-registers react-native core components.
 * expo-image's `Image` is a separate component — without this registration
 * every `className` on an expo-image is silently ignored and the image
 * renders at 0x0 (invisible). This module must be imported before any
 * screen renders (imported first in app/_layout.tsx).
 */
cssInterop(ExpoImage, {
  className: "style",
});
