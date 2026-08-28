# PLATFORM_UI — قواعد لایهٔ UI تطبیقی iOS / اندروید

> قرارداد: «کلیات یکی، شخصیت لمسی دوتا.» برند (رنگ/فونت/لوگو/محتوا) مشترک است؛
> ساختار کنترل‌ها روی iOS مطابق HIG و روی اندروید مطابق Material 3 رندر می‌شود.

## معماری

```
apps/mobile/src/ui/
├─ platform.ts            ← isIOS · selectUI(ios, android) · متریک‌های OS (هدف لمس، شعاع، وزن قلم)
├─ direction.ts           ← dirIconName(locale, ltr, rtl) · isRTL · dirRow (آینه‌سازی RTL متمرکز)
├─ haptics.ts             ← tap/success/warning — همیشه fail-safe
├─ pressable-surface.tsx  ← پریمیتیو لمس: Android = ripple foreground · iOS = dim opacity
├─ icon-button.tsx        ← دکمهٔ دایره‌ای 44pt/48dp برای هدرها و اورلی‌ها
└─ button/
   ├─ types.ts            ← قرارداد ButtonProps (منبع واحد تایپ برای هر سه پیاده‌سازی)
   ├─ variants.ts         ← رنگ واریانت‌ها (مشترک بین دو OS)
   ├─ button-content.tsx  ← چیدمان لیبل + اسلات آیکون؛ ترتیب اسلات‌ها زیر fa خودکار row-reverse می‌شود
   ├─ Button.tsx          ← پیش‌فرض خنثی (tsc/vitest همیشه این را می‌بینند)
   ├─ Button.ios.tsx      ← HIG: ارتفاع 46 · گوشه 12 · وزن 600 · ghost = بدون حاشیه · فیدبک dim
   └─ Button.android.tsx  ← M3: ارتفاع 50 · pill کامل · وزن 500 · ghost = outlined · ripple
```

**چرا فقط Button سه‌فایلی است؟** قانون تفکیک: جایی که *رفتار* واقعاً واگراست
(شکل، ارتفاع، تایپوگرافی کنترل، واریانت ghost، فیدبک) فایل پلتفرمی؛ جایی که فقط
*پارامتر* فرق دارد (اندازهٔ هدف لمس، رنگ ripple) توکن در `platform.ts`. کپیِ
سه‌گانهٔ بی‌تفاوت رفتاری، فقط بدهی است.

## جدول تفاوت‌های فعلی

| ویژگی | iOS | اندروید |
|---|---|---|
| فیدبک لمس | کاهش opacity به 0٫65 هنگام فشردن | Material ripple (`foreground: true`) |
| شکل دکمه | radius 12 | stadium (radius 999) |
| حداقل هدف لمس | 44pt (IconButton) | 48dp (IconButton) |
| وزن لیبل | 600 | 500 |
| ارتفاع دکمهٔ استاندارد | 46 | 50 |
| ghost | متن ساده بدون حاشیه (HIG plain) | outlined با حاشیهٔ 1px |
| آیکون بازگشت هدر | chevron (آینه‌ای در fa) | فلش (آینه‌ای در fa) |

## قوانین برای کد آینده

1. **هیچ `Platform.OS` / `selectUI` داخل صفحه‌ها نوشته نمی‌شود.** همهٔ انشعاب OS فقط داخل `src/ui` یا پسوند `.ios/.android`.
2. هر کنترل تعاملی جدید از `PressableSurface` مشتق می‌شود، نه `Pressable` خام.
3. هر آیکون جهت‌دار حتماً از `dirIconName` می‌گذرد — Ionicons خودش آینه نمی‌شود.
4. افزودن کنترل تطبیقیِ جدید با واگرایی واقعی: سه فایل (`X.tsx` پایه + `.ios.tsx` + `.android.tsx`) با قرارداد مشترک در `types.ts`.
5. Ripple گرد در اندروید: روی المان گرد `overflow: "hidden"` فراموش نشود.
6. háptیک فقط از wrapper (`haptics.tap/success/warning`) — مستقیم از expo-haptics نه.

## استثناهای آگاهانه

- **کلیدهای شبیه‌ساز LCD** (`lesson/[slug].tsx` → `Lcd`): عمداً `Pressable` خام مانده‌اند — شبیه‌سازی سخت‌افزار واقعی دستگاه‌اند (ESC/▲/▼/ENTER)، نه UI اپ؛ تطبیق‌دادنشان با HIG/M3 غلط مفهومی است.
- **ErrorBoundary در `_layout.tsx`**: عمداً خارج از لایهٔ UI و `Pressable` خام نگه داشته شده — `useAcademy` خارج از Provider پرتاب خطا می‌کند و مسیر crash باید حداقلی‌ترین وابستگی ممکن را داشته باشد تا خودش کرش نکند.

## وریفای

- `pnpm qa:mobile` حالا JS را برای **هر دو** پلتفرم باندل می‌کند (`export:android` + `export:ios`) تا خطای فایل‌های `.ios.tsx` قبل از هزینهٔ بیلد مک در EAS لو برود.
- تست چشمی: iOS از طریق Expo Go (`pnpm dev:mobile`)، اندروید از طریق APK پروفایل `preview`.
