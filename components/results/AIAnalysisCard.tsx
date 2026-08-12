interface AIAnalysisCardProps {
  text: string;
}

export function AIAnalysisCard({ text }: AIAnalysisCardProps) {
  return (
    <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
          IA
        </span>
        <h3 className="font-display text-base font-semibold">Nossa análise</h3>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
