# G-D0 — ران‌بوک «دروازهٔ بیلد» (MVP: APK اندروید برای دموی کارفرما)

> هدف: اولین «باینری واقعی» — APK universal امضاشده — روی گوشی دمو نصب شود،
> keystore بکاپ شود، و معیار خروج (باز شدن + آیکون/اسپلش درست + logcat بدون کرش) ثبت شود.
> این تنها بلاکر واقعی MVP است. هر چیزی غیر از این، بعداً.

## ۰) وضعیت پایه (راستی‌آزمایی‌شده در همین جلسه)

| مورد | وضعیت |
|---|---|
| eas.json پروفایل `preview` | ✅ `distribution: internal` + `android.buildType: apk` = **APK universal** |
| eas-cli | ✅ 23.0.0 روی همین ویندوز اجرا می‌شود (`npx eas-cli`) |
| لاگین EAS | ❌ **«Not logged in»** — نقطهٔ صفر |
| `projectId` | ❌ در eas.json نیست → اولین `build` باید پروژه را بسازد/لینک کند |
| شبکهٔ `exp.host` | ❌ 403 روی اینترنتِ بدون VPN → **لاگین و build فقط با VPN** |
| گیت خشکی | ✅ 33 تست + export اندروید/iOS + typecheck سبز (تنها قرمزِ دکتر = چک schema شبکه‌ای که بعد از بیلد مهم نیست) |
| asset ها (آیکون/اسپلش/لوگو/۴ PDF) | ✅ همه موجود |

## ۱) پیش‌نیازها

1. **VPN روشن** (شعبهٔ استانبول/فرانکفورت یا هر سرور خارجی) — بدون آن، همهٔ دستورهای این سند با 403/وقفه می‌میرند.
2. Node 22+ روی این ماشین (الان 22.16 ✓).
3. گوشی اندروید دمو (هر برند، ترجیحاً همان «دستگاه ارزان» که نصاب‌ها دارند) + کابل USB برای logcat (اختیاری برای نصب؛ از لینک دانلود هم نصب می‌شود).
4. یک اکانت Expo (ساخت رایگان در expo.dev — ایمیل + رمز).

## ۲) گام‌های اجرا (به همین ترتیب، یکی‌یکی)

```powershell
cd C:\Users\Lenovo\Downloads\nexa-app-main\nexa-app-main\apps\mobile

# (۱) لاگین — مرورگر باز می‌شود، توکن را تأیید کن
#     اگر مرورگر باز نشد، URL چاپ‌شده را خودت در مرورگر بزن.
npx eas-cli login

# (۲) تأیید لاگین — باید نام اکانت را چاپ کند، نه «Not logged in»
npx eas-cli whoami

# (۳) اتصال پروژه به EAS (ساخت/انتخاب پروژه؛ یک‌بار) — projectId را در eas.json می‌نویسد
npx eas-cli init

# (۴) پیکربندی بیلد/آپدیت (یک‌بار)
npx eas-cli build:configure
npx eas-cli update:configure
```

**قبل از اولین بیلد: adb نصب کن** (این ماشین adb و winget ندارد — برای logcat و نصب با USB لازم است):

```powershell
# winget این ماشین موجود نیست → دانلود دستی (رتوشده) پلتفرم-تولز:
#   ⚠️ dl.google.com و developer.android.com هم مثل exp.host بدون VPN جواب نمی‌دهند — اول VPN.
#   1) https://developer.android.com/tools → Android command line tools → Platform-tools (zip)
#   2) Extract کن به C:\platform-tools
#   3) PATH: setx PATH "$env:PATH;C:\platform-tools"   (ترمینال بعدی اعمال می‌شود)
adb version                             # تأیید
```

## ۳) 🔑 keystore — اول تصمیم، بعد بیلد (دو مسیر؛ A پیشنهادی)

> کلید امضا = مالکیت اپ. هر بیلد بعدی باید با **همین** کلید امضا شود وگرنه
> روی دستگاه‌های قبلی نصب نمی‌شود. بدون بکاپ، کلید از دست رفته = پایان پروژه.

### مسیر A — keystore خودمالک (پیشنهادی؛ JDK 21 روی همین ماشین موجود است ✓)

> همهٔ مسیرها نسبی به `apps/mobile/` هستند (هم‌جا با eas.json) — keystorePath در
> credentials.json باید **نسبی** باشد تا EAS آن را پیدا کند؛ مسیر مطلق نمی‌شود.

```powershell
cd C:\Users\Lenovo\Downloads\nexa-app-main\nexa-app-main\apps\mobile

# (A1) توليد کلید — یک بار برای همیشه؛ PASSWORD را خودت بساز/به خاطر بسپار
New-Item -ItemType Directory -Force -Path credentials | Out-Null
keytool -genkeypair -v -keystore credentials\nexa-upload.jks `
  -alias nexa -keyalg RSA -keysize 2048 -validity 10000 `
  -storepass <PASSWORD> -keypass <PASSWORD> `
  -dname "CN=NEXA Sunverter Academy, OU=Mobile, O=NEXA, L=Tehran, C=IR"

