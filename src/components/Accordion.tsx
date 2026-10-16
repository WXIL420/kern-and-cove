"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
}) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="divide-y divide-stone border-y border-stone">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                id={`${base}-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold transition-colors hover:text-clay-deep"
              >
                {item.title}
                <Plus
                  className={`size-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${base}-panel-${i}`}
              role="region"
              aria-labelledby={`${base}-btn-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="pb-6 text-[0.95rem] leading-7 text-muted">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
