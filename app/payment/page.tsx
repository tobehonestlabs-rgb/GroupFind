"use client";

import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setLoading(true);

    const session = await supabaseBrowser.auth.getSession();
    const user = session.data?.session?.user;
    if (!user?.email) {
      setError('Vous devez être connecté pour payer.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: 99,
          plan: 'premium',
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (!data.status || data.status !== 'success') {
        throw new Error(data.error || 'Impossible de démarrer le paiement');
      }

      window.location.href = data.data.authorization_url;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="section">
        <h1 className="section-title">Pass 30 jours</h1>
        <p className="page-note">99 XOF pour accéder aux liens WhatsApp et profiter de GroupFind en illimité.</p>
      </section>

      <section className="section card">
        <p style={{ margin: '0 0 16px', color: '#475569' }}>
          Payez via Paystack pour obtenir votre pass 30 jours. Le bouton ci-dessous lancera le paiement.
        </p>
        <button className="button" onClick={handlePay} disabled={loading}>
          {loading ? 'Préparation du paiement...' : 'Payer 99 XOF'}
        </button>
        {error && <p style={{ color: 'crimson', marginTop: 16 }}>{error}</p>}
      </section>
    </main>
  );
}
