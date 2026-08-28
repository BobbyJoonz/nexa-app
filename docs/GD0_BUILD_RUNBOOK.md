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
npx eas-cli login

# (۲) تأیید لاگین — باید نام اکانت را چاپ کند، نه «Not logged in»
npx eas-cli whoami

# (۳) اتصال پروژه به EAS (ساخت/انتخاب پروژه؛ یک‌بار) — projectId را در eas.json می‌نویسد
npx eas-cli init
#    اگر init سؤال «use the project with id…» داد: YES

# (۴) پیکربندی بیلد/آپدیت (یک‌بار)
npx eas-cli build:configure
npx eas-cli update:configure

# (۵) بیلد — فقط همین یکی سخت است؛ حدود ۱۵–۳۰ دقیقه روی کلاود اکسپو
npx eas-cli build --platform android --profile preview --non-interactive
#    اگر خواست keystore جدید بسازد → YES (managed؛ اکسپو نگهش می‌دارد)
```

خروجی: یک URL (صفحهٔ بیلد) و بعد از اتمام، **لینک دانلود APK**.

## ۳) نصب روی گوشی

- **راه A (ساده):** لینک APK را روی گوشی باز کن → دانلود → نصب (فعال‌کردن «نصب از منابع ناشناس» در تنظیمات).
- **راه B (USB + adb، برای logcat لازم است):**
  ```powershell
  # فعال‌سازی Developer options + USB debugging روی گوشی؛ سپس:
  adb devices                    # دستگاه دیده شود
  adb install -r <path-to.apk>
  ```

## ۴) 🔑 بکاپ keystore — بلافاصله بعد از بیلد، قبل از هر چیز دیگر

قانون قفل‌شدهٔ AGENTS: «بکاپ keystore غیرقابل‌جبران‌ترین ریسک». نبود آن = ناتوانی در نصب نسخهٔ بعدی روی همین گوشی‌ها.

1. `npx eas-cli credentials` → پلتفرم Android → گزینهٔ نمایش/download keystore (وارد کردن رمز).
2. فایل `.jks` + رمز + alias را **در دو جای آفلاین** ذخیره کن (فلش + درایو ابری شخصی).
3. `eas.json` + `app.json` (versionCode) را در همان جعبه ثبت کن تا نسخه‌بندی بعدی زنجیره شود.
   ⚠️ **«Keystore مدیریت‌شدهٔ اکسپو» روی سرورهای اکسپو می‌ماند** — برای استقلال از اکسپو، همیشه کپی آفلاین بگیر.

## ۵) تأیید معیار خروج (logcat — فقط راه B)

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
- [ ] keystore بکاپ آفلاین گرفته شده
- [ ] خروجی `npx eas-cli whoami` = نام اکانت (ثبت برای همین جلسه)

## ۶) اگر بیلد شکست خورد — ماتریس

| خطا | محتمل‌ترین علت | راه |
|---|---|---|
| 403 / timeout در ابتدای build | VPN قطع/ضعیف | VPN را عوض کن، `eas build` دوباره |
| «A project with the name… already exists» | init تکراری | همان پروژه را انتخاب کن |
| خطای schema در `expo-doctor` | 403 شبکه‌ای (`exp.host`) — شناخته‌شده | بی‌تأثیر روی بیلد؛ نادیده بگیر |
| نصب روی گوشی: «برنامه نصب نشد» | امضای کرش/حافظه | APK را دوباره دانلود؛ حافظه خالی کن |
| نصب «نسخهٔ جدید» بعداً رد می‌شود | versionCode مساوی | همیشه قبل از بیلد بعدی `versionCode` را یک واحد زیاد کن (فعلاً 2) |

## ۷) نسخه‌بندی برای بیلدهای بعدی (قانون)

`preview` خودکار زیاد نمی‌کند (`autoIncrement` فقط در production) → **قبل از هر بیلد preview بعدی،**
در `apps/mobile/app.json → expo.android.versionCode` را +1 کن. با همین keystore، نصب روی نسخهٔ قبلی ممکن می‌شود.