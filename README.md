# NEXA Sunverter Academy

A production-oriented bilingual education product for the NEXA CM3500-24S hybrid solar inverter. The repository contains a Next.js web app, an Expo Android/iOS app, shared validated content, original source documents, generated technical diagrams, edited NEXA product imagery, tests, and audit reports.

Release `1.1.0` hardens startup on web and mobile, adds the exact NEXA wordmark fill loader, provides branded error recovery, and adds safe live diagnostics. There is no login or registration gate: the first interactive screen is language selection.

## Verified product scope

- Model: `CM3500-24S`
- Rated output: 3.5 kVA / 3.5 kW
- Battery system: 24 VDC
- Languages: Persian and English
- Source status: verified from the supplied Persian and English manuals
- Second model: intentionally unavailable because no model-specific image, manual, or datasheet was supplied

No 6.5 kW specifications are inferred or copied from the 3.5 kW model.

## Repository map

```text
apps/
  web/                 Next.js 16 production application
  mobile/              Expo SDK 57 React Native application
packages/
  design-tokens/       Shared brand, spacing, radius, and motion tokens
  i18n/                Shared Persian/English dictionaries and glossary
  product-content/     Source-backed lessons, settings, faults, and specs
  schemas/             Runtime Zod contracts
  shared-logic/        Progress and storage logic
  icons/               Semantic icon contract
  illustrations/       Diagram asset contract
  ui-contracts/        Cross-platform component contracts
assets/
  brand/               Exact supplied NEXA logo source
  products/            Original and edited product imagery
  diagrams/            Generated production SVG diagrams
source-documents/      Preserved supplied PDFs and project brief
docs/                  Audit, design, content, asset, and QA reports
scripts/               Automated content, translation, brand, and link checks
tests/                 Automated shared logic and content tests
```

## Requirements

- Node.js 22.13 or newer
- pnpm 11.18
- For Android native builds: Android Studio, Android SDK, JDK 17
- For iOS native builds: macOS, Xcode, CocoaPods
- For cloud device builds: an Expo account and EAS CLI

## Install

```bash
corepack enable
pnpm install
```

## Run the web app

```bash
pnpm dev:web
```

Open `http://localhost:3000`.

Production:

```bash
pnpm build:web
pnpm start:web
```

The Next.js app uses standalone output and is ready for a conventional Node.js deployment.

Live health endpoints:

```text
/api/health
/diagnostics
```

For a public review build, see [Free deployment and live debugging](docs/DEPLOYMENT_AND_LIVE_DEBUG.md).

## Run the mobile app

```bash
pnpm dev:mobile
```

Then open it in an Android emulator, iOS simulator, development build, or compatible Expo client.

Native development builds:

```bash
pnpm android
pnpm ios
```

Generate native projects without committing them:

```bash
pnpm --filter @nexa/mobile prebuild
```

EAS build readiness:

```bash
cd apps/mobile
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform ios --profile simulator
npx eas-cli build --platform ios --profile production
```

The Android application ID and iOS bundle identifier are both `com.nexa.sunverteracademy`. The first EAS configuration run associates the repository with the owner's Expo project.

## Quality gates

Run the complete repository gate:

```bash
pnpm qa
```

Individual commands:

```bash
pnpm validate:content
pnpm check:translations
pnpm check:branding
pnpm check:links
pnpm typecheck
pnpm test
pnpm build:web
pnpm --filter @nexa/mobile run doctor
```

## Product safety

The apps are educational companions. They do not control hardware and do not replace the official manual, protective devices, local electrical rules, or a qualified installer. Live wiring, enclosure opening, and internal repair are explicitly outside the user workflow.

## Reports

- [Source audit](docs/SOURCE_AUDIT.md)
- [Content map](docs/CONTENT_MAP.md)
- [Product data conflicts](docs/PRODUCT_DATA_CONFLICTS.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Architecture](docs/ARCHITECTURE.md)
- [QA report](docs/QA_REPORT.md)
- [Free deployment and live debugging](docs/DEPLOYMENT_AND_LIVE_DEBUG.md)
