export function Progress({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap" aria-label={label}>
      <div className="progress-track">
        <div className="progress-value" style={{ width: `${safe}%` }} />
      </div>
      <span>{safe}%</span>
    </div>
  );
}