# (A2) معرفی به EAS — فایل credentials.json (پسورد دارد؛ gitignore شده)
#      در apps/mobile/credentials.json با این محتوا:
#      { "android": { "keystore": {
#          "keystorePath": "credentials/nexa-upload.jks",
#          "keystorePassword": "<PASSWORD>",
#          "keyAlias": "nexa",
#          "keyPassword": "<PASSWORD>" } } }
```

- بکاپ = کپی `credentials\nexa-upload.jks` + پسوردها در **دو جای آفلاین** (فلش + ابر شخصی). بدون وابستگی به سرور اکسپو.
- `credentials.json` و پوشهٔ `credentials/` از گیت خارج‌اند (قانون .gitignore؛ اگر `git status` آن‌ها را نشان داد، فوراً متوقف شو).

### مسیر B — keystore مدیریت‌شدهٔ اکسپو (فال‌بک؛ صفر تنظیم محلی)

- فقط `credentials.json` را نداشته باش و بیلد را **تعاملی** اجرا کن؛ CLI می‌پرسد keystore بسازد → YES.
- بکاپ: `npx eas-cli credentials -p android` → نمایش/دانلود کلید (اگر نسخه‌ات فقط خلاصه نشان داد، خلاصه + نام + hash را ثبت کن و گزینهٔ دانلود را زیر منوها پیدا کن؛ در نسخه‌های مدیریت‌شده، دانلود از همین منو ممکن است).
- ریسک شناخته‌شده: کلید روی سرور اکسپو می‌ماند — بکاپ آفلاین از آن گرفته نشود = قفل شدن به اکسپو.

## ۴) بیلد — فقط همین یکی سخت است (۱۵–۳۰ دقیقه روی کلاود اکسپو)

```powershell
npx eas-cli build --platform android --profile preview
# تعاملی نگهش دار (بدون --non-interactive): اگر مسیر A را رفتی هیچ سؤالی نمی‌پرسد؛
# اگر مسیر B را رفتی، اولین بار دربارهٔ ساخت keystore می‌پرسد → YES.
```

خروجی: یک URL (صفحهٔ بیلد) و بعد از اتمام، **لینک دانلود APK** — همان را روی گوشی باز کن.

## ۵) نصب روی گوشی

- **راه A (ساده):** لینک APK را روی گوشی باز کن → دانلود → نصب (فعال‌کردن «نصب از منابع ناشناس» در تنظیمات).
- **راه B (USB + adb، برای logcat لازم است):**
  ```powershell
  # فعال‌سازی Developer options + USB debugging روی گوشی؛ سپس:
  adb devices                    # دستگاه دیده شود
  adb install -r <path-to.apk>
  ```

## ۶) تأیید معیار خروج (logcat — فقط راه B)

```powershell
adb logcat -d | Select-String -Pattern "FATAL EXCEPTION|AndroidRuntime"
# خروجیِ خالی = هیچ کرش لانچی. اگر خطی آمد: بیلد/فیکس لازم است.
adb shell dumpsys activity activities | Select-String -Pattern "mResumedActivity"
# باید com.nexa.sunverteracademy را نشان دهد = اپ در پیش‌زمینه زنده است
```

چک‌لیست معیار خروج G-D0 (همه باید ✓):
- [ ] اپ باز می‌شود و لودر برند (۷۰۰ms) دیده می‌شود
- [ ] آیکون/اسپلش درست (نه مربع سفید/جایگزین)
- [ ] هیچ `FATAL EXCEPTION` در logcat لانچ
- [ ] صفحهٔ زبان fa/en ظاهر می‌شود
- [ ] keystore بکاپ آفلاین گرفته شده (مسیر A = فایل خودت؛ مسیر B = خروجی credentials)
- [ ] خروجی `npx eas-cli whoami` = نام اکانت (ثبت برای همین جلسه)

## ۷) اگر بیلد شکست خورد — ماتریس

| خطا | محتمل‌ترین علت | راه |
|---|---|---|
| 403 / timeout در ابتدای build | VPN قطع/ضعیف | VPN را عوض کن، `eas build` دوباره |
| «A project with the name… already exists» | init تکراری | همان پروژه را انتخاب کن |
| خطای schema در `expo-doctor` | 403 شبکه‌ای (`exp.host`) — شناخته‌شده | بی‌تأثیر روی بیلد؛ نادیده بگیر |
| «User interaction is not allowed in non-interactive mode» | (فقط اگر --non-interactive زدی) | تعاملی اجرا کن — این سند عمداً آن را حذف کرده |
| خطای credentials.json در build | مسیر/پسورد keystore | مسیر نسبی باش (credentials/…)؛ پسوردها با فایل یکسان |
| نصب روی گوشی: «برنامه نصب نشد» | امضای کرش/حافظه | APK را دوباره دانلود؛ حافظه خالی کن |
| نصب «نسخهٔ جدید» بعداً رد می‌شود | versionCode مساوی | همیشه قبل از بیلد بعدی `versionCode` را یک واحد زیاد کن (فعلاً 2) |

## ۸) نسخه‌بندی برای بیلدهای بعدی (قانون)

`preview` خودکار زیاد نمی‌کند (`autoIncrement` فقط در production) → **قبل از هر بیلد preview بعدی،**
در `apps/mobile/app.json → expo.android.versionCode` را +1 کن. با همین keystore، نصب روی نسخهٔ قبلی ممکن می‌شود.