"use client";

interface PercentInputProps {
  label: string;
  value: number; // decimal, ex: 0.12
  onChange: (value: number) => void;
  hint?: string;
  id: string;
}

export function PercentInput({ label, value, onChange, hint, id }: PercentInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <div className="flex items-center rounded-card border border-line bg-paper-raised px-4 py-3 focus-within:border-emerald">
        <input
          id={id}
          inputMode="decimal"
          className="w-full bg-transparent font-mono text-base tabular-nums outline-none"
          value={value ? (value * 100).toString() : ""}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value.replace(",", "."));
            onChange(Number.isNaN(parsed) ? 0 : parsed / 100);
          }}
        />
        <span className="ml-2 font-mono text-sm text-ink-faint">% a.a.</span>
      </div>
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
