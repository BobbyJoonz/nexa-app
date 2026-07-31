# QA Report

Test date: 2026-07-31  
Environment: Node.js 24.14.0 on Linux, pnpm 11.18.0

Release under test: **1.1.0**

## Final quality gate

Command:

```bash
pnpm qa
```

Result: **PASS**

| Check | Result |
|---|---|
| Source-backed content counts and missing-model isolation | PASS: 15 lessons, 31 settings, 21 faults, 18 specifications |
| Persian/English dictionary parity | PASS: 36 matching interface keys |
| Bilingual content completeness | PASS: 194 bilingual records |
| Production branding | PASS: 59 source files checked, exact NEXA logo present |
| Local asset and document targets | PASS: 18 targets resolved |
| pnpm peer dependencies | PASS: no peer issues |
| TypeScript across 10 workspace projects | PASS |
| Unit and content tests | PASS: 3 files, 9 tests |
| Next.js production build | PASS |
| Next.js standalone runtime preparation | PASS |
| Expo Doctor | PASS: 20 of 20 checks |

## Web production checks

Next.js 16.2.12 compiled with Turbopack, completed TypeScript validation, generated all static routes, and retained the dynamic academy routes:

- `/`
- `/models`
- `/academy/[model]`
- `/academy/[model]/[module]`
- `/api/health`
- `/diagnostics`
- `/manifest.webmanifest`

The standalone runtime was started on an isolated QA port. Direct production requests passed for:

- language gate
- model selection
- runtime diagnostics
- health API with release and build identification
- academy dashboard
- settings lesson
- fault lesson
- NEXA logo
- product WebP
- generated energy-flow SVG
- bundled Persian quick-start PDF

The tested standalone runtime includes copied `public` and `.next/static` assets through the automated `postbuild` script.

## Android and iOS bundle checks

Expo SDK 57 production exports were executed separately:

```bash
expo export --platform android
expo export --platform ios
```

| Platform | Result | Modules | Export size |
|---|---|---:|---:|
| Android | PASS | 1,421 | 24 MB |
| iOS | PASS | 1,303 | 23 MB |

Both exports resolved Expo Router, shared workspace packages, Vazirmatn fonts, NEXA logo, edited product image, all four source PDFs, native icon set, AsyncStorage, platform PDF sharing, and platform bundles.

Native configuration:

- Android package: `com.nexa.sunverteracademy`
- iOS bundle identifier: `com.nexa.sunverteracademy`
- App version: 1.1.0
- Android version code: 2
- iOS build number: 2
- EAS profiles: development, preview APK, iOS Simulator, and production

## Asset checks

- canonical, web, and mobile NEXA logo SHA-256 values are identical
- edited transparent master: 1024 by 1536, alpha retained
- cutout and hotspot WebP: 797 by 964, alpha retained
- mobile WebP: 760 by 919, alpha retained
- app icon: 1024 by 1024
- adaptive icon: 1024 by 1024 with alpha
- splash asset: 1200 by 1200
- all ten generated SVG diagrams resolve from web production output

## Interaction and accessibility review

- Persian is the default language and uses RTL
- English switches the document to LTR
- mobile applies explicit writing direction and row direction
- progress persists in local storage on web and AsyncStorage on mobile
- language remains changeable after onboarding
- the missing second model is disabled and contains no inherited data
- LCD values are labeled as educational examples
- troubleshooting stops at safe observation or service escalation
- focus-visible styles are present
- Radix controls provide dialog, accordion, and tab semantics
- reduced-motion CSS disables non-essential motion
- the exact supplied NEXA image fills progressively without reconstructing or changing the wordmark
- safety status uses icon and text in addition to color

## Startup resilience and live inspection

- no login, registration, token, or authentication gate exists; the first interactive route is language selection
- native splash calls handle rejection instead of terminating bootstrap
- a font-loading error falls back to system rendering rather than leaving a permanent blank screen
- AsyncStorage startup is bounded to 2.5 seconds and cannot trap the application
- language navigation is immediate and no longer waits for storage persistence
- web localStorage reads and writes are non-fatal when storage is blocked
- branded route-level and root-level recovery screens are present
- `/api/health` returned HTTP 200 with version `1.1.0`, build ID, and verified model ID
- `/diagnostics` returned HTTP 200 from the standalone production runtime
- `/`, `/models`, `/diagnostics`, `/api/health`, and the NEXA logo were requested successfully from the standalone server

## Browser-preview boundary

The cloud QA browser blocked access to the repository loopback URL with `ERR_BLOCKED_BY_CLIENT`. No hosted preview or ChatGPT Sites runtime was created. Visual review therefore used the four preserved design references, rendered source/PDF contact sheets, direct inspection of generated/edited images, responsive source review, and successful production-route requests. This environment boundary does not affect the production build or standalone runtime.

## Signing boundary

This Linux environment cannot locally sign an iOS IPA and does not contain the owner's Apple or Google signing credentials. Store binaries should be produced through the included EAS profiles or platform-native CI. Android and iOS JavaScript bundles, Expo configuration, dependency health, assets, identifiers, and routing all passed readiness checks.
