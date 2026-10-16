import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kern & Cove — home"
      className={`display inline-block py-2.5 text-[1.65rem] leading-none tracking-tight ${className}`}
    >
      Kern <span className="italic text-clay-deep">&amp;</span> Cove
    </Link>
  );
}
