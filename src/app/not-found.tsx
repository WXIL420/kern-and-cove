import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-6xl">This page has gone quiet</h1>
      <p className="mx-auto mt-5 max-w-md leading-7 text-muted">
        The page you are looking for does not exist or has moved. Let us get you back to the desk.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-primary">
          Shop the collection
        </Link>
        <Link href="/" className="btn btn-outline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
