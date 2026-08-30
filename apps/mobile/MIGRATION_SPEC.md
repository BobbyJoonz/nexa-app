# NativeWind + Lucide Migration Spec — Sunverter Academy

Read this BEFORE touching any screen file. Also read these reference files:

- `apps/mobile/components/screen.tsx` — migrated shell, shows the exact pattern
- `apps/mobile/tailwind.config.js` — semantic color/font/spacing tokens
- `apps/mobile/src/ui/text.tsx`, `row.tsx`, `card.tsx`, `badge.tsx`, `separator.tsx`
- `apps/mobile/src/ui/pressable-surface.tsx` — accepts `className` (cssInterop)

## Golden rules

1. **NO `@expo/vector-icons` and NO `theme.colors` / `localizedTextStyle` / `localizedRow`
   from `@/theme` in migrated files.** Delete those imports.
2. **RTL must keep working without reload.** Locale comes from `useAcademy()`.
   - Persian (`locale === "fa"`) needs `writingDirection: "rtl"` + `textAlign: "right"`.
   - Use the shared `Text` primitive (`@/src/ui`) for text — it does this automatically.
   - For raw RN `Text`/`View`, set `writingDirection` via inline `style` and direction via
     NativeWind arbitrary property `[writingDirection:rtl]` or inline style.
   - Rows: `flex-row` normally; for fa use `flex-row-reverse` (via `cn(...)` or the `Row` primitive).
3. **No runtime template-literal classes.** Tailwind JIT only scans literal strings.
   Build class strings with the `cn()` helper and ternaries, keeping each class literal.
4. **Colors → tailwind semantic tokens:** brandPrimary→`text-primary`/`bg-primary`,
   brandAccent→`text-accent`, textPrimary→`text-foreground`, textSecondary→`text-muted-foreground`,
   raised→`bg-card`, technical→`bg-secondary`, borderSubtle→`border-border`, canvas→`bg-background`,
   success→`text-success`, warning→`text-warning`, danger→`text-destructive`, info→`text-info`.
   Unknown hex literals in styles (e.g. `#FFF7ED`) → map to closest token or use arbitrary `bg-[#FFF7ED]`.
5. **Icons:** replace `<Ionicons name="..." size={n} color={...} />` with Lucide components.
   Exact mapping below. Directional icons use `dirIcon(locale, LtrIcon, RtlIcon)` from `@/src/ui/direction`.

## Lucide icon map (Ionicons name → lucide-react-native export)

- `search` / `search-outline` → `Search`
- `close-circle` → `CircleX`, `close` → `X`, `close-outline` → `X`
- `arrow-forward` → `ArrowRight`, `arrow-back` → `ArrowLeft`
- `chevron-forward` → `ChevronRight`, `chevron-back` → `ChevronLeft`
- `checkmark-circle` / `checkmark-circle-outline` → `CircleCheck` (NOT CheckCircle)
- `checkmark` → `Check`, `checkbox-outline` → `SquareCheck` (fallback `ListChecks` if unsure → verify)
- `alert-circle-outline` → `CircleAlert` (NOT AlertCircle), `alert-circle` → `CircleAlert`
- `warning-outline` → `TriangleAlert`, `warning` → `TriangleAlert`
- `help-circle-outline` → `CircleHelp`, `information-circle` → `Info`
- `shield-checkmark-outline` / `shield-checkmark` → `ShieldCheck`
- `construct-outline` → `Wrench`, `build-outline` → `Hammer`
- `refresh-outline` → `RefreshCw`
- `chatbubble-ellipses-outline` → `MessageCircle`
- `paper-plane-outline` → `Send`, `mail-outline` → `Mail`
- `git-network-outline` → `Network`, `git-branch-outline` → `GitBranch`
- `scan-outline` → `Scan`, `flash-outline` → `Zap`, `power-outline` → `Power`
- `calculator-outline` → `Calculator`, `options-outline` → `SlidersHorizontal`
- `swap-horizontal-outline` → `ArrowLeftRight`
- `battery-charging-outline` → `BatteryCharging`
- `list-outline` → `List`, `book-outline` → `BookOpen`
- `trophy-outline` → `Trophy`, `sunny-outline` → `Sun`, `business-outline` → `Building2`
- `home-outline` → `House`, `ellipse` / `ellipse-outline` → `Circle` (size small, as bullet)
- `fitness-outline` / `pulse` → `Activity`, `layers-outline` → `Layers`
- `shield-outline` → `Shield`, `lock-closed-outline` → `Lock`, `document-outline` → `FileText`
- `map-outline` → `Map`, `compass-outline` → `Compass`
- If an icon is not listed, find the closest semantic Lucide icon by meaning.

Always verify a mapped export exists: check
`apps/mobile/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js`
(grep the PascalCase name) BEFORE using it in code.

## Directional icon pattern

```tsx
import { dirIcon } from "@/src/ui/direction";
const ForwardIcon = dirIcon(locale, ChevronRight, ChevronLeft);
<ForwardIcon size={16} color="#5C6878" />
```
`dirIcon(locale, ltr, rtl)`: pass the LTR-facing icon first, the RTL one second.

## File-by-file (migrate ONLY these files)

1. `apps/mobile/app/index.tsx` — Language screen. Keep `SafeAreaView`, orbit circle, product image,
   readout box. Use NativeWind classes; keep exact layout.
2. `apps/mobile/app/models.tsx` — Models. Featured card + 3 ghost buttons.
3. `apps/mobile/app/calculator.tsx` — Sizing calculator. Large. Keep all logic; restyle with tokens.
4. `apps/mobile/app/checklist.tsx` — Commissioning checklist. Progress bar + tick rows.
5. `apps/mobile/app/search.tsx` — Global search. Search bar + fault chips + results.
6. `apps/mobile/app/lesson/[slug].tsx` — Lesson hub. Largest file. Migrate all sub-components.
7. `apps/mobile/app/academy/[model].tsx` — Academy model page. Hero + quick actions + lesson list.
8. `apps/mobile/components/lesson/quiz-lesson.tsx` — Quiz.
9. `apps/mobile/components/lesson/troubleshooting-flow.tsx` — Decision tree.
10. `apps/mobile/components/lesson/lcd-simulator.tsx` — LCD simulator (keep the raw device look:
    greys/greens are intentional; use arbitrary hex classes).
11. `apps/mobile/src/ui/feedback.tsx` — ALREADY MIGRATED. Do not touch.

## RTL notes per screen

- Screens that already use `localizedTextStyle(locale)` on every Text: replace with the `Text`
  primitive from `@/src/ui` (it handles RTL). For plain RN Text inside migrated screens, use the
  primitive. The `Row` primitive (`@/src/ui`) handles row direction — use it for localized rows.
- Search bar / inputs: keep `writingDirection` behavior — the input should flip for fa.
- Never remove a feature. Preserve all strings, all haptics calls, all a11y labels.

## Final checks before reporting done

- No `@expo/vector-icons`, no `@/theme` import, no `StyleSheet.create` left in the file.
- File compiles (run `pnpm --dir apps/mobile exec tsc --noEmit` scoped if possible; otherwise rely
  on visual review against the reference files).
- Every class string is literal. Every icon name verified against lucide exports.
