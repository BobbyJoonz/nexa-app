# AGENTS.md — قرارداد کار برای هر ایجنتی که روی این ریپو کار می‌کند

> این فایل حافظهٔ کاری پروژه است. قبل از هر تغییر بخوانش؛ با قواعد آن نجنگ.

## ۱) شناسنامهٔ پروژه

- مونوریپو pnpm: `nexa-sunverter-academy` v1.1.0 — `packageManager: pnpm@11.18.0` (پین‌شده)، Node >=22.13
- `apps/web`: Next.js 16 standalone · `apps/mobile`: Expo SDK 57 (expo-router، RN new arch، **CNG** — پوشه‌های android/ios کامیت نمی‌شوند)
- پکیج‌ها: `@nexa/design-tokens` (رنگ/فاصله/شعاع)، `@nexa/i18n`، `@nexa/product-content` (منبع حقیقت محتوا)، `@nexa/shared-logic`
- شناسهٔ اندروید: `com.nexa.sunverteracademy` · زبان اصلی محتوا: فارسی (fa) + انگلیسی

## ۲) ⭐ اولویت پلتفرم — قانون شمارهٔ یک

**تمرکز اصلی تا تکمیل: اندروید.** مسیر: بیلد EAS پروفایل `preview` (APK امضاشده) → تست دستگاه واقعی → توزیع مستقیم/بازار. سپس **ارتقا به iOS** (Expo Go برای تست رایگان فعلی؛ TestFlight فقط پس از اکانت $99).

اما «فوکوس اندروید» یعنی ترتیب صیقل‌دادن است، نه شکستن iOS:
- هر تغییر باید iOS را کامپایل و باندل‌پذیر نگه دارد — گیت `pnpm qa:mobile` عمداً `export:ios` هم اجرا می‌کند تا خطای شاخهٔ iOS **قبل از هزینهٔ بیلد مک در EAS** لو برود.
- هیچ کدی ننویس که فقط روی اندروید کار کند و iOS را کرش دهد یا type-break کند.

## ۳) لایهٔ UI تطبیقی (HIG ↔ Material 3)

- ساختار کنترل‌ها دو شخصیت دارند: **iOS = HIG** (dim opacity، گوشهٔ 12، chevron بازگشت)، **اندروید = M3** (ripple، pill کامل، فلش بازگشت). برند (رنگ/فونت/محتوا) مشترک است.
- قوانین کامل: `docs/PLATFORM_UI.md` — خلاصهٔ سخت‌گیرانه:
  1. انشعاب پلتفرمی فقط داخل `apps/mobile/src/ui/` یا فایل‌های `.ios.tsx/.android.tsx` — هرگز داخل صفحه‌ها.
  2. کنترل تعاملی جدید از `PressableSurface` مشتق شود، نه `Pressable` خام.
  3. آیکون جهت‌دار فقط از `dirIconName(locale, ltr, rtl)` — Ionicons خودش RTL را آینه نمی‌کند.
  4. háptیک فقط از wrapper `src/ui/haptics.ts`.
  5. المان گردِ اندرویدی که ripple دارد: `overflow: "hidden"` یادت نرود.
  6. استثناها را دست نزن: کلیدهای شبیه‌ساز LCD (شبیه‌سازی سخت‌افزار است) و ErrorBoundary در `_layout.tsx` (مسیر crash باید بی‌وابستگی بماند — `useAcademy` خارج Provider پرتاب می‌کند).

## ۴) رهنمون OTA / آپدیت (EAS Update) — تصمیم JS یا بیلد؟

پیکربندی فعلی: `updates.checkAutomatically="ON_LOAD"`، `fallbackToCacheTimeout=0`، `runtimeVersion.policy="appVersion"`، کانال‌های `development|preview|production` در `eas.json`.

**قاعده:** هر تغییر را قبل از commit دسته‌بندی کن:

| نوع تغییر | مسیر انتشار | روی دستگاه‌های نصب‌شده |
|---|---|---|
| فقط JS/TS/محتوا/استایل (صفحه، متن، منطق، asset از طریق bundle) | `cd apps/mobile && npx eas-cli update --branch <کانال متناظر>` | **خودکار** — دانلود در لانچ بعدی، بدون استور، بدون کارِ کاربر |
| ماژول نیتیو جدید/آپدیت‌شده، ارتقای expo/RN، تغییرات نیتیو app.json (نام/آیکون/splash/version/versionCode/مجوز/plugin) | بیلد جدید EAS + توزیع مجدد | هرگز OTA نمی‌شود |
| bump کردن `version` در app.json | runtimeVersion عوض می‌شود → خط OTA قبلی قطع | نیاز به باینری جدید |

جزئیات کامل + rollback: `docs/EAS_UPDATE_RUNBOOK.md`.

