interface PremisesListProps {
  items: { label: string; value: string }[];
}

export function PremisesList({ items }: PremisesListProps) {
  return (
    <div className="rounded-card border border-dashed border-line p-6">
      <h3 className="font-display text-sm font-semibold text-ink-soft">
        Premissas usadas neste cálculo
      </h3>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between gap-2 text-xs">
            <dt className="text-ink-faint">{item.label}</dt>
            <dd className="font-mono font-medium tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
