"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentStatusPage() {
  const [message, setMessage] = useState('Vérification du paiement...');
  const [status, setStatus] = useState<'success' | 'failed' | 'error' | 'pending'>('pending');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setMessage('Référence de paiement manquante.');
      setStatus('error');
      return;
    }

    async function verify() {
      try {
        const encodedReference = encodeURIComponent(reference as string);
        const res = await fetch(`/api/paystack?reference=${encodedReference}`);
        const data = await res.json();

        if (data.status === 'success') {
          setMessage('Paiement réussi ! Votre compte est maintenant vérifié.');
          setStatus('success');
        } else {
          setMessage(data.error || 'Le paiement n\'a pas été validé.');
          setStatus('failed');
        }
      } catch (err: any) {
        setMessage(err.message || 'Erreur de vérification du paiement.');
        setStatus('error');
      }
    }

    verify();
  }, [searchParams]);

  return (
    <main>
      <section className="section">
        <h1 className="section-title">Statut du paiement</h1>
        <p className="page-note">{message}</p>
      </section>
      <section className="section card">
        <p>Statut : {status}</p>
        <button className="button" type="button" onClick={() => router.push('/')}>Retour à l'accueil</button>
      </section>
    </main>
  );
}
