import Image from "next/image";

export function NexaLoader({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "nexa-loader nexa-loader-compact" : "nexa-loader"} role="progressbar" aria-label="NEXA در حال بارگذاری">
      <div className="nexa-loader-grid" aria-hidden="true" />
      <div className="nexa-loader-orbit nexa-loader-orbit-outer" aria-hidden="true" />
      <div className="nexa-loader-orbit nexa-loader-orbit-inner" aria-hidden="true" />
      <div className="nexa-loader-content">
        <div className="nexa-loader-card">
          <div className="nexa-loader-logo-stage">
            <Image
              className="nexa-loader-logo nexa-loader-logo-ghost"
              src="/assets/brand/nexa-logo.png"
              alt=""
              width={657}
              height={241}
              priority
            />
            <div className="nexa-loader-logo-fill" aria-hidden="true">
              <Image
                className="nexa-loader-logo"
                src="/assets/brand/nexa-logo.png"
                alt="NEXA"
                width={657}
                height={241}
                priority
              />
            </div>
          </div>
          <div className="nexa-loader-track" aria-hidden="true"><span /></div>
        </div>
        <p className="nexa-loader-title">در حال آماده‌سازی آکادمی</p>
        <span className="nexa-loader-subtitle">Preparing Sunverter Academy</span>
      </div>
    </div>
  );
}
