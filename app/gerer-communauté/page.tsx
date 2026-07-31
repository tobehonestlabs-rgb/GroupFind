"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase-browser';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const COMMUNITY_CATEGORIES = [
  { label: 'Technologie', value: 'Science et Teck' },
  { label: 'Sport', value: 'Sport' },
  { label: 'Musique', value: 'Musique' },
  { label: 'Business', value: 'Business' },
  { label: 'Éducation', value: 'Éducation' },
  { label: 'Divertissement', value: 'Divertissement' },
  { label: 'Gaming', value: 'Gaming' },
];

export default function GererCommunautePage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [ville, setVille] = useState('');
  const [lien, setLien] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [iconPreview, setIconPreview] = useState('');

  useEffect(() => {
    async function init() {
      const { data } = await supabaseBrowser.auth.getSession();
      const user = data?.session?.user;
      if (!user) {
        router.push('/signin');
        return;
      }
      setUserId(user.id);
      const { data: communities, error } = await supabaseBrowser.from('groupes').select('*').eq('proprietaire', user.id).maybeSingle();
      if (error) {
        setMessage('Impossible de charger votre communauté.');
        setLoading(false);
        return;
      }
      if (!communities) {
        setCommunity(null);
        setLoading(false);
        return;
      }
      setCommunity(communities);
      setNom(communities.nom || '');
      setDescription(communities.description || '');
      setCategorie(communities.categorie || '');
      setVille(communities.ville || '');
      setLien(communities.lien_invitation || '');
      setLoading(false);
    }
    init();
  }, [router]);

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void, setPreview: (value: string) => void) {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setFile(null);
      setPreview('');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage('Les images doivent faire moins de 5 Mo.');
      return;
    }
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!community?.id) return;
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('id', community.id);
      formData.append('nom', nom);
      formData.append('description', description);
      formData.append('categorie', categorie);
      formData.append('ville', ville);
      formData.append('lien_invitation', lien);
      formData.append('existingImages', JSON.stringify(community.images || []));
      if (bannerFile) formData.append('banner', bannerFile);
      if (iconFile) formData.append('icon', iconFile);

      const res = await fetch('/api/groups', { method: 'PUT', body: formData });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur');
      setCommunity(data.data?.[0] || data.data);
      setMessage('Communauté mise à jour avec succès');
    } catch (err: any) {
      setMessage(err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!community?.id) return;
    const confirmed = window.confirm('Voulez-vous vraiment supprimer cette communauté ?');
    if (!confirmed) return;
    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/groups', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: community.id }) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur');
      setCommunity(null);
      setMessage('Communauté supprimée');
      router.push('/account');
    } catch (err: any) {
      setMessage(err.message || 'Erreur');
    } finally {
      setDeleting(false);
    }
  }

  const selectedCategory = useMemo(() => categorie || COMMUNITY_CATEGORIES[0].value, [categorie]);

  if (loading) {
    return <main className="section"><div className="empty-state"><div className="empty-state__card">Chargement…</div></div></main>;
  }

  if (!community) {
    return (
      <main className="section">
        <div className="empty-state">
          <div className="empty-state__card">
            <h1 className="section-title">Aucune communauté pour le moment</h1>
            <p className="page-note">Publiez votre première communauté pour commencer.</p>
            <Link href="/account" className="button" style={{ marginTop: 16 }}>
              Publier une communauté
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="section">
        <div className="section-summary">
          <div>
            <h1 className="section-title">Gérer votre communauté</h1>
            <p className="page-note">Modifiez les informations de votre communauté ou supprimez-la si vous souhaitez en créer une nouvelle.</p>
          </div>
          <Link href="/account" className="button secondary">Retour au compte</Link>
        </div>
      </section>

      <section className="section input-card">
        <form onSubmit={handleSave}>
          <div className="field">
            <label htmlFor="nom">Nom</label>
            <input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>

          <div className="field">
            <label>Catégorie</label>
            <div className="category-scroll" role="listbox" aria-label="Sélection de catégorie">
              {COMMUNITY_CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`category-chip ${selectedCategory === item.value ? 'is-selected' : ''}`}
                  onClick={() => setCategorie(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="ville">Ville</label>
            <input id="ville" value={ville} onChange={(e) => setVille(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="lien">Lien WhatsApp du groupe</label>
            <input id="lien" value={lien} onChange={(e) => setLien(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="banner">Bannière</label>
            <input id="banner" type="file" accept="image/*" onChange={(event) => handleFileSelection(event, setBannerFile, setBannerPreview)} />
            {(bannerPreview || community.images?.[0]) && <img src={bannerPreview || community.images?.[0]} alt="Aperçu de la bannière" className="preview-image" />}
          </div>

          <div className="field">
            <label htmlFor="icon">Icône</label>
            <input id="icon" type="file" accept="image/*" onChange={(event) => handleFileSelection(event, setIconFile, setIconPreview)} />
            {(iconPreview || community.images?.[1]) && <img src={iconPreview || community.images?.[1]} alt="Aperçu de l’icône" className="preview-image" />}
          </div>

          <div className="hero-actions">
            <button type="submit" className="button" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</button>
            <button type="button" className="button secondary" onClick={handleDelete} disabled={deleting}>{deleting ? 'Suppression...' : 'Supprimer la communauté'}</button>
          </div>
          {message && <p style={{ marginTop: 12 }}>{message}</p>}
        </form>
      </section>
    </main>
  );
}
