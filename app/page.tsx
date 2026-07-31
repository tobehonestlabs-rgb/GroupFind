import Link from 'next/link';
import { categories } from '../lib/data';
import { fetchGroups } from '../lib/supabase';

const PAGE_SIZE = 5;

function buildPageUrl(page: number, q: string, category: string) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  params.set('page', String(page));
  return `/?${params.toString()}`;
}

export default async function HomePage({ searchParams }: { searchParams?: { page?: string; q?: string; category?: string } }) {
  const currentPage = Number(searchParams?.page || '1');
  const q = searchParams?.q?.trim() || '';
  const category = searchParams?.category || '';
  const results = await fetchGroups({ q, category: category || undefined });
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const featured = results.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main>
      <section className="section hero-shell">
        <div className="hero-copy">
          <span className="eyebrow">Groupes WhatsApp • Côte d’Ivoire</span>
          <h1 className="section-title hero-title">Trouvez la bonne communauté en quelques secondes.</h1>
          <p className="page-note">
            Explorez des groupes actifs par thème, ville et intérêt, puis rejoignez les conversations qui vous ressemblent.
          </p>
          <div className="hero-actions">
            <Link href="/search" className="button">
              Explorer les groupes
            </Link>
            <Link href="/about" className="button secondary">
              En savoir plus
            </Link>
          </div>
        </div>

        <div className="input-card hero-search-card">
          <form action="/search" method="get" className="field">
            <label htmlFor="q">Rechercher un thème ou une ville</label>
            <input id="q" name="q" placeholder="Ex. Business, Abidjan, Education" defaultValue={q} />
          </form>
          <div className="badge-list">
            <Link href="/search?category=Tous" className={`badge ${!category || category === 'Tous' ? 'active' : ''}`}>
              Tous
            </Link>
            {categories.map((cat) => (
              <Link key={cat} href={`/search?category=${encodeURIComponent(cat)}`} className={`badge ${category === cat ? 'active' : ''}`}>
                {cat}
              </Link>
            ))}
          </div>
          <div className="results-label">{results.length} groupes disponibles</div>
        </div>
      </section>

      <section className="section">
        <div className="section-summary">
          <div>
            <h2 className="section-title">Groupes à découvrir</h2>
            <p className="page-note" style={{ marginTop: 8 }}>
              Les communautés les plus récentes sont prêtes à vous accueillir.
            </p>
          </div>
          <Link href="/search" className="button secondary">
            Voir tous les groupes
          </Link>
        </div>

        <div className="card-grid">
          {featured.map((group: any) => {
            const banner = group.images?.[0] || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';
            const description = group.description?.length > 120 ? `${group.description.slice(0, 120)}...` : group.description;
            return (
              <article key={group.id} className="group-card">
                <div className="group-card__media" style={{ backgroundImage: `url(${banner})` }} />
                <div className="group-card__body">
                  <div className="group-card__top">
                    <div className="group-card__avatar">{(group.nom || 'GF').slice(0, 1).toUpperCase()}</div>
                    <div>
                      <h3>{group.nom}</h3>
                      <p className="group-card__meta">{group.categorie} • {group.ville}</p>
                    </div>
                  </div>
                  <p>{description}</p>
                  <div className="card-meta">
                    <span>{group.membres_approximatifs} membres</span>
                    <span>{group.ville}</span>
                  </div>
                  <Link href={`/groups/${group.id}`} className="button secondary">
                    Voir le groupe
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {results.length > PAGE_SIZE && (
          <div className="pagination">
            <Link href={buildPageUrl(Math.max(1, safePage - 1), q, category)} className={`pagination__link ${safePage === 1 ? 'is-disabled' : ''}`}>
              Précédent
            </Link>
            <span className="pagination__status">Page {safePage} / {totalPages}</span>
            <Link href={buildPageUrl(Math.min(totalPages, safePage + 1), q, category)} className={`pagination__link ${safePage === totalPages ? 'is-disabled' : ''}`}>
              Suivant
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
