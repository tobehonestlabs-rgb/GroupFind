import { notFound } from 'next/navigation';

async function verifyPayment(reference: string) {
  const res = await fetch(`${process.env.PAYSTACK_RETURN_URL ?? 'http://localhost:3000'}/api/paystack?reference=${encodeURIComponent(reference)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    return { status: 'error', message: errorData?.error || 'Erreur de vérification du paiement.' };
  }

  const data = await res.json();
  return {
    status: data.status === 'success' ? 'success' : 'failed',
    message: data.status === 'success'
      ? 'Paiement réussi ! Votre compte est maintenant vérifié.'
      : data.error || 'Le paiement n\'a pas été validé.',
  };
}

export default async function PaymentStatusPage({ searchParams }: { searchParams?: { reference?: string } }) {
  const reference = searchParams?.reference;
  if (!reference) {
    notFound();
  }

  const result = await verifyPayment(reference);

  return (
    <main>
      <section className="section">
        <h1 className="section-title">Statut du paiement</h1>
        <p className="page-note">{result.message}</p>
      </section>
      <section className="section card">
        <p>Statut : {result.status}</p>
        <a href="/" className="button">Retour à l'accueil</a>
      </section>
    </main>
  );
}
