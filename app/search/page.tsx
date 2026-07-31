import Link from 'next/link';
import { categories } from '../../lib/data';
import { fetchGroups } from '../../lib/supabase';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const category = searchParams.category || 'Tous';
  const q = searchParams.q || '';
  const results = await fetchGroups({ q, category });

  return (
    <main>
      <section className="section">
        <div className="section-summary">
          <div>
            <h1 className="section-title">Résultats de recherche</h1>
            <p className="page-note">Affichage des groupes pour «{q || 'tous'}» dans «{category}».</p>
          </div>
        </div>

        <div className="input-card" style={{ marginTop: '20px' }}>
          <form action="/search" method="get" className="field">
            <label htmlFor="q">Recherche</label>
            <input id="q" name="q" defaultValue={q} placeholder="Chercher par thème ou ville" />
          </form>

          <div className="badge-list">
            <Link href="/search?category=Tous" className={category === 'Tous' ? 'badge active' : 'badge'}>
              Tous
            </Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={`/search?category=${encodeURIComponent(item)}&q=${encodeURIComponent(q)}`}
                className={category === item ? 'badge active' : 'badge'}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{results.length ? 'Groupes trouvés' : 'Aucun résultat'}</h2>
        <div className="card-grid">
          {results.map((group: any) => (
            <article key={group.id} className="card">
              <h3>{group.nom}</h3>
              <p>{group.description}</p>
              <div className="card-meta">
                <span>{group.categorie}</span>
                <span>{group.ville}</span>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Link href={`/groups/${group.id}`} className="button secondary">
                  Voir le groupe
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
