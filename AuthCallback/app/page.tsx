import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="card">
        <div className="brand-mark" aria-hidden="true">
          🍲
        </div>
        <p className="eyebrow">LOCALBITE</p>
        <h1>Email confirmation</h1>
        <p className="description">
          This page receives LocalBite email confirmation links. Open the
          confirmation link from your email to continue.
        </p>
        <Link className="text-link" href="/auth/callback">
          Open confirmation page
        </Link>
      </section>
    </main>
  );
}
