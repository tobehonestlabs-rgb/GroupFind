import Link from 'next/link';
import { fetchUserById } from '../../lib/supabase';

"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage({ searchParams }: { searchParams?: { user_id?: string } }) {
  const user_id = searchParams?.user_id || '';
  const [nom, setNom] = useState('');
  const [theme, setTheme] = useState('');
  const [ville, setVille] = useState('');
  const [lien, setLien] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        categorie: theme,
        nom,
        description: '',
        images: [],
        ville,
        lien_invitation: lien,
        membres_approximatifs: 0,
        cree_par: user_id || null,
        contact_createur: '',
      };
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur');
      setMessage('Groupe publié avec succès');
      // optionally redirect to group page if id returned
      const created = data.data?.[0];
      if (created?.id) router.push(`/groups/${created.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="section">
        <h1 className="section-title">Mon compte</h1>
        <p className="page-note">Suivez vos groupes et gérez votre abonnement.</p>
      </section>

      <section className="section card">
        <div className="section-summary">
          <div>
            <h2 style={{ margin: 0 }}>Statistiques du compte</h2>
            <p style={{ margin: '10px 0 0', color: '#475569' }}>Aperçu de votre utilisation sur GroupFind.</p>
          </div>
        </div>

        <div className="card-meta" style={{ marginTop: '20px' }}>
          <span>Groupes rejoints : -</span>
          <span>Pass actif : -</span>
          <span>Jour d’abonnement : -</span>
        </div>
      </section>

      <section className="section input-card">
        <h2 style={{ marginTop: 0 }}>Publier un groupe</h2>
        <form onSubmit={handlePublish}>
          <div className="field">
            <label htmlFor="nom">Nom du groupe</label>
            <input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du groupe" />
          </div>
          <div className="field">
            <label htmlFor="theme">Thème</label>
            <input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Par exemple : Tech, Business" />
          </div>
          <div className="field">
            <label htmlFor="ville">Ville</label>
            <input id="ville" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Abidjan, San Pedro..." />
          </div>
          <div className="field">
            <label htmlFor="link">Lien d’invitation</label>
            <input id="link" value={lien} onChange={(e) => setLien(e.target.value)} placeholder="https://chat.whatsapp.com/..." />
          </div>
          <button type="submit" className="button" disabled={loading}>{loading ? 'Publication...' : 'Publier un groupe'}</button>
          {message && <p style={{ marginTop: 12 }}>{message}</p>}
        </form>
      </section>

      <Link href="/payment" className="button" style={{ marginTop: '18px' }}>
        Souscrire au pass 30 jours
      </Link>
    </main>
  );
}
