import Link from "next/link";

export default function NotFound() {
  return (
    <main className="center-page">
      <div className="empty-state">
        <p className="eyebrow">404</p>
        <h1>این بخش پیدا نشد</h1>
        <p>به انتخاب مدل بازگردید و از یک مسیر معتبر ادامه دهید.</p>
        <Link className="button button-primary" href="/models">انتخاب مدل</Link>
      </div>
    </main>
  );
}
