import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  return (
    <div>
      <p className="text-sm text-ink" aria-live="polite">
        {remaining > 0 ? (
          <>
            You are <strong className="font-semibold">{formatPrice(remaining)}</strong> away from free shipping.
          </>
        ) : (
          <strong className="font-semibold text-olive">You have unlocked free standard shipping.</strong>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress toward free shipping"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
        aria-valuetext={`${pct}% of the way to free shipping`}
        className="mt-3 h-1.5 w-full bg-stone/60"
      >
        <div
          className={`h-full transition-[width] duration-500 ease-out ${remaining > 0 ? "bg-clay" : "bg-olive"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
