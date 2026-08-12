interface ResultSummaryProps {
  label: string;
  value: string;
  tone?: "emerald" | "amber" | "brick" | "ink";
  supporting?: { label: string; value: string }[];
}

const toneClasses: Record<NonNullable<ResultSummaryProps["tone"]>, string> = {
  emerald: "text-emerald bg-emerald-soft",
  amber: "text-amber bg-amber-soft",
  brick: "text-brick bg-brick-soft",
  ink: "text-ink bg-paper",
};

export function ResultSummary({ label, value, tone = "ink", supporting = [] }: ResultSummaryProps) {
  return (
    <div className={`rounded-card p-6 ${toneClasses[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-1 font-display text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
        {value}
      </p>
      {supporting.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {supporting.map((item) => (
            <div key={item.label}>
              <dt className="text-xs opacity-70">{item.label}</dt>
              <dd className="font-mono text-sm font-medium tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
