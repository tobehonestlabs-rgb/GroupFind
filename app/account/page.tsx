"use client";

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase-browser';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function AccountPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [nom, setNom] = useState('');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [ville, setVille] = useState('');
  const [lien, setLien] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [iconPreview, setIconPreview] = useState('');
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

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      if (iconPreview) URL.revokeObjectURL(iconPreview);
    };
  }, [bannerPreview, iconPreview]);

  function handleFileSelection(
    event: ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    previewSetter: (value: string) => void,
  ) {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setter(null);
      previewSetter('');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage('Les images doivent faire moins de 5 Mo.');
      return;
    }

    setter(file);
    previewSetter(URL.createObjectURL(file));
  }

  async function handlePublish(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!nom.trim() || !theme.trim() || !ville.trim()) {
      setMessage('Veuillez remplir au minimum le nom, le thème et la ville.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('categorie', theme);
      formData.append('nom', nom);
      formData.append('description', description);
      formData.append('ville', ville);
      formData.append('lien_invitation', lien);
      formData.append('membres_approximatifs', '0');
      formData.append('cree_par', userId || '');
      formData.append('contact_createur', '');
      formData.append('est_actif', 'true');

      if (bannerFile) formData.append('banner', bannerFile);
      if (iconFile) formData.append('icon', iconFile);

      const res = await fetch('/api/groups', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur');

      const created = data.data?.[0];
      setMessage('Groupe publié avec succès');
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
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre groupe et ce que les membres y trouveront." />
          </div>
          <div className="field">
            <label htmlFor="ville">Ville</label>
            <input id="ville" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Abidjan, San Pedro..." />
          </div>
          <div className="field">
            <label htmlFor="link">Lien d’invitation</label>
            <input id="link" value={lien} onChange={(e) => setLien(e.target.value)} placeholder="https://chat.whatsapp.com/..." />
          </div>

          <div className="field">
            <label htmlFor="banner">Bannière du groupe</label>
            <input id="banner" type="file" accept="image/*" onChange={(event) => handleFileSelection(event, setBannerFile, setBannerPreview)} />
            {bannerPreview && <img src={bannerPreview} alt="Aperçu de la bannière" className="preview-image" />}
          </div>

          <div className="field">
            <label htmlFor="icon">Icône du groupe</label>
            <input id="icon" type="file" accept="image/*" onChange={(event) => handleFileSelection(event, setIconFile, setIconPreview)} />
            {iconPreview && <img src={iconPreview} alt="Aperçu de l’icône" className="preview-image" />}
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Publication...' : 'Publier un groupe'}
          </button>
          {message && <p style={{ marginTop: 12 }}>{message}</p>}
        </form>
      </section>

      <Link href="/payment" className="button secondary" style={{ marginTop: '18px' }}>
        Débloquer l’accès premium
      </Link>
    </main>
  );
}