**وضعیت فعلی: OTA خفته است.** تا وقتی مالک `eas-cli login` → `build:configure` → `update:configure` را نزند و بیلد #۱ (که `expo-updates` داخلش پخته شده) پخش نشده باشد، هیچ آپدیتی به هیچ دستگاهی نمی‌رسد. بعد از آن: انتشار = یک دستور، اعمال = خودکار.

**تأدیب نیتیو:** افزودنی نیتیو (مثل `expo-haptics ~57.0.0`) باید قبل از بیلد #۱ وارد شود؛ افزودن نیتیو بعد از پخش یعنی بیلد اجباری جدید برای همه. هر پیشنهاد نیتیو جدید اول سؤال کن: «می‌ارزد یک بیلد جدید؟»

## ۵) تصمیمات قفل‌شده — بدون هماهنگی تغییر نده

- خروجی ریلیس اندروید = **APK universal امضاشده** (توزیع مستقیم + بازارهای ایرانی). AAB فقط در صورت نیاز واقعی Play.
- بکاپ keystore بلافاصله بعد از بیلد #۱ (`eas credentials`) — غیرقابل‌جبران‌ترین ریسک.
- CNG: `apps/mobile/android/`, `apps/mobile/ios/`, `.expo/` در `.gitignore` می‌مانند — prebuild کامیت نشود.
- دست‌نزدنی‌ها: `I18nManager.forceRTL`، کف ۷۰۰ms برندلودر (`_layout.tsx`)، معماری i18n فعلی، رنگ‌ها/فونت برند.
- iOS رایگان فقط: Expo Go (dev) — ipa/TestFlight بدون اکانت $99 ممکن نیست.

## ۶) گیت کیفیت و محیط

- گیت موبایل: `pnpm qa:mobile` (محتوا + ترجمه + برند + tsc + vitest + doctor + export اندروید **و** iOS). ناهم‌ترازی وابستگی: `pnpm --filter @nexa/mobile exec expo install --fix`.
- **ترتیب qa:mobile را دست نزن:** چون `experiments.typedRoutes = true` است، `typecheck` باید **بعد از** `export:android`/`export:ios` بیاید — export ها `.expo/types/router.d.ts` را بازتولید می‌کنند و مسیرهای جدید (`/search`, `/checklist`) تا قبل از آن در تایپ‌ها نیستند و typecheck بی‌دلیل قرمز می‌شود.
- **pnpm را با `corepack pnpm` یا شیم `tools/pnpm/` اجرا کن، نه pnpm سراسری:** pnpm های npm-global این ماشین (v10) store-dir شکستهٔ drive-relative دارند (`D:pnpm-store\v10`) و با کد -90 در هر `install` می‌میرند. شیم همیشه به نسخهٔ قفل‌شدهٔ `packageManager` هدایت می‌کند. در گیت: `$env:PATH = "<root>\tools\pnpm;$env:PATH"` قبل از اجرا.
- برخی نشست‌ها shell خراب دارند (کرش 0xC0000142 هنگام spawn هر پروسه، حتی ripgrep) → اگر pwsh/glob/grep مردند، فقط ابزارهای read/write/edit/glob؟ نه — فقط file tools؛ مراحل shell را به کاربر تحویل بده و بعداً با `read` وریفای کن (lockfile، خروجی‌ها).
- محل پروژه در Downloads است؛ پیشنهاد بلندمدت: انتقال به `C:\dev\nexa` + `git config core.longpaths true`.

## ۷) وضعیت جاری (checklist زنده)

