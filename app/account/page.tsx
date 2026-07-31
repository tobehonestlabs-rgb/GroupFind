"use client";

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase-browser';

export default function AccountPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [nom, setNom] = useState('');
  const [theme, setTheme] = useState('');
  const [ville, setVille] = useState('');
  const [lien, setLien] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabaseBrowser.auth.getSession().then((res) => {
      const user = res.data?.session?.user;
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.noms || user.email || 'Utilisateur');
      } else {
        router.push('/signin');
      }
    });
  }, [router]);

  async function handlePublish(e: FormEvent) {
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
        cree_par: userId || null,
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
        <p className="page-note">Bonjour {userName}, gérez votre espace et publiez vos groupes.</p>
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
        Paye ta première fois
      </Link>
    </main>
  );
}
