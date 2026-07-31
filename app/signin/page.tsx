'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase-browser';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/account');
  }

  return (
    <main>
      <section className="section">
        <h1 className="section-title">Connexion</h1>
        <p className="page-note">Connectez-vous pour accéder à votre espace et publier des groupes.</p>
      </section>

      <section className="section input-card">
        <form onSubmit={handleSignin}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p style={{ color: 'crimson' }}>{error}</p>}
          <button type="submit" className="button" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
        </form>
      </section>
    </main>
  );
}
