import Link from 'next/link';
import { getGroupMedia } from '../../../lib/data';
import { fetchGroupById } from '../../../lib/supabase';
import GroupAccessSection from '../../../components/GroupAccessSection';

export default async function GroupPage({ params, searchParams }: { params: { id: string }; searchParams: { subscribed?: string } }) {
  const group = await fetchGroupById(params.id);
  const isSubscribed = searchParams.subscribed === 'true';
  const { banner, icon } = getGroupMedia(group || {});

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
            <p className="page-note">{group.categorie} • {group.ville}</p>
          </div>
          <div>
            <Link href="/search" className="button secondary">Retour aux résultats</Link>
          </div>
        </div>

        <div className="card" style={{ padding: '28px 26px' }}>
          <div className="group-hero-stack">
            {icon ? <img src={icon} alt={group.nom} className="group-hero-stack__icon" /> : null}
            <div className="group-hero-stack__banner" style={{ backgroundImage: `url(${banner || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'})` }} />
          </div>
          <p style={{ margin: '20px 0 0', color: '#334155' }}>{group.description}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '24px' }}>
            <GroupAccessSection groupLink={group.lien_invitation} isSubscribedFallback={isSubscribed} />
          </div>
        </div>
      </section>
    </main>
  );
}
