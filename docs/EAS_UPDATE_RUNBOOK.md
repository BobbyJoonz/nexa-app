# EAS Update Runbook

Operational guide for over-the-air (OTA) JavaScript updates of `apps/mobile`.
This document is the source of truth for how updates are wired, published, and rolled back.

## Current wiring status

| Piece | Status | Where |
|---|---|---|
| `expo-updates` dependency | Wired (`^57.0.0`) | `apps/mobile/package.json` |
| Offline-first update policy | Wired: `checkAutomatically: "ON_LOAD"`, `fallbackToCacheTimeout: 0` | `apps/mobile/app.json` → `expo.updates` |
| Runtime version policy | Wired: `appVersion` | `apps/mobile/app.json` → `expo.runtimeVersion` |
| Build profile ↔ update channel binding | Wired: `development`, `preview`, `production` | `apps/mobile/eas.json` |
| Expo project ID + updates URL | **Pending owner account step** | written by `eas-cli build:configure` / `update:configure` |

The updates URL is intentionally absent until the repository is linked to the owner's
Expo project. Without it, `expo-updates` stays dormant and harmless: every build runs
from its embedded bundle. Linking activates OTA without any further code change.

## Policy rationale

- **`fallbackToCacheTimeout: 0`** — launch never waits on the network. The app starts
  from the embedded or last-cached bundle immediately; a newer bundle, if any, is
  downloaded in the background and applies on the next restart. Field technicians on
  unstable connections get identical startup behavior online or offline.
- **`checkAutomatically: "ON_LOAD"`** — each cold start performs one silent check.
  No manual UI is required to stay current.
- **`runtimeVersion.policy: "appVersion"`** — an OTA update may only replace the JS
  bundle of builds sharing the same `expo.version`. Any native change (dependency,
  permission, plugin, identifier) requires a new native build with a bumped version.
  This is the simplest policy that can never ship an incompatible bundle.

## One-time activation (requires the owner's Expo account)

From the repository root:

```bash
pnpm install                      # resolves expo-updates into the lockfile
cd apps/mobile
pnpm dlx eas-cli login            # owner account only
pnpm dlx eas-cli build:configure  # writes expo.extra.eas.projectId
pnpm dlx eas-cli update:configure # writes expo.updates.url
```

Commit both `app.json` changes before building. Verify with:

```bash
pnpm doctor:mobile                # expo-doctor validates dependency/SDK alignment
pnpm qa:mobile                    # fast mobile gate incl. local Android export pre-flight
```

If `expo-doctor` reports a version mismatch for `expo-updates`, run
`pnpm --filter @nexa/mobile exec expo install --fix` and commit the corrected range.

## Publishing an update

1. Make the JavaScript-only change. Never use OTA for native dependency, permission,
   bundle identifier, icon, splash, or plugin changes.
2. From the root run the mobile gate:

   ```bash
   pnpm qa:mobile
   ```

3. Publish to the channel matching the installed base you target:

   ```bash
   cd apps/mobile
   pnpm dlx eas-cli update --channel preview --message "Describe the verified fix"
   ```

4. On a device: restart the app twice (first restart downloads, second applies).

## Channel map

| Build profile | Channel | Audience |
|---|---|---|
| `development` | `development` | dev-client builds; updates bypassed while developing |
| `preview` | `preview` | shareable APK used by dealers/installers for review |
| `production` | `production` | released production binaries |

A build only ever receives updates published to its own channel.

## Rollback

```bash
cd apps/mobile
pnpm dlx eas-cli update:list --channel preview
pnpm dlx eas-cli update:republish --channel preview --group-id <previous-group-id>
```

Republishing the previous group re-points the channel instantly; devices pick it up
on their next check/restart.

## Quota note

Free-tier EAS Update allowances are limited and have changed over time — verify the
current limits at <https://expo.dev/pricing> before publishing routinely. Batch small
fixes into one reviewed update instead of publishing per commit.