- [x] سیم‌کشی OTA (وابستگی، app.json، کانال‌ها، runbook) — خفته تا لاگین EAS
- [x] لایهٔ UI تطبیقی کامل + جایگزینی در صفحه‌ها + `expo-haptics`
- [x] `qa:mobile` دوراهی (export:android + export:ios)
- [x] ماشین‌حساب سازگاری منبع‌دار (`app/calculator.tsx`) + موتور خالص `shared-logic/src/sizing.ts` + `tests/sizing.test.ts` + استخراج‌گر `deviceLimits` در product-content (پرتاب خطا روی انحراف محتوا)
- [x] Sentry سیم‌کشی شد و تصمیمش نهایی است (داخل بیلد #۱) — الگوی خفته با `extra.sentry.dsn`
- [x] نوار بازخورد محتوا روی همهٔ Screenها — **تلگرام فعال است** (`https://t.me/imma_bobby`)؛ ایمیل خفته تا تعریف صندوق پشتیبانی (`FEEDBACK_EMAIL` در `src/ui/feedback.tsx`)
- [x] **فاز ابزار میدانی:** آکادمی = `app/academy/[model].tsx` (مسیر اصلی و از پیش موجود — probe ناقص قبلی «بن‌بست» را اشتباه نتیجه گرفت؛ فایل تکراری داینامیک `[slug].tsx` که در فاز ۱ ساخته شده بود **حذف شد** — دو route داینامیک در یک پوشه، خطای bundle است)، شبیه‌ساز LCD روی منوی ۳۱ برنامهٔ واقعی (`components/lesson/lcd-simulator.tsx` — با پنل آموزشی زیر هر برنامه)، کوییز منبع‌دار (`quizBank` + `components/lesson/quiz-lesson.tsx`)، جست‌وجوی سراسری + گرید کد خطا (`app/search.tsx`)، چک‌لیست راه‌اندازی آفلاین (`app/checklist.tsx` + `storageKeys.commissioningChecklist`)، تست یکپارچگی `tests/content-consistency.test.ts` — همه JS و آمادهٔ اولین OTA
- [x] تبلیغ‌خلا: کارت مدل دوم از صفحهٔ ورودی حذف شد (داده در content ماند؛ تا منبع برسد UI قول جعلی نمی‌دهد)
- [x] گیت A (این ماشین): نصب با pnpm@11.18.0 قفل‌شده ✓؛ هم‌ترازی SDK 57 (شامل `@sentry/react-native@~7.11.0`، expo 57.0.18) ✓؛ فیکس واقعی‌ها: بگ «فرم خالی شارژ = pass جعلی» → skipped (`sizing.ts`)، مسیر پلاگین سنتری → `.../expo`، dedupe `expo-constants` با override در `pnpm-workspace.yaml`، import غلط `ReactNode` از react-native، null در accessibilityLabel. **33 تست ✓، هر دو export ✓ (андроید 5.2MB / ios 4.9MB)، تایپ‌چک ✓** — تنها قرمزِ دکتر = schema اپ که `exp.host` روی این شبکه 403 می‌دهد (شبکه، نه پروژه)
- [x] **فاز ۲ — M2 پاک‌سازی i18n:** صفحهٔ زبان (`index.tsx`) و ErrorBoundary (`_layout.tsx`) حالا از دیکشنری `@nexa/i18n` می‌خوانند (کلیدهای جدید `language.selfFa/selfEn/ctaFa/ctaEn` و `error.title/body/retry`؛ متن دیکشنری با UI ارسال‌شده هم‌تراز شد). ErrorBoundary عمداً provider-free ماند با پیش‌فرض fa (قانون AGENTS §3). **گارد ضدبازگشت در `check-translations.ts`:** هر رشتهٔ فارسی خام در همین دو فایل = خطای گیت. بقیهٔ صفحه‌ها همچنان الگوی ternary دوزبانهٔ مستند دارند — بازآرایی کامل i18n در بک‌لاگ است و عمداً خارج از M2 ماند
- [x] **G-D0/G-D1 آماده‌سازی (MVP دموی کارفرما):** ران‌بوک بیلد `docs/GD0_BUILD_RUNBOOK.md` (لاگین→init→build:configure→update:configure→بیلد preview→بکاپ keystore→تأیید logcat؛ `whoami` فعلاً «Not logged in») + چک‌لیست دستگاه `docs/DEVICE_QA.md` (۱۲ سناریو با اعداد منبعِ ماشین‌حساب و پروتکل شکست) + فیکس ضدضربهٔ deep-link: `academy/[model].tsx` دیگر برای مدل نامعتبر صفحهٔ سفید نمی‌دهد («این مدل پیدا نشد» + back) — typecheck ✓ و export اندروید ✓ سبز
- [ ] **⚠️ شبکه:** `exp.host` روی این اینترنت 403 دارد → لاگین EAS، `eas update` و برخی چک‌های دکتر فقط با VPN/پراکسی کار می‌کنند. خود بیلد EAS روی کلاود است و ایرادی ندارد.
- [ ] **مالک — G-D0:** با VPN: `eas login` → `eas init` → `build:configure` + `update:configure` → `eas build -p android --profile preview` → بکاپ keystore → نصب روی گوشی دمو → معیار خروج ران‌بوک (باز شدن + logcat بی‌کرش)
- [ ] **مالک — G-D1:** اجرای `docs/DEVICE_QA.md` (۱۲/۱۲ سبز، بدون کرش) پس از نصب APK
- [ ] **مالک:** پروژهٔ رایگان sentry.io بسازد، DSN را در `app.json → expo.extra.sentry.dsn` بگذارد (بعداً با OTA قابل به‌روزرسانی است)؛ توکن symbolication هم اختیاری در EAS secrets
- [ ] **مالک (اختیاری):** اگر صندوق ایمیل پشتیبانی تعریف شد، `FEEDBACK_EMAIL` را در `apps/mobile/src/ui/feedback.tsx` پر کنید — دکمهٔ تلگرام همین حالا زنده است
