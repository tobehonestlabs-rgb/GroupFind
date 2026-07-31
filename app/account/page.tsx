"use client";

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase-browser';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const COMMUNITY_CATEGORIES = [
  { label: 'Science et Tech', value: 'Science et Tech' },
  { label: 'Sport', value: 'Sport' },
  { label: 'Musique', value: 'Musique' },
  { label: 'Business', value: 'Business' },
  { label: 'Éducation', value: 'Éducation' },
  { label: 'Divertissement', value: 'Divertissement' },
  { label: 'Gaming', value: 'Gaming' },
];

export default function AccountPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [nom, setNom] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(COMMUNITY_CATEGORIES[0].value);
  const [description, setDescription] = useState('');
  const [ville, setVille] = useState('');
  const [lien, setLien] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [iconPreview, setIconPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasCommunity, setHasCommunity] = useState(false);
  const [communityLoading, setCommunityLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async (res) => {
      const user = res.data?.session?.user;
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.noms || user.email || 'Utilisateur');
        const { data, error } = await supabaseBrowser.from('groupes').select('id').eq('proprietaire', user.id).limit(1);
        if (!error) {
          setHasCommunity((data?.length || 0) > 0);
        }
      } else {
        router.push('/signin');
      }
      setCommunityLoading(false);
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

    if (!nom.trim() || !selectedCategory || !ville.trim()) {
      setMessage('Veuillez remplir au minimum le nom, la catégorie et la ville.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('categorie', selectedCategory);
      formData.append('nom', nom);
      formData.append('description', description);
      formData.append('ville', ville);
      formData.append('lien_invitation', lien);
      formData.append('membres_approximatifs', '0');
      formData.append('cree_par', userId || '');
      formData.append('contact_createur', '');
      formData.append('est_actif', 'true');
      formData.append('proprietaire', userId || '');
      formData.append('owner_id', userId || '');

      if (bannerFile) formData.append('banner', bannerFile);
      if (iconFile) formData.append('icon', iconFile);

      const res = await fetch('/api/groups', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur');

      const created = data.data?.[0];
      setMessage('Communauté publiée avec succès');
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
        <p className="page-note">Bonjour {userName}, gérez votre espace et publiez votre communauté.</p>
      </section>

      <section className="section card">
        <div className="section-summary">
          <div>
            <h2 style={{ margin: 0 }}>Gestion de votre communauté</h2>
            <p style={{ margin: '10px 0 0', color: '#475569' }}>Publiez une seule communauté et gérez-la ensuite à tout moment.</p>
          </div>
          <Link href="/gerer-communauté" className="button secondary">
            Gérer ma communauté
          </Link>
        </div>
      </section>

      {communityLoading ? (
        <section className="section input-card">
          <p>Chargement de votre espace…</p>
        </section>
      ) : hasCommunity ? (
        <section className="section input-card">
          <h2 style={{ marginTop: 0 }}>Gérer votre communauté</h2>
          <p style={{ marginBottom: 16 }}>Vous avez déjà une communauté. Vous pouvez uniquement la gérer à partir de cette page.</p>
          <Link href="/gerer-communauté" className="button">
            Gérer ma communauté
          </Link>
        </section>
      ) : (
        <section className="section input-card">
          <h2 style={{ marginTop: 0 }}>Publier une communauté</h2>
          <form onSubmit={handlePublish}>
            <div className="field">
              <label htmlFor="nom">Nom de la communauté</label>
              <input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom de la communauté" />
            </div>

            <div className="field">
              <label>Catégorie</label>
              <div className="category-scroll" role="listbox" aria-label="Sélection de catégorie">
                {COMMUNITY_CATEGORIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`category-chip ${selectedCategory === item.value ? 'is-selected' : ''}`}
                    onClick={() => setSelectedCategory(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
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
              <label htmlFor="link">Lien WhatsApp du groupe</label>
              <input id="link" value={lien} onChange={(e) => setLien(e.target.value)} placeholder="https://chat.whatsapp.com/..." />
            </div>

            <div className="field">
              <label htmlFor="banner">Bannière de la communauté</label>
              <input id="banner" type="file" accept="image/*" onChange={(event) => handleFileSelection(event, setBannerFile, setBannerPreview)} />
              {bannerPreview && <img src={bannerPreview} alt="Aperçu de la bannière" className="preview-image" />}
            </div>

            <div className="field">
              <label htmlFor="icon">Icône de la communauté</label>
              <input id="icon" type="file" accept="image/*" onChange={(event) => handleFileSelection(event, setIconFile, setIconPreview)} />
              {iconPreview && <img src={iconPreview} alt="Aperçu de l’icône" className="preview-image" />}
            </div>

            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Publication...' : 'Publier une communauté'}
            </button>
            {message && <p style={{ marginTop: 12 }}>{message}</p>}
          </form>
        </section>
      )}

      <Link href="/payment" className="button secondary" style={{ marginTop: '18px' }}>
        Débloquer l’accès premium
      </Link>
    </main>
  );
}
