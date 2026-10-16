"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "md";
}

export function QuantityStepper({ value, min = 1, max, onChange, label, size = "md" }: Props) {
  const dim = size === "sm" ? "size-9" : "size-12";
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center border border-stone bg-[#fbf9f4]"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
        className={`${dim} grid place-items-center transition-colors hover:bg-paper-deep disabled:cursor-not-allowed disabled:opacity-35`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={`${size === "sm" ? "w-8 text-sm" : "w-10 text-base"} text-center font-semibold tabular-nums`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
        className={`${dim} grid place-items-center transition-colors hover:bg-paper-deep disabled:cursor-not-allowed disabled:opacity-35`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
