# Free deployment and live debugging

This repository remains the source of truth. A hosted preview is only a deployment target for the real `apps/web` source and never replaces the Next.js or Expo projects.

## Recommended setup

| Need | Recommended service | Why | Important limit |
|---|---|---|---|
| Fast public Next.js preview | Vercel Hobby | Native Next.js support, Git previews for each commit, HTTPS URL | Hobby is intended for personal, non-commercial use |
| Commercial free-usage alternative | Cloudflare Workers Free with OpenNext | Supports modern Next.js and has a free request allowance | More configuration and operational work than Vercel |
| Android installable preview | Expo EAS Build Free, `preview` profile | Produces a shareable APK without a local Android toolchain | Free currently includes up to 15 Android builds in a low-priority queue |
| iOS code/build validation | Expo EAS Build Free, `simulator` profile | Produces an iOS Simulator build without store submission | A real iPhone/App Store build still needs Apple signing access |
| Mobile JavaScript updates | EAS Update Free | Publish fixes to an already installed compatible build | Expo project linking must be completed first |

## Web: the shortest reliable path

1. Put this entire monorepo in a private or public Git repository. Do not upload only `apps/web`; the app consumes workspace packages.
2. In Vercel, create a new project from that repository.
3. Set **Root Directory** to `apps/web`.
4. Enable **Include source files outside of the Root Directory in the Build Step** because the web app imports `packages/*` from the monorepo.
5. Keep **Framework Preset** as `Next.js`.
6. Keep the detected install and build commands. If manual values are required, use `pnpm install` and `pnpm build`.
7. Add these optional public environment variables:

   ```text
   NEXT_PUBLIC_APP_VERSION=1.1.0
   NEXT_PUBLIC_BUILD_COMMIT=<short commit id>
   ```

8. Deploy, then open all three URLs:

   ```text
   https://YOUR-DOMAIN/
   https://YOUR-DOMAIN/models
   https://YOUR-DOMAIN/diagnostics
   ```

The last URL is safe to share for live debugging. Send the full diagnostics URL, the approximate failure time, device/browser name, and a screenshot. It exposes only service status, product model, release version, public build identifier, browser connectivity, and whether local storage works.

### Commercial use

Vercel Hobby should not be treated as a free commercial production plan. For a commercial NEXA deployment, use a paid Vercel plan or deploy Next.js to Cloudflare Workers with the official OpenNext adapter. Cloudflare Workers Free currently includes 100,000 requests per day. Do not deploy this full-stack Next.js build as a static Cloudflare Pages site.

## Mobile: Android and iOS

From the repository root:

```bash
corepack enable
pnpm install
pnpm deploy:check
cd apps/mobile
pnpm dlx eas-cli login
pnpm dlx eas-cli build:configure
```

`build:configure` links the app to the owner's Expo account and writes the real Expo project ID. The repository deliberately does not invent that account-specific ID.

### Android shareable APK

```bash
pnpm dlx eas-cli build --platform android --profile preview
```

The returned EAS link can be opened on an Android device to download the APK.

### iOS Simulator build

```bash
pnpm dlx eas-cli build --platform ios --profile simulator
```

For a physical iPhone or App Store release, run the `production` profile and complete Apple signing with the owner's Apple Developer account.

### Publish compatible JavaScript updates

Run this once after project linking:

```bash
pnpm dlx eas-cli update:configure
```

Then publish a tested update:

```bash
pnpm dlx eas-cli update --channel preview --message "Describe the verified fix"
```

Do not use EAS Update for native dependency, permission, bundle identifier, or native configuration changes; those require a new build.

## Release workflow

1. Create a short-lived branch for each fix.
2. Run `pnpm deploy:check` before pushing.
3. Inspect the Vercel preview URL on mobile and desktop.
4. Open `/diagnostics` and confirm all checks except optional storage are green.
5. Merge only after the preview passes.
6. Create a new EAS build when native configuration changes; otherwise publish a preview update first.
7. Record the public build identifier and test result in `docs/QA_REPORT.md`.

## What changed in release 1.1.0

- Replaced fragile boot sequencing with an explicit, bounded bootstrap state.
- Made font splash calls and storage persistence non-fatal.
- Prevented language selection from being blocked by an AsyncStorage write failure.
- Added route-level and root-level branded recovery screens.
- Added an exact NEXA wordmark fill loader for web and mobile with reduced-motion support.
- Added `/api/health` and `/diagnostics` for safe live inspection.
- Added a shareable Android APK profile and an unsigned iOS Simulator profile.

## Official references checked for this release

- [Vercel monorepo configuration](https://vercel.com/docs/monorepos)
- [Vercel monorepo root-directory FAQ](https://vercel.com/docs/monorepos/monorepo-faq)
- [Vercel plan terms](https://vercel.com/pricing)
- [Next.js on Cloudflare Workers with OpenNext](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Cloudflare Workers pricing and free limits](https://developers.cloudflare.com/workers/platform/pricing/)
- [Expo EAS pricing](https://expo.dev/pricing)
- [Expo Android APK builds](https://docs.expo.dev/build-reference/apk/)
- [Expo iOS Simulator builds](https://docs.expo.dev/build-reference/simulators/)
- [Expo EAS Update setup](https://docs.expo.dev/eas-update/getting-started/)
