import Link from 'next/link';
import { fetchGroupById } from '../../../lib/supabase';
import GroupAccessSection from '../../../components/GroupAccessSection';

export default async function GroupPage({ params, searchParams }: { params: { id: string }; searchParams: { subscribed?: string } }) {
  const group = await fetchGroupById(params.id);
  const isSubscribed = searchParams.subscribed === 'true';

  if (!group) {
    return (
      <main>
        <section className="section">
          <h1 className="section-title">Groupe introuvable</h1>
          <p className="page-note">Le groupe demandé n’existe pas ou a été supprimé.</p>
          <Link href="/" className="button secondary">Retour à l’accueil</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section">
        <div className="section-summary">
          <div>
            <h1 className="section-title">{group.nom}</h1>
            <p className="page-note">{group.categorie} • {group.ville} • {group.membres_approximatifs} membres</p>
          </div>
          <div>
            <Link href="/search" className="button secondary">Retour aux résultats</Link>
          </div>
        </div>

        <div className="card" style={{ padding: '28px 26px' }}>
          <p style={{ margin: 0, color: '#334155' }}>{group.description}</p>
          <div className="card-meta" style={{ marginTop: '18px' }}>
            <span>Notes : {group.note_moyenne} / 5</span>
            <span>Avis : {group.nombre_avis}</span>
          </div>

          {group.images?.length > 0 && (
            <div className="image-grid">
              {group.images.map((image: string) => (
                <img key={image} src={image} alt={group.nom} className="preview-image" />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '24px' }}>
            <GroupAccessSection groupLink={group.lien_invitation} isSubscribedFallback={isSubscribed} />
          </div>
        </div>
      </section>
    </main>
  );
}
