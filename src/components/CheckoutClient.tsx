"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, Loader2, Lock } from "lucide-react";
import { OrderSummaryLines } from "./OrderSummaryLines";
import { clearCart, useCart, useHydrated } from "@/lib/cart-store";
import { EMPTY_FORM, US_STATES, validateCheckout, type CheckoutErrors, type CheckoutForm } from "@/lib/checkout-validation";
import { formatMoney } from "@/lib/format";
import { generateOrderNumber, saveOrder } from "@/lib/orders-store";
import { SHIPPING_METHODS, estimateTax, shippingCost, type ShippingMethodId } from "@/lib/shipping";

export const DEMO_NOTICE = "Portfolio demonstration — no payment will be collected.";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: keyof CheckoutForm;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
}

function Field({ label, name, error, hint, optional, className = "", ...rest }: FieldProps) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        data-field={name}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-clay-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${step}`} className="border-t border-stone/70 pt-8">
      <h2 id={`step-${step}`} className="display flex items-baseline gap-4 text-3xl">
        <span className="text-xl italic text-clay-deep">{step}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function CheckoutClient() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { items, subtotal } = useCart();
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [method, setMethod] = useState<ShippingMethodId>("standard");
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const shipping = shippingCost(subtotal, method);
  const tax = estimateTax(subtotal);
  const total = subtotal + shipping + tax;
  const errorKeys = Object.keys(errors) as (keyof CheckoutForm)[];

  function set<K extends keyof CheckoutForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSubmitting(true);
    timer.current = setTimeout(() => {
      const number = generateOrderNumber();
      saveOrder({
        number,
        placedAt: new Date().toISOString(),
        customerName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        address: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          address1: form.address1.trim(),
          address2: form.address2.trim() || undefined,
          city: form.city.trim(),
          state: form.state,
          postalCode: form.postalCode.trim(),
          country: form.country,
        },
        shippingMethod: method,
        lines: items.map((i) => ({
          slug: i.product.slug,
          name: i.product.name,
          color: i.color.name,
          qty: i.qty,
          price: i.product.price,
        })),
        subtotal,
        shipping,
        tax,
        total,
        status: "Processing",
      });
      router.push(`/order-confirmation?order=${number}`);
      clearCart();
    }, 1100);
  }

  if (!hydrated) {
    return (
      <div className="wrap py-12" aria-busy="true" aria-label="Loading checkout">
        <div className="skeleton h-14 w-72" />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_26rem]">
          <div className="skeleton h-96" />
          <div className="skeleton h-96" />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="wrap py-20 text-center">
        <h1 className="display text-5xl">Nothing to check out</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-muted">
          Your cart is empty. Add a piece or two from the collection, then return here to try the demo checkout.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-10 lg:py-16">
      <h1 className="display text-5xl sm:text-6xl">Checkout</h1>

      <div
        role="note"
        className="mt-6 flex items-start gap-3 border border-clay-deep/40 bg-[#f3e4dc] px-4 py-3.5 text-sm"
      >
        <Info className="mt-0.5 size-5 shrink-0 text-clay-deep" aria-hidden="true" />
        <p>
          <strong className="font-semibold">{DEMO_NOTICE}</strong> Nothing you type here is sent anywhere, and
          no order will be fulfilled.
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_26rem] lg:gap-16 xl:grid-cols-[1fr_28rem]">
        <form onSubmit={handleSubmit} noValidate aria-label="Demo checkout form" className="space-y-10">
          {errorKeys.length > 0 && (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="border border-clay-deep bg-[#fbf1ec] p-5 outline-none"
            >
              <p className="font-semibold text-clay-deep">
                Please fix {errorKeys.length === 1 ? "1 field" : `${errorKeys.length} fields`} to continue:
              </p>
              <ul className="mt-2 list-inside list-disc text-sm">
                {errorKeys.map((k) => (
                  <li key={k}>
                    <button
                      type="button"
                      className="underline underline-offset-2"
                      onClick={() => document.querySelector<HTMLElement>(`[data-field="${k}"]`)?.focus()}
                    >
                      {errors[k]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Section step={1} title="Contact information">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors.email}
                className="sm:col-span-2"
                placeholder="name@example.com"
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                error={errors.phone}
                optional
                className="sm:col-span-2"
                hint="Only used for delivery updates in a real store."
              />
            </div>
          </Section>

          <Section step={2} title="Shipping address">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" name="firstName" autoComplete="given-name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} />
              <Field label="Last name" name="lastName" autoComplete="family-name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} />
              <Field label="Street address" name="address1" autoComplete="address-line1" value={form.address1} onChange={(e) => set("address1", e.target.value)} error={errors.address1} className="sm:col-span-2" />
              <Field label="Apartment, suite, etc." name="address2" autoComplete="address-line2" value={form.address2} onChange={(e) => set("address2", e.target.value)} optional className="sm:col-span-2" />
              <Field label="City" name="city" autoComplete="address-level2" value={form.city} onChange={(e) => set("city", e.target.value)} error={errors.city} />
              <div>
                <label htmlFor="state" className="mb-1.5 block text-sm font-semibold">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  data-field="state"
                  autoComplete="address-level1"
                  className="field"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  aria-invalid={errors.state ? true : undefined}
                  aria-describedby={errors.state ? "state-err" : undefined}
                >
                  <option value="">Select a state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p id="state-err" className="mt-1.5 text-sm font-medium text-clay-deep">
                    {errors.state}
                  </p>
                )}
              </div>
              <Field label="ZIP code" name="postalCode" autoComplete="postal-code" inputMode="numeric" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} error={errors.postalCode} />
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-semibold">
                  Country
                </label>
                <select id="country" name="country" className="field" value={form.country} onChange={(e) => set("country", e.target.value)} autoComplete="country-name">
                  <option>United States</option>
                </select>
              </div>
            </div>
          </Section>

          <Section step={3} title="Shipping method">
            <fieldset>
              <legend className="sr-only">Shipping method</legend>
              <div className="space-y-3">
                {SHIPPING_METHODS.map((m) => {
                  const cost = shippingCost(subtotal, m.id);
                  const selected = method === m.id;
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay-deep ${
                        selected ? "border-ink bg-paper-deep/70" : "border-stone hover:border-ink/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={m.id}
                        checked={selected}
                        onChange={() => setMethod(m.id)}
                        className="size-4 accent-olive"
                      />
                      <span className="flex-1">
                        <span className="block font-semibold">{m.label}</span>
                        <span className="block text-sm text-muted">{m.eta}</span>
                      </span>
                      <span className="font-semibold tabular-nums">{cost === 0 ? "Free" : formatMoney(cost)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </Section>

          <Section step={4} title="Payment">
            <div className="border border-dashed border-stone bg-paper-deep/60 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Payment is not collected in this demonstration</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    These fields show how a payment form would look. They are intentionally disabled and
                    cannot receive card details. {DEMO_NOTICE}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-hidden="true">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-muted">Card number</label>
                  <input className="field" disabled tabIndex={-1} placeholder="Card entry disabled" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-muted">Expiry</label>
                  <input className="field" disabled tabIndex={-1} placeholder="MM / YY" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-muted">Security code</label>
                  <input className="field" disabled tabIndex={-1} placeholder="CVC" />
                </div>
              </div>
            </div>
          </Section>

          <div className="border-t border-stone/70 pt-8">
            <button type="submit" disabled={submitting} className="btn btn-clay w-full py-4 text-base sm:w-auto sm:min-w-72">
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Placing demo order…
                </>
              ) : (
                <>Place demo order · {formatMoney(total)}</>
              )}
            </button>
            <p className="mt-4 text-sm text-muted" role="status">
              {submitting ? "Creating a fictional order number…" : DEMO_NOTICE}
            </p>
          </div>
        </form>

        <aside aria-labelledby="checkout-summary" className="h-fit border border-stone/70 bg-paper-deep/50 p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 id="checkout-summary" className="display text-3xl">
            Order summary
          </h2>
          <div className="mt-4">
            <OrderSummaryLines
              lines={items.map((i) => ({
                slug: i.product.slug,
                name: i.product.name,
                color: i.color.name,
                colorHex: i.color.hex,
                qty: i.qty,
                price: i.product.price,
              }))}
            />
          </div>
          <dl className="mt-4 space-y-3 border-t border-stone/70 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="tabular-nums">{shipping === 0 ? "Free" : formatMoney(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Estimated tax (demo rate)</dt>
              <dd className="tabular-nums">{formatMoney(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone/70 pt-4 text-lg">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold tabular-nums">{formatMoney(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
