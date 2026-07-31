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
      <section className="section hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Accès premium • 30 jours</span>
          <h1 className="section-title hero-title">Paye ta première fois et rejoins les groupes gratuitement pendant 30 jours</h1>
          <p className="page-note">Accède aux liens WhatsApp en toute simplicité avec un pass de 30 jours à seulement 99 Fcfa.</p>
          <div className="hero-actions">
            <button className="button" onClick={handlePay} disabled={loading}>
              {loading ? 'Préparation du paiement...' : 'Payer 99 Fcfa'}
            </button>
            <a href="/" className="button secondary">Retour à l’accueil</a>
          </div>
        </div>

        <div className="card payment-card">
          <div className="price-pill">99 Fcfa</div>
          <h2 style={{ margin: 0 }}>Ce que tu obtiens</h2>
          <ul className="feature-list">
            <li>Accès rapide aux liens WhatsApp</li>
            <li>Réjoins les groupes sans limite pendant 30 jours</li>
            <li>Paiement sécurisé via Paystack</li>
          </ul>
          <p className="helper-text">
            Le bouton ci-dessus lance le paiement sécurisé. Une fois payé, tu peux accéder à toutes les communautés disponibles.
          </p>
          {error && <p className="error-text">{error}</p>}
        </div>
      </section>
    </main>
  );
}
