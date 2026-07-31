# Changelog

## 1.1.0 — 2026-07-31

### Fixed

- Prevented native splash promise failures from interrupting Expo startup.
- Added a font-load fallback so a failed custom font cannot leave a permanent blank screen.
- Bounded AsyncStorage startup and made all storage persistence non-fatal.
- Made mobile language navigation immediate instead of waiting for disk persistence.
- Protected web startup and progress persistence when localStorage is blocked.

### Added

- Exact NEXA wordmark fill loader on Next.js and Expo, including reduced-motion behavior.
- Branded mobile, route-level web, and root-level web error recovery.
- Safe `/api/health` and `/diagnostics` routes for public live debugging.
- Vercel monorepo configuration and a deployment/operations guide.
- EAS Android preview APK and iOS Simulator profiles.

### Verified

- Complete repository QA gate.
- Next.js standalone production runtime and public health routes.
- Expo Doctor 20/20.
- Android and iOS production JavaScript exports.
