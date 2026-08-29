import type { LocalizedText, SourceReference } from "@nexa/schemas";

/**
 * Interactive troubleshooting decision tree for the verified CM3500-24S.
 *
 * Root question = the observed symptom; every branch ends in a diagnosis with
 * severity, likely causes, numbered actions and an escalation rule. Content is
 * grounded in the preserved NEXA English user manual (safety p.3, product
 * overview p.4, battery/AC connection p.6, PV connection p.9, power-on and
 * display p.11, LCD setting programs p.12-14, fault reference p.22).
 *
 * Safety contract: the tree never asks a user to open the enclosure, touch
 * live terminals or bypass protection; anything beyond a safe user-level check
 * terminates in an installer/escalation diagnosis.
 */

export type TroubleshootSeverity = "safe" | "caution" | "danger";

export interface TroubleshootQuestion {
  kind: "question";
  id: string;
  question: LocalizedText;
  /** Optional safety or method hint shown under the question. */
  hint?: LocalizedText;
  choices: Array<{ id: string; label: LocalizedText; next: string }>;
  source: SourceReference;
}

export interface TroubleshootDiagnosis {
  kind: "diagnosis";
  id: string;
  problem: LocalizedText;
  severity: TroubleshootSeverity;
  /** Bilingual bullet list of likely causes. */
  causes: LocalizedText[];
  /** Numbered bilingual actions, ordered by safety. */
  solution: LocalizedText[];
  /** Optional warning about when an authorized installer is mandatory. */
  escalation?: LocalizedText;
  source: SourceReference;
}

export type TroubleshootNode = TroubleshootQuestion | TroubleshootDiagnosis;

export interface TroubleshootTree {
  start: string;
  nodes: Record<string, TroubleshootNode>;
}

const bi = (en: string, fa: string): LocalizedText => ({ en, fa });

const ref = (page: number, section: string): SourceReference => ({
  documentId: "manual-nexa-acm35-en",
  fileName: "manual-sunverteracm35kw(2).pdf",
  page,
  section
});

/** Question nodes. */
const question = (
  id: string,
  qEn: string,
  qFa: string,
  choices: Array<[string, string, string, string]>, // choiceId, next, labelEn, labelFa
  source: SourceReference,
  hint?: [string, string]
): TroubleshootQuestion => ({
  kind: "question",
  id,
  question: bi(qEn, qFa),
  ...(hint ? { hint: bi(hint[0], hint[1]) } : {}),
  choices: choices.map(([choiceId, next, labelEn, labelFa]) => ({
    id: choiceId,
    next,
    label: bi(labelEn, labelFa)
  })),
  source
});

/** Diagnosis nodes. */
const diagnosis = (
  id: string,
  problemEn: string,
  problemFa: string,
  severity: TroubleshootSeverity,
  causes: Array<[string, string]>,
  solution: Array<[string, string]>,
  source: SourceReference,
  escalation?: [string, string]
): TroubleshootDiagnosis => ({
  kind: "diagnosis",
  id,
  problem: bi(problemEn, problemFa),
  severity,
  causes: causes.map(([en, fa]) => bi(en, fa)),
  solution: solution.map(([en, fa]) => bi(en, fa)),
  ...(escalation ? { escalation: bi(escalation[0], escalation[1]) } : {}),
  source
});

