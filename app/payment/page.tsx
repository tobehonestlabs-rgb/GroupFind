import Link from 'next/link';

export default function PaymentPage() {
  return (
    <main>
      <section className="section">
        <h1 className="section-title">Pass 30 jours</h1>
        <p className="page-note">99 XOF pour accéder aux liens WhatsApp et profiter de GroupFind en illimité.</p>
      </section>

      <section className="section card">
        <p style={{ margin: '0 0 16px', color: '#475569' }}>Payez via Paystack pour obtenir votre pass 30 jours. Le bouton ci-dessous lancera le paiement.</p>
        <Link href="/api/paystack" className="button">Payer 99 XOF</Link>
      </section>
    </main>
  );
}
