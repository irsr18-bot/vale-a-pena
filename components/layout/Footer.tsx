export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-ink-faint">
        <p className="max-w-2xl">
          As simulações apresentadas neste site são estimativas baseadas nas
          informações fornecidas pelo usuário e em premissas configuráveis —
          não constituem recomendação financeira personalizada. Taxas reais
          variam por instituição. Consulte um profissional antes de tomar
          decisões financeiras relevantes.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} Vale a Pena</p>
      </div>
    </footer>
  );
}
