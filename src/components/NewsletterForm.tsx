"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address, like name@example.com.");
      return;
    }
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <div role="status" className="flex items-start gap-3 border border-stone bg-paper-deep p-5 text-ink">
        <Check className="mt-0.5 size-5 shrink-0 text-olive" aria-hidden="true" />
        <div>
          <p className="font-semibold">Thank you for signing up.</p>
          <p className="mt-1 text-sm leading-6 text-muted">Your address was not stored or transmitted.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Email signup">
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-note`}
          className="field sm:flex-1"
        />
        <button type="submit" className={`btn ${tone === "dark" ? "btn-light" : "btn-primary"}`}>
          Join the list <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-3 text-sm font-medium text-clay-deep">
          {error}
        </p>
      ) : (
        <p id={`${id}-note`} className="mt-3 text-xs text-muted">
          This form is a demonstration: your address is not stored or transmitted.
        </p>
      )}
    </form>
  );
}
