"use client";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  hint?: string;
  id: string;
}

export function NumberField({ label, value, onChange, suffix, hint, id }: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <div className="flex items-center rounded-card border border-line bg-paper-raised px-4 py-3 focus-within:border-emerald">
        <input
          id={id}
          type="number"
          className="w-full bg-transparent font-mono text-base tabular-nums outline-none"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        {suffix && <span className="ml-2 font-mono text-sm text-ink-faint">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
