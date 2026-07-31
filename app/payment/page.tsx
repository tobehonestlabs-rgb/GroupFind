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
          <h1 className="section-title hero-title">Débloquez l’accès premium et rejoignez les groupes sans limite pendant 30 jours.</h1>
          <p className="page-note">
            Un paiement unique de 99 FCFA vous donne accès aux groupes WhatsApp et à tous les liens disponibles en toute simplicité.
          </p>
          <div className="hero-actions">
            <button className="button" onClick={handlePay} disabled={loading}>
              {loading ? 'Préparation du paiement...' : 'Seulement 99 FCFA'}
            </button>
            <a href="/" className="button secondary">
              Retour à l’accueil
            </a>
          </div>
        </div>

        <div className="card payment-card">
          <div className="price-pill">99 FCFA</div>git 
          <h2 style={{ margin: 0 }}>Ce que vous obtenez</h2>
          <ul className="feature-list">
            <li>Accès instantané aux liens WhatsApp</li>
            <li>30 jours d’accès premium sans limite</li>
            <li>Paiement sécurisé via Paystack</li>
          </ul>
          <p className="helper-text">
            Le bouton ci-dessus lance le paiement sécurisé. Une fois payé, vous pouvez accéder à toutes les communautés disponibles.
          </p>
          {error && <p className="error-text">{error}</p>}
        </div>
      </section>
    </main>
  );
}
