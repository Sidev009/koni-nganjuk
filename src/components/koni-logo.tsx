export function KoniLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="group flex min-w-0 items-center gap-3">
      <img
        src="/koni-logo.svg"
        alt="Logo KONI Kabupaten Nganjuk"
        className="shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
        width={64}
        height={64}
        style={{ width: 64, height: 64 }}
      />
      {!compact && (
        <div className="min-w-0 leading-tight">
          <span className="block truncate font-display text-base font-black tracking-tight text-primary sm:text-xl">
            KONI NGANJUK
          </span>
          <span className="block truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
            Komite Olahraga Nasional Indonesia
          </span>
        </div>
      )}
    </div>
  );
}