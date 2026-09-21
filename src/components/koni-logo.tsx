export function KoniLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-2 ring-primary/20 transition-transform duration-200 hover:scale-105">
        <img
          src="/koni-logo.svg"
          alt="Logo KONI Kabupaten Nganjuk"
          className="size-full object-contain"
          width={44}
          height={44}
        />
      </div>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <strong className="block truncate font-display text-base font-extrabold text-primary">
            KONI NGANJUK
          </strong>
          <span className="block truncate text-[11px] font-semibold uppercase text-muted-foreground">
            Komite Olahraga Nasional Indonesia
          </span>
        </span>
      )}
    </div>
  );
}