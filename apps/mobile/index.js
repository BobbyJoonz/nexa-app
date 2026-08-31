// Bulletproof entry point.
// Wraps expo-router startup in a try/catch so that ANY module-scope crash
// (native module init failure, css-interop breakage, etc.) is DISPLAYED on
// screen instead of leaving the user on an eternal gray splash screen.
// This file must contain NO JSX (pure React.createElement) so the fallback
// cannot itself depend on the NativeWind/css-interop JSX runtime.
import { AppRegistry, Text, View } from "react-native";
import React from "react";

let BOOT_ERROR_MESSAGE = "";
let BOOT_ERROR_STACK = "";

function BootCrash() {
  return React.createElement(
    View,
    {
      style: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 90,
        paddingHorizontal: 24,
      }
    },
    React.createElement(
      Text,
      { style: { color: "#891525", fontSize: 17, fontWeight: "700", marginBottom: 14 } },
      "خطای راه‌اندازی / Startup Error"
    ),
    React.createElement(
      Text,
      { style: { color: "#122C4F", fontSize: 12, lineHeight: 20 }, selectable: true },
      BOOT_ERROR_MESSAGE
    ),
    React.createElement(
      Text,
      { style: { color: "#5C6878", fontSize: 9, marginTop: 14 }, selectable: true },
      BOOT_ERROR_STACK
    )
  );
}

let entryLoaded = false;
try {
  // expo-router/entry registers the "main" AppRegistry component as a
  // top-level side effect. If any module in the graph throws during
  // evaluation, the registration never happens and we fall through.
  require("expo-router/entry");
  entryLoaded = true;
} catch (error) {
  BOOT_ERROR_MESSAGE =
    (error && error.message) || String(error) || "Unknown startup error";
  BOOT_ERROR_STACK = String((error && error.stack) || "").slice(0, 1800);
  AppRegistry.registerComponent("main", () => BootCrash);
}

if (!entryLoaded && __DEV__) {
  console.error("[boot-guard] expo-router/entry failed:", BOOT_ERROR_MESSAGE);
}
