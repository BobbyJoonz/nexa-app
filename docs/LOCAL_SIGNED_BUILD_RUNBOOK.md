# بیلد APK امضاشدهٔ محلی — ران‌بوک (Windows + این ریپو)

> ✅ **وضعیت: موفق — ۲۰۲۶-۰۸-۲۹.** `app-release.apk` (≈۱۲۱MB، universal) با کلید خودمالک
> ساخته و تأیید شد: `apksigner verify` → `CN=Nexa Sunverter Academy, OU=Mobile, O=Nexa, C=IR`.
> مسیر: `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`

## ۱) کلید امضا (Path A — خودمالک)

- **کلید فعلی (صحت‌سنجی‌شده):** `apps/mobile/credentials/nexa-upload.jks`
  (sha256 `C0163C6A9E7AEBBAA07C87A45702666ACD3591F982DE55B4921F6F805D2492AD`)
- بکاپ: `C:\Users\Lenovo\nexa-keys\backup\nexa-upload-20260829-214249.jks` (sha مطابق)
- رمزها در `apps/mobile/android/keystore.properties` + `credentials.json` (هر دو gitignore)
- ⚠️ **کلیدهای قبلی دور ریخته شدند** (رمز/بکاپِ قدیمی با هم نمی‌خواندند و هیچ‌یک
  امضایی از آن‌ها منتشر نشده بود → از بین بردن بدون ضرر بود). تاریخچهٔ کشف:
  `C:\Users\Lenovo\nexa-keys\keychain-log.txt` (بخش ۲۰۲۶-۰۸-۲۹-۲۲:۴۲)
- **قانون طلایی:** هرگز این jks را پاک/جابه‌جا نکنید؛ هر بیلد بعدی باید همین کلید را امضا کند
  (وگرنه آپدیت روی گوشی‌های نصب‌شده ممکن نخواهد بود).

## ۲) پیش‌نیازهای ماشین

| مورد | مسیر/نسخه | وضعیت |
|---|---|---|
| JDK | `C:\Program Files\Java\jdk-21` | ✅ |
| Android SDK | `C:\Android\Sdk` (build-tools, platforms, ndk) | ✅ |
| `local.properties` | `apps/mobile/android/local.properties` → `sdk.dir=C:/Android/Sdk` | ✅ (prebuild می‌سازد) |
| keystore خودمالک | `apps/mobile/credentials/nexa-upload.jks` + `credentials.json` | ✅ (بکاپ: `C:\Users\Lenovo\nexa-keys\backup\`) |
| `keystore.properties` | `apps/mobile/android/keystore.properties` (storeFile=../credentials/nexa-upload.jks) | ✅ |

## ۲) پیش‌نیازهای کد که قبلاً شکست می‌خوردند (درس‌های واقعی)

1. **`babel-preset-expo` باید dependency مستقیم `@nexa/mobile` باشد** — در node_modules سیمی pnpm از apps/mobile قابل‌حل نیست:
   `pnpm --filter @nexa/mobile exec expo install babel-preset-expo` (کامیت شد).
2. **Sentry upload در بیلد محلی** بدون باینری sentry-cli می‌میرد → در پایان
   `apps/mobile/android/app/build.gradle` (فایل CNG) اضافه شده:
   `gradle.taskGraph.whenReady { tg -> tg.allTasks.findAll { it.name.contains("SentryUpload") ... }.each { it.enabled = false } }` — EAS نام‌تأثیر (android/ رجنیو می‌شود).
3. **حد ۲۶۰ کاراکتری ویندوز در spawning .bat** (بلاکر واقعی): gradle/CMake مسیر
   `node_modules/.pnpm/react-native-worklets@0.10.…\android\build\intermediates\cxx\…\prefab_command.bat` را
   (≈۲۶۰ کاراکتر) با `CreateProcess error=2` رد می‌کند. LongPathsEnabled=1 کافی نیست
   (cmd/ninja یا java longPathAware نیستند)؛ junction روی ریپو هم نه (realpath)؛
   `node-linker=hoisted` هم نه (pnpm همیشه در `.pnpm/<name>@<hash>` سیملینک می‌کند).
   **راه‌حل مؤثر (الان فعال است):** virtual store pnpm به `C:\dev\nexa\node_modules\.pnpm`
   جابه‌جا شده و `node_modules/.pnpm` یک junction به آن است. ⚠️ تا وقتی `pnpm install` کامل
   دوباره اجرا نشود و store جدید نسازد، **`C:\dev\nexa` را پاک/جابه‌جا نکنید** — حذفش
   node_modules را خراب می‌کند.

## ۳) دستور بیلد

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"; $env:ANDROID_HOME = "C:\Android\Sdk"
cd <repo>\apps\mobile\android
.\gradlew.bat --no-daemon assembleRelease
# خروجی: apps\mobile\android\app\build\outputs\apk\release\app-release.apk
```

تأیید امضا:
```powershell
C:\Android\Sdk\build-tools\<version>\apksigner.bat verify --print-certs <apk>
# باید cert با سامانهٔ nexa بدهد، نه debug
```

## ۴) یادداشت‌ها

- `android/`، `credentials/`، `credentials.json`، `keystore.properties` همه gitignore شده‌اند (CNG).
- مسیر کانونی ریلیز همچنان EAS روی کلاود است؛ بیلد محلی یک فال‌بکِ امضاشدهٔ واقعی است
  (اجرای DEVICE_QA را هم می‌تواند پوشش دهد). پس از بیلد محلی، `versionCode` را +1 کن.
- ریشهٔ مشکلِ مسیر (Downloads) با مهاجرت به `C:\dev\nexa` (scripts/migrate-repo-to-c-dev.ps1)
  برای همیشه حل می‌شود؛ آنگاه حتی بدون junction هم بیلد محلی کار می‌کند (مسیر ≈۲۳۷).