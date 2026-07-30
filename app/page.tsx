import Link from 'next/link';
import { categories, filterGroups, groups } from '../lib/data';

export default function HomePage() {
  const featured = groups.slice(0, 4);

  return (
    <main>
      <section className="section">
        <div className="section-summary">
          <div>
            <h1 className="section-title">GroupFind</h1>
            <p className="page-note">Trouvez des groupes WhatsApp par thème, ville ou intérêt en Côte d’Ivoire.</p>
          </div>
          <Link href="/about" className="button secondary">
            En savoir plus
          </Link>
        </div>

        <div className="input-card" style={{ marginTop: '24px' }}>
          <form action="/search" method="get" className="field">
            <label htmlFor="q">Rechercher un thème ou une ville</label>
            <input id="q" name="q" placeholder="Par exemple : Business, Education, Abidjan..." />
          </form>
          <div className="badge-list">
            <Link href="/search?category=Tous" className="badge active">
              Tous
            </Link>
            {categories.map((category) => (
              <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="badge">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-summary">
          <h2 className="section-title">Groupes populaires</h2>
          <Link href="/search" className="button secondary">
            Voir tous les groupes
          </Link>
        </div>

        <div className="card-grid">
          {featured.map((group) => (
            <article key={group.id} className="card">
              <h3>{group.nom}</h3>
              <p>{group.description}</p>
              <div className="card-meta">
                <span>{group.categorie}</span>
                <span>{group.ville}</span>
                <span>{group.membres_approximatifs} membres</span>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Link href={`/groups/${group.id}`} className="button secondary">
                  En savoir plus
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
