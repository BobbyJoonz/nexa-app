import type { Config } from "tailwindcss";

/**
 * NEXA design system → Tailwind/NativeWind.
 * Every value below maps 1:1 to the shared @nexa/design-tokens package so the
 * web app and the mobile app stay visually identical.
 */
export default {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand (from design-tokens) ─────────────────────────────
        brand: {
          primary: "#122C4F",
          "primary-strong": "#0D223E",
          accent: "#891525"
        },
        // ── Semantic palette (shadcn-compatible names) ─────────────
        background: "#F4F6F8", // canvas
        foreground: "#172338", // textPrimary
        card: "#FBFCFD", // raised
        "card-foreground": "#172338",
        primary: "#122C4F", // brandPrimary
        "primary-foreground": "#FFFFFF",
        secondary: "#E8EDF2", // technical
        "secondary-foreground": "#172338",
        muted: "#E8EDF2", // technical
        "muted-foreground": "#5C6878", // textSecondary
        accent: "#891525", // brandAccent
        "accent-foreground": "#FFFFFF",
        destructive: "#B42318", // danger
        "destructive-foreground": "#FFFFFF",
        border: "#CCD5DE", // borderSubtle
        input: "#CCD5DE",
        ring: "#122C4F", // brandPrimary focus ring
        // ── Status semantics ───────────────────────────────────────
        success: "#2F6F55",
        warning: "#B54708",
        info: "#3974A4",
        // ── Energy flow (diagrams) ─────────────────────────────────
        energy: {
          solar: "#D99100",
          grid: "#3974A4",
          battery: "#617C41",
          load: "#891525"
        }
      },
      fontFamily: {
        // The exact names registered by useFonts() in app/_layout.tsx.
        sans: ["Vazirmatn_400Regular"],
        medium: ["Vazirmatn_500Medium"],
        bold: ["Vazirmatn_700Bold"]
      },
      spacing: {
        // design-tokens spacing (4px base) — matches Tailwind defaults;
        // explicit aliases kept for parity with @nexa/design-tokens
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px"
      },
      borderRadius: {
        control: "10px",
        panel: "16px",
        pill: "999px"
      },
      fontSize: {
        // Typography scale — fontWeight is intentionally omitted because
        // RN custom fonts (Vazirmatn) require the *exact* fontFamily name
        // for each weight; use font-sans / font-medium / font-bold classes.
        display: ["34px", { lineHeight: "41px" }],
        h1: ["28px", { lineHeight: "34px" }],
        h2: ["22px", { lineHeight: "28px" }],
        h3: ["18px", { lineHeight: "24px" }],
        body: ["15px", { lineHeight: "22px" }],
        "body-sm": ["13px", { lineHeight: "18px" }],
        caption: ["11px", { lineHeight: "16px" }],
        label: ["12px", { lineHeight: "16px" }],
        button: ["15px", { lineHeight: "20px" }]
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,44,79,0.06), 0 4px 12px rgba(18,44,79,0.06)",
        raised: "0 2px 6px rgba(18,44,79,0.10)",
        pop: "0 8px 24px rgba(18,44,79,0.16)"
      }
    }
  },
  plugins: []
} satisfies Config;
