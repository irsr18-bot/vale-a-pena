import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-display font-semibold text-paper">
            ?
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Vale a Pena
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/financiamento" className="hover:text-ink">
            Financiamento
          </Link>
          <Link href="/#calculadoras" className="hover:text-ink">
            Calculadoras
          </Link>
        </nav>
      </div>
    </header>
  );
}
