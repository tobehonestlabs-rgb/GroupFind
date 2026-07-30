"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [noms, setNoms] = useState('');
  const [numero, setNumero] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noms, numero_telephone: numero, email, mot_de_passe: password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur');
      const user = data.user;
      router.push(`/account?user_id=${encodeURIComponent(user.user_id || user.user_id)}`);
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="section">
        <h1 className="section-title">Créer un compte</h1>
        <p className="page-note">Inscrivez-vous pour publier des groupes et accéder à vos favoris.</p>
      </section>

      <section className="section input-card">
        <form onSubmit={handleSignup}>
          <div className="field">
            <label htmlFor="name">Nom complet</label>
            <input id="name" value={noms} onChange={(e) => setNoms(e.target.value)} placeholder="Jean Yao" />
          </div>
          <div className="field">
            <label htmlFor="phone">Numéro de téléphone</label>
            <input id="phone" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="+225 01 23 45 67" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p style={{ color: 'crimson' }}>{error}</p>}
          <button type="submit" className="button" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte'}</button>
        </form>
      </section>
    </main>
  );
}