export const troubleshootTree: TroubleshootTree = {
  start: "root",
  nodes: {
    root: question(
      "root",
      "How is the unit behaving right now?",
      "دستگاه الان دقیقاً چه رفتاری دارد؟",
      [
        ["no-power", "q-no-power", "No response — completely dark / off.", "هیچ واکنشی نشان نمی‌دهد؛ کاملاً خاموش است."],
        ["faulting", "q-fault-code", "LCD is on, but a fault or alarm shows.", "LCD روشن است اما خطا یا آلارم دارد."],
        ["no-charge", "q-charge-source", "It is on, but the battery is not charging.", "دستگاه روشن است اما باتری شارژ نمی‌شود."],
        ["load-issue", "q-load-issue", "It is on, but the output / loads misbehave.", "دستگاه روشن است اما خروجی یا بارها مشکل دارند."]
      ],
      ref(4, "Product overview")
    ),

    "q-no-power": question(
      "q-no-power",
      "Have you measured the DC voltage directly on the battery terminals with a multimeter?",
      "آیا ولتاژ DC را مستقیماً روی ترمینال‌های باتری با مولتی‌متر اندازه گرفته‌اید؟",
      [
        ["dead", "d-battery-dead", "Yes — battery voltage is very low or zero.", "بله — ولتاژ باتری خیلی پایین یا صفر است."],
        ["ok", "q-no-power-ac", "Yes — battery voltage is normal (above 22 V).", "بله — ولتاژ باتری طبیعی است (بیش از ۲۲ ولت)."],
        ["not-yet", "q-no-power-measure", "No, not yet.", "نه، هنوز اندازه نگرفته‌ام."]
      ],
      ref(6, "Battery connection"),
      ["Safety: isolate all sources and confirm polarity before measuring.", "ایمنی: پیش از اندازه‌گیری، همهٔ منابع را ایزوله و قطبیت را تأیید کنید."]
    ),

    "q-no-power-measure": question(
      "q-no-power-measure",
      "After measuring with the installation isolated, what does the battery voltage read?",
      "پس از ایزوله‌کردن نصب و اندازه‌گیری، ولتاژ باتری چقدر است؟",
      [
        ["dead", "d-battery-dead", "Very low or zero.", "خیلی پایین یا صفر است."],
        ["ok", "q-no-power-ac", "Normal (above 22 V).", "طبیعی است (بیش از ۲۲ ولت)."]
      ],
      ref(6, "Battery connection")
    ),

    "q-no-power-ac": question(
      "q-no-power-ac",
      "Is utility (grid) AC present at the unit's input?",
      "آیا برق شهری AC در ورودی دستگاه برقرار است؟",
      [
        ["ac-ok", "d-power-switch", "Yes — utility AC is present.", "بله — برق شهری برقرار است."],
        ["ac-none", "d-utility-absent", "No — no utility AC at the input.", "نه — برق شهری در ورودی برقرار نیست."]
      ],
      ref(11, "Power on/off")
    ),

    "q-fault-code": question(
      "q-fault-code",
      "Which fault code is on the LCD?",
      "کد خطای نمایش‌داده‌شده روی LCD چیست؟",
      [
        ["01-03", "d-fault-battery-voltage", "01 to 03 — battery voltage out of range.", "۰۱ تا ۰۳ — ولتاژ باتری خارج از محدوده است."],
        ["16-23", "d-fault-load", "16, 18, 19 or 23 — output overload / short-circuit.", "۱۶، ۱۸، ۱۹ یا ۲۳ — اضافه‌بار یا اتصال کوتاه خروجی است."],
        ["20-22", "d-fault-overtemp", "20, 21 or 22 — temperature related.", "۲۰، ۲۱ یا ۲۲ — مربوط به دماست."],
        ["other", "d-fault-unknown", "Another code, or I cannot read it clearly.", "کد دیگری است یا دقیق نمی‌بینم."]
      ],
      ref(22, "Fault reference code"),
      ["Note the exact code and whether the buzzer is continuous — it identifies the diagnosis.", "کد دقیق و پیوسته یا متناوب بودن بیزر را یادداشت کنید — تشخیص را مشخص می‌کند."]
    ),

    "q-charge-source": question(
      "q-charge-source",
      "Which charging source should be feeding the battery?",
      "کدام منبع شارژ باید باتری را تغذیه کند؟",
      [
        ["ac", "q-charge-ac-program", "Utility (AC) charging.", "شارژ از برق شهری (AC)."],
        ["pv", "d-charge-pv", "Solar (PV) charging.", "شارژ از پنل خورشیدی (PV)."],
        ["both", "d-charge-both", "Both sources together.", "هر دو منبع با هم."]
      ],
      ref(13, "Program 02")
    ),

    "q-charge-ac-program": question(
      "q-charge-ac-program",
      "Is Program 02 (maximum total charging current) set to a value that allows charging?",
      "آیا برنامهٔ ۰۲ (حداکثر جریان کل شارژ) روی مقداری است که شارژ را مجاز کند؟",
      [
        ["limited", "d-charge-program", "It is set very low, or I am not sure.", "خیلی پایین تنظیم شده یا مطمئن نیستم."],
        ["allowed", "d-charge-ac-limited", "It looks correct, but charging still does not start.", "ظاهراً درست است اما شارژ هنوز شروع نمی‌شود."]
      ],
      ref(13, "Program 02"),
      ["Program 02 is limited by Program 11 (maximum utility charging current) and the model's rating.", "برنامهٔ ۰۲ به‌وسیلهٔ برنامهٔ ۱۱ (حداکثر جریان شارژ برق شهری) و ظرفیت مدل محدود می‌شود."]
    ),

    "q-load-issue": question(
      "q-load-issue",
      "What exactly happens with the loads?",
      "مشکل بارها دقیقاً چیست؟",
      [
        ["no-start", "d-load-no-start", "Loads do not start, or they flicker.", "بارها روشن نمی‌شوند یا چشمک می‌زنند."],
        ["no-backup", "d-load-no-backup", "The unit does not switch to battery when the grid drops.", "وقتی برق شهر قطع می‌شود، دستگاه به باتری سوئیچ نمی‌کند."],
        ["short-run", "d-battery-run-time", "Backup time on battery is much shorter than expected.", "مدت پشتیبانی باتری خیلی کوتاه‌تر از حد انتظار است."]
      ],
      ref(12, "Program 01")
    ),

    "d-battery-dead": diagnosis(
      "d-battery-dead",
      "The battery path is the suspect: dead battery, open battery fuse, or reversed/loose polarity.",
      "مسیر باتری مشکوک است: باتری خالی، فیوز باتری قطع، یا قطبیت معکوس/اتصال شل.",
      "danger",
      [
        ["Flat or internally failed battery.", "باتری خالی یا ازکارافتادهٔ داخلی."],
        ["Open battery fuse or tripped battery breaker.", "فیوز باتری قطع یا بریکر باتری پریده."],
        ["Loose or reversed battery terminal polarity.", "قطبیت ترمینال باتری معکوس یا اتصال شل."]
      ],
      [
        ["Isolate the unit completely (AC, PV, battery) and confirm the power switch is off.", "دستگاه را کاملاً ایزوله کنید (AC، PV و باتری) و خاموش بودن کلید را تأیید کنید."],
        ["Inspect the battery fuse/breaker before opening anything.", "پیش از باز کردن هر چیز، فیوز/بریکر باتری را بررسی کنید."],
        ["Battery work, terminal torque and fuse replacement are installer-level tasks — never a user task.", "کار روی باتری، گشتاور ترمینال و تعویض فیوز فقط کار نصاب است و هرگز کاربر."]
      ],
      ref(6, "Battery connection"),
      ["Contact an authorized installer: the DC battery circuit is high-energy and not serviceable by the user.", "با نصاب مجاز تماس بگیرید: مدار DC باتری پرانرژی است و توسط کاربر تعمیرشدنی نیست."]
    ),

    "d-power-switch": diagnosis(
      "d-power-switch",
      "The unit has power but does not start: suspect the power switch path or internal protection.",
      "دستگاه برق دارد اما روشن نمی‌شود: مسیر کلید روشن یا حفاظت داخلی مشکوک است.",
      "caution",
      [
        ["Power switch left off, or a tripped utility/backup protection device.", "کلید روشن روشن نشده یا وسیلهٔ حفاظتی ورودی پریده است."],
        ["AC input wiring fault upstream of the unit.", "خطای سیم‌کشی ورودی AC پیش از دستگاه."]
      ],
      [
        ["Confirm the front power switch is really in the ON position.", "روشن بودن واقعی کلید جلویی را تأیید کنید."],
        ["Check that the utility breaker feeding the unit is closed and rated correctly.", "بسته و متناسب بودن بریکر برق شهرِ تغذیه‌کنندهٔ دستگاه را بررسی کنید."],
        ["Verify the AC input voltage readout on the LCD appears when powered.", "هنگام روشن بودن، ولتاژ ورودی AC را روی LCD کنترل کنید."]
      ],
      ref(11, "Power on/off"),
      ["Wiring upstream of the unit must be reviewed by the installer who commissioned the system.", "سیم‌کشی پیش از دستگاه باید توسط نصابِ نصب‌کنندهٔ سامانه بازبینی شود."]
    ),

    "d-utility-absent": diagnosis(
      "d-utility-absent",
      "No utility input reaches the unit — the unit cannot charge or run on the grid.",
      "برق شهری به دستگاه نمی‌رسد — دستگاه نمی‌تواند از شبکه شارژ یا کار کند.",
      "caution",
      [
        ["Utility breaker open or tripped.", "بریکر برق شهر قطع یا پریده است."],
        ["Damaged or disconnected AC input wiring.", "آسیب یا قطعی در سیم‌کشی ورودی AC."]
      ],
      [
        ["Confirm the utility supply is actually live outside the unit.", "برق‌دار بودن شبکهٔ بیرون از دستگاه را تأیید کنید."],
        ["Reset the utility breaker only after confirming the output wiring is safe to re-energize.", "بریکر برق شهر را فقط پس از تأیید امنیت سیم‌کشی خروجی وصل کنید."]
      ],
      ref(6, "Battery connection"),
      ["Continued lack of utility input with a healthy internal readout is an installer inspection case.", "هنگامی که نمایشگر داخلی سالم است اما برق شهر نمی‌رسد، بررسی نصاب لازم است."]
    ),

    "d-fault-battery-voltage": diagnosis(
      "d-fault-battery-voltage",
      "Codes 01-03 point at battery voltage out of range: measurement or battery-source issue.",
      "کدهای ۰۱ تا ۰۳ به خروج ولتاژ باتری از محدوده اشاره دارند: مشکل اندازه‌گیری یا منبع باتری.",
      "caution",
      [
        ["Battery voltage actually below/above the configured profile.", "ولتاژ واقعی باتری پایین‌تر/بالاتر از پروفایل تنظیم‌شده است."],
        ["Loose battery terminals causing an unstable reading.", "ترمینال شل باتری که خوانش را ناپایدار می‌کند."],
        ["Wrong battery type program for the installed battery.", "برنامهٔ نوع باتری ناهماهنگ با باتری نصب‌شده."]
      ],
      [
        ["Record the code and the LCD battery-voltage readout.", "کد و مقدار ولتاژ باتری روی LCD را ثبت کنید."],
        ["Confirm the battery type program (05) matches the installed battery.", "تطبیق برنامهٔ نوع باتری (۰۵) با باتری نصب‌شده را بررسی کنید."],
        ["Hardware measurement and terminal work go to the authorized installer.", "اندازه‌گیری سخت‌افزار و کار روی ترمینال‌ها به نصاب مجاز محول شود."]
      ],
      ref(22, "Fault reference code"),
      ["Do not clear codes repeatedly — a persistent 01-03 needs battery-service inspection.", "کدها را پشت‌سرهم پاک نکنید — تکرار ۰۱ تا ۰۳ نیازمند بازرسی باتری است."]
    ),

    "d-fault-load": diagnosis(
      "d-fault-load",
      "Codes 16/18/19/23 indicate output overload or short-circuit protection.",
      "کدهای ۱۶/۱۸/۱۹/۲۳ نشان‌دهندهٔ حفاظت اضافه‌بار یا اتصال کوتاه خروجی هستند.",
      "caution",
      [
        ["Connected loads exceed the rated continuous power.", "بارهای متصل از توان نامی پیوسته بیشترند."],
        ["Short-circuit or damaged wiring on the output circuit.", "اتصال کوتاه یا سیم‌کشی آسیب‌دیده در مدار خروجی."],
        ["High inrush loads (motors, pumps) repeated often.", "بارهای پرمصرف لحظه‌ای (موتور، پمپ) به‌طور مکرر."]
      ],
      [
        ["Reduce the connected load below the rated continuous power.", "بار متصل را زیر توان نامی پیوسته ببرید."],
        ["Inspect the output wiring for damage before retrying.", "پیش از تلاش دوباره، سیم‌کشی خروجی را برای آسیب بررسی کنید."],
        ["After the cause is removed, power-cycle the unit cleanly.", "پس از رفع علت، دستگاه را به‌طور صحیح خاموش و روشن کنید."]
      ],
      ref(22, "Fault reference code"),
      ["Persistent overload trips must be reviewed by an installer; do not bypass protection.", "خطاهای مکرر اضافه‌بار باید توسط نصاب بازبینی شود؛ حفاظت را دور نزنید."]
    ),

    "d-fault-overtemp": diagnosis(
      "d-fault-overtemp",
      "Codes 20-22 indicate a temperature-related protection event.",
      "کدهای ۲۰ تا ۲۲ به رویداد حفاظتی مربوط به دما اشاره دارند.",
      "caution",
      [
        ["Blocked ventilation or insufficient clearance around the unit.", "تهویهٔ مسدود یا فاصلهٔ ناکافی دور دستگاه."],
        ["Ambient temperature above the rated operating range.", "دمای محیط بیش از محدودهٔ کاری نامی."],
        ["Prolonged high-load operation without cooling.", "کارکرد طولانی با بار بالا بدون خنک‌شدن."]
      ],
      [
        ["Clear the ventilation and restore the required clearance.", "تهویه را باز و فاصلهٔ لازم را برقرار کنید."],
        ["Let the unit cool before restarting.", "پیش از روشن‌کردن مجدد، اجازه دهید دستگاه خنک شود."],
        ["Reduce load until conditions return to the rated envelope.", "بار را تا بازگشت شرایط به محدودهٔ نامی کاهش دهید."]
      ],
      ref(22, "Fault reference code"),
      ["If over-temperature repeats in a cool, well-ventilated area, hardware inspection by an installer is required.", "اگر در محیط خنک و خوش‌تهویه دما دوباره بالا رفت، بازرسی سخت‌افزار توسط نصاب لازم است."]
    ),

    "d-fault-unknown": diagnosis(
      "d-fault-unknown",
      "An unread or uncatalogued code — the safe move is to capture it exactly and escalate if it is not user-serviceable.",
      "کد خوانده‌نشده یا خارج از فهرست — کار امن: ثبت دقیق کد و ارجاع در صورت غیرقابل‌رسیدگی کاربر.",
      "safe",
      [
        ["The code was misread or cleared before being noted.", "کد درست خوانده نشده یا پیش از یادداشت پاک شده است."],
        ["A warning/beep pattern that does not match a fixed code.", "الگوی هشدار/بیزر که با کد ثابتی تطبیق ندارد."]
      ],
      [
        ["Write down the exact code, the LED state and whether the buzzer is continuous.", "کد دقیق، وضعیت چراغ‌ها و پیوسته یا متناوب بودن بیزر را یادداشت کنید."],
        ["Cross-check the code with the fault finder in this app.", "کد را با یابندهٔ خطا در همین برنامه مطابقت دهید."],
        ["If the code is not listed, keep the unit isolated and escalate with your notes.", "اگر کد در فهرست نبود، دستگاه را ایزوله نگه دارید و همراه یادداشت‌ها ارجاع دهید."]
      ],
      ref(22, "Fault reference code"),
      ["Unlisted codes or codes that return after restart require installer inspection of the unit.", "کدهای خارج از فهرست یا بازگشتی پس از ریست، نیازمند بازرسی نصاب از دستگاه‌اند."]
    ),

    "d-charge-program": diagnosis(
      "d-charge-program",
      "Program 02 (or its AC limit, Program 11) is set so low that charging barely starts.",
      "برنامهٔ ۰۲ (یا حد AC آن، برنامهٔ ۱۱) آن‌قدر پایین تنظیم شده که شارژ به‌سختی شروع می‌شود.",
      "safe",
      [
        ["Maximum total charging current set to a minimal value.", "جریان کل شارژ روی مقدار بسیار پایین تنظیم شده است."],
        ["Maximum utility charging current (11) capping the AC charge.", "حداکثر جریان شارژ برق شهری (۱۱) شارژ AC را محدود کرده است."]
      ],
      [
        ["Open the LCD simulator's charging programs to review the intended values.", "شبیه‌ساز LCD را باز کنید و برنامه‌های شارژ را مرور کنید."],
        ["Navigate to Program 02 and raise it to a value within the model's rating.", "به برنامهٔ ۰۲ بروید و آن را در حد ظرفیت مدل افزایش دهید."],
        ["Keep Program 11 at or above the current you actually need from the grid.", "برنامهٔ ۱۱ را برابر یا بالاتر از جریانی که از شبکه لازم دارید نگه دارید."]
      ],
      ref(13, "Program 02"),
      ["If the settings look correct but charging still fails, stop here — the power stage needs installer service.", "اگر تنظیمات درست بود اما شارژ همچنان انجام نشد، این‌جا توقف کنید — بخش قدرت نیازمند خدمات نصاب است."]
    ),

    "d-charge-ac-limited": diagnosis(
      "d-charge-ac-limited",
      "Settings look correct, yet AC charging does not start — utility presence or power-stage check needed.",
      "تنظیمات درست به نظر می‌رسد اما شارژ AC شروع نمی‌شود — بررسی حضور برق شهری یا بخش قدرت لازم است.",
      "caution",
      [
        ["Utility input present but below the required level.", "برق ورودی برقرار اما پایین‌تر از سطح لازم است."],
        ["Battery too far from full charge to need current, masking a weak path.", "باتری آن‌قدر شارژ است که جریان کم باشد و مشکل پنهان بماند."],
        ["Hardware charging-stage fault.", "عیب سخت‌افزاری بخش شارژ."]
      ],
      [
        ["Confirm the utility voltage readout on the LCD is within range.", "ولتاژ برق شهر روی LCD را در محدوده بودن‌اش کنترل کنید."],
        ["Discharge the battery noticeably, then watch whether AC charging engages.", "باتری را به‌طور محسوس مصرف کنید و ببینید شارژ AC آغاز می‌شود یا نه."],
        ["If charging never engages, escalate — the power stage is not user-serviceable.", "اگر شارژ هرگز شروع نشد، ارجاع دهید — بخش قدرت توسط کاربر تعمیرشدنی نیست."]
      ],
      ref(13, "Program 02"),
      ["A charging stage that never engages under a healthy battery and utility needs installer service.", "بخش شارژی که با باتری و برق سالم هرگز فعال نشود، نیازمند خدمات نصاب است."]
    ),

    "d-charge-pv": diagnosis(
      "d-charge-pv",
      "Solar charging is not happening — PV presence, polarity or MPPT behavior is suspect.",
      "شارژ خورشیدی انجام نمی‌شود — حضور PV، قطبیت یا رفتار MPPT مشکوک است.",
      "caution",
      [
        ["PV array voltage below the MPPT operating window.", "ولتاژ آرایهٔ PV پایین‌تر از پنجرهٔ کاری MPPT است."],
        ["Reversed PV polarity or loose PV terminals.", "قطبیت معکوس یا ترمینال شل PV."],
        ["PV strings shaded or disconnected by protection.", "رشته‌های PV سایه‌دار یا توسط حفاظت قطع شده‌اند."]
      ],
      [
        ["Check the PV voltage readout on the LCD against the expected array Voc.", "ولتاژ PV روی LCD را با Voc مورد انتظار آرایه مقایسه کنید."],
        ["Confirm shading and that the PV breaker/wiring is intact.", "سایه‌روی آرایه و سالم بودن بریکر/سیم‌کشی PV را بررسی کنید."],
        ["Polarity and terminal work on the PV circuit go to the installer.", "کار روی قطبیت و ترمینال‌های مدار PV به نصاب محول شود."]
      ],
      ref(9, "PV connection"),
      ["PV input work is live-DC work — authorized installer only.", "کار روی ورودی PV کار با DC زنده است و فقط نصاب مجاز."]
    ),

    "d-charge-both": diagnosis(
      "d-charge-both",
      "Combined charging depends on priority and source limits — the configuration, not the hardware, is usually the cause.",
      "شارژ ترکیبی به اولویت منبع و محدودیت‌ها وابسته است — معمولاً پیکربندی علت است، نه سخت‌افزار.",
      "safe",
      [
        ["Priority (Program 01) or charging-cap either source.", "اولویت (برنامهٔ ۰۱) یا سقف شارژ یکی از منابع را محدود می‌کند."],
        ["Program 02 total limit splitting between sources.", "محدودیت کل برنامهٔ ۰۲ بین منابع تقسیم می‌شود."]
      ],
      [
        ["Review the charging programs in the LCD simulator before changing anything real.", "پیش از تغییر هر چیزی، برنامه‌های شارژ را در شبیه‌ساز LCD مرور کنید."],
        ["Verify Program 01 priority allows the source you expect.", "اولویت برنامهٔ ۰۱ را با منبع مورد انتظارتان تطبیق دهید."],
        ["Confirm Program 02 still reserves enough total current.", "کافی بودن جریان کل برنامهٔ ۰۲ را تأیید کنید."]
      ],
      ref(13, "Program 02")
    ),

    "d-load-no-start": diagnosis(
      "d-load-no-start",
      "Loads failing to start or flickering — priority, output voltage or load size is suspect.",
      "روشن‌نشدن یا چشمک زدن بارها — اولویت، ولتاژ خروجی یا اندازهٔ بار مشکوک است.",
      "caution",
      [
        ["Output source priority (01) set to a source that is not available.", "اولویت منبع خروجی (۰۱) روی منبعی تنظیم شده که در دسترس نیست."],
        ["Output voltage/frequency programs (08/09) mismatched with the loads.", "برنامه‌های ولتاژ/فرکانس خروجی (۰۸/۰۹) با بارها ناهماهنگ‌اند."],
        ["Starting load exceeds the inverter's surge capability.", "بار راه‌انداز بیش از ظرفیت لحظه‌ای اینورتر است."]
      ],
      [
        ["Confirm the priority program matches the available source.", "تطبیق برنامهٔ اولویت با منبع در دسترس را بررسی کنید."],
        ["Start the largest load last and watch the load percentage on the LCD.", "بزرگ‌ترین بار را آخر روشن کنید و درصد بار روی LCD را ببینید."],
        ["If large loads must stay, an installer should size the system.", "اگر بارهای بزرگ باید بمانند، نصاب باید سیستم را اندازه‌دهی کند."]
      ],
      ref(12, "Program 01"),
      ["Repeated starting failures with a correct configuration are an installer sizing case.", "شکست مکرر راه‌اندازی با پیکربندی درست، مورد اندازه‌دهی نصاب است."]
    ),

    "d-load-no-backup": diagnosis(
      "d-load-no-backup",
      "No transfer to battery when the grid drops — battery path or priority suspect.",
      "بدون سوئیچ به باتری هنگام قطع برق — مسیر باتری یا اولویت مشکوک است.",
      "caution",
      [
        ["Priority (01) not set to a battery-backup mode (SBU/SUB).", "اولویت (۰۱) روی حالت پشتیبان باتری (SBU/SUB) تنظیم نشده است."],
        ["Battery fuse/breaker open, battery flat or polarity reversed.", "فیوز/بریکر باتری قطع، باتری خالی یا قطبیت معکوس است."],
        ["Bypass active (10) keeping the unit on the grid regardless.", "بای‌پس (۱۰) فعال است و دستگاه را در هر حال روی شبکه نگه می‌دارد."]
      ],
      [
        ["Confirm Program 01 is on SBU/SUB so battery can take over.", "روی SBU/SUB بودن برنامهٔ ۰۱ را برای ورود باتری تأیید کنید."],
        ["Check the battery voltage readout on the LCD during the drop.", "ولتاژ باتری روی LCD را هنگام قطعی بررسی کنید."],
        ["Battery fuse/terminal work goes to the authorized installer.", "کار روی فیوز/ترمینال باتری به نصاب مجاز محول شود."]
      ],
      ref(6, "Battery connection"),
      ["If the battery path is healthy but transfer never happens, installer inspection is required.", "اگر مسیر باتری سالم است اما سوئیچ هرگز رخ نمی‌دهد، بازرسی نصاب لازم است."]
    ),

    "d-battery-run-time": diagnosis(
      "d-battery-run-time",
      "Backup time much shorter than expected — battery capacity, age or discharge limits.",
      "مدت پشتیبانی خیلی کوتاه‌تر از انتظار — ظرفیت، عمر یا محدودیت دشارژ باتری.",
      "safe",
      [
        ["Battery capacity below the load draw (load percentage on the LCD).", "ظرفیت باتری کمتر از مصرف بار است (درصد بار روی LCD)."],
        ["Aged battery losing usable capacity.", "باتری فرسوده با ظرفیت قابل‌استفادهٔ کاهش‌یافته."],
        ["High cut-off settings ending backup earlier than expected.", "تنظیمات قطع ولتاژ بالا که پشتیبانی را زودتر تمام می‌کند."]
      ],
      [
        ["Read the load percentage and battery voltage on the LCD while on battery.", "در حالت باتری، درصد بار و ولتاژ باتری را روی LCD بخوانید."],
        ["Compare the runtime with a deliberately small test load to separate load from battery.", "با یک بار آزمایشی کوچک، مدت پشتیبانی را بسنجید تا بار و باتری از هم جدا شوند."],
        ["Battery replacement and capacity decisions are the installer's call.", "تعویض باتری و تصمیم ظرفیت با نصاب است."]
      ],
      ref(11, "Power on/off")
    )
  }
};