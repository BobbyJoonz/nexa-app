# ‎⚠️ مهاجرت ریپو از Downloads به C:\dev\nexa — اجرا با OWNER، نه خودکار
# علت: پیوند نشست‌ها/ابزار به مسیر فعلی؛ جابه‌جایی وسط نشست، دسترسی ابزارها را می‌شکند.
# این اسکریپت آماده است تا مالک آن را در یک ترمینال مستقل اجرا کند (~۱ دقیقه).

param(
  [string]$Repo   = "C:\Users\Lenovo\Downloads\nexa-app-main\nexa-app-main",
  [string]$Target = "C:\dev\nexa",
  [switch]$ForceMove
)

$ErrorActionPreference = "Stop"

Write-Host "== 0) پیش‌شرط: بستن نشست‌های باز روی ریپو (GUI و ابزارها) =="
if (-not $ForceMove) {
  Write-Host "اجرا را با -ForceMove ادامه بده فقط وقتی هیچ process استفاده‌کننده‌ای باز نمانده."
}

$running = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match [regex]::Escape($Repo) -and $_.Name -match "node|git|tsx|gradle|java|expo" }
if ($running) {
  Write-Host "هنوز این فرایندها روی ریپو فعال‌اند:"
  $running | ForEach-Object { Write-Host "  pid=$($_.ProcessId) $($_.Name)" }
  if (-not $ForceMove) { Write-Host "متوقف شد. -ForceMove بده تا با این هشدار ادامه دهد (خودت مطمئن باش)."; exit 1 }
}

Write-Host "== 1) ساخت مقصد =="
New-Item -ItemType Directory -Force -Path $Target | Out-Null

Write-Host "== 2) کپی کامل (نسخهٔ پشتیبان تا موفقیت کامل) =="
robocopy $Repo $Target /E /MOVE /R:1 /W:1 /NFL /NDL /NJH | Out-Null
if ($LASTEXITCODE -ge 8) { Write-Host "robocopy خطا داد (کد $LASTEXITCODE)"; exit 1 }

Write-Host "== 3) راستی‌آزمایی =="
Set-Location $Target
git status --porcelain
git log -1 --oneline
if (Test-Path "C:\Users\Lenovo\pnpm-lock.yaml") { Remove-Item "C:\Users\Lenovo\pnpm-lock.yaml" -Force; Write-Host "lockfile سرگردان حذف شد" }

Write-Host "== 4) تنظیمات بلندمدت =="
git config core.longpaths true
git config user.name "Lenovo"
git config user.email "amirali.st80@gmail.com"

Write-Host "== 5) بازتولید سریع: lockfile/گیت فقط =="
Write-Host "اجرای کامل گیت‌ها از مسیر جدید:"
Write-Host "   cd C:\dev\nexa"
Write-Host "   `$env:PATH = \"C:\dev\nexa\tools\pnpm;$env:PATH\""
Write-Host "   pnpm test  # و بقیهٔ DoD"
Write-Host "تمام. اگر چیزی ناجور بود، نسخهٔ پشتیبان در مقصد نبود — از git history ریپو بازیابی کن."