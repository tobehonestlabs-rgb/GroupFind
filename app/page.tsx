// app/page.tsx
import Link from 'next/link';
import { getGroupMedia } from '../lib/data';
import { fetchGroups, fetchCategories } from '../lib/supabase';

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
  
  const categories = await fetchCategories();
  const results = await fetchGroups({ q, category: category || undefined });
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const featured = results.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main className="home-page">
      {/* ===== HERO SECTION - Style Discord ===== */}
      <section className="hero-section">
        <div className="hero-section__container">
          <div className="hero-section__content">
            <div className="hero-section__images">
              <img 
                src="/assets/hero-left.svg" 
                alt="" 
                className="hero-section__img hero-section__img--left"
              />
              <img 
                src="/assets/hero-right.svg" 
                alt="" 
                className="hero-section__img hero-section__img--right"
              />
            </div>
            
            <h1 className="hero-section__title">
              DÉCOUVRE TA PROCHAINE COMMUNAUTÉ
            </h1>
            
            <p className="hero-section__subtitle">
              Trouve un nouvel espace pour échanger, partager et te connecter avec des personnes qui partagent tes passions.
            </p>

            <div className="hero-section__actions">
              <Link href="/search" className="hero-section__btn hero-section__btn--primary">
                Explorer les groupes
              </Link>
              <Link href="/about" className="hero-section__btn hero-section__btn--secondary">
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Barre de recherche comme Discord */}
          <div className="hero-section__search">
            <div className="hero-section__search-box">
              <svg className="hero-section__search-icon" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"
                />
              </svg>
              <input 
                type="search" 
                placeholder="Rechercher un thème ou une ville..."
                className="hero-section__search-input"
              />
              <span className="hero-section__search-hint">"ENTRÉE" pour chercher</span>
            </div>

            <div className="hero-section__categories">
              <Link href="/search?category=Tous" className="hero-section__category active">
                Tous
              </Link>
              {categories.slice(0, 6).map((cat: string) => (
                <Link key={cat} href={`/search?category=${encodeURIComponent(cat)}`} className="hero-section__category">
                  {cat}
                </Link>
              ))}
              {categories.length > 6 && (
                <Link href="/search" className="hero-section__category hero-section__category--more">
                  +{categories.length - 6}
                </Link>
              )}
            </div>

            <div className="hero-section__results">
              {results.length} groupes disponibles
            </div>
          </div>
        </div>
      </section>

      {/* ===== GROUPES SECTION ===== */}
      <section className="groups-section">
        <div className="groups-section__container">
          <div className="groups-section__header">
            <div>
              <h2 className="groups-section__title">Groupes à découvrir</h2>
              <p className="groups-section__subtitle">
                Les communautés les plus récentes sont prêtes à vous accueillir.
              </p>
            </div>
            <Link href="/search" className="groups-section__view-all">
              Voir tous les groupes
            </Link>
          </div>

          <div className="groups-section__grid">
            {featured.length > 0 ? (
              featured.map((group: any) => {
                const { banner, icon } = getGroupMedia(group);
                const description = group.description?.length > 120 ? `${group.description.slice(0, 120)}...` : group.description;
                const safeBanner = banner || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';
                
                return (
                  <article key={group.id} className="group-card">
                    <div className="group-card__banner" style={{ backgroundImage: `url(${safeBanner})` }} />
                    <div className="group-card__body">
                      <div className="group-card__header">
                        <div className="group-card__avatar">
                          {icon ? (
                            <img src={icon} alt={group.nom} className="group-card__avatar-img" />
                          ) : (
                            <span className="group-card__avatar-text">{group.nom?.charAt(0).toUpperCase() || 'G'}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="group-card__name">{group.nom}</h3>
                          <p className="group-card__meta">{group.categorie} • {group.ville}</p>
                        </div>
                      </div>
                      <p className="group-card__description">{description}</p>
                      <div className="group-card__footer">
                        <span className="group-card__tag">{group.ville}</span>
                        <Link href={`/groups/${group.id}`} className="group-card__btn">
                          Voir le groupe
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="groups-section__empty">Aucun groupe trouvé</p>
            )}
          </div>

          {results.length > PAGE_SIZE && (
            <div className="pagination">
              <Link 
                href={buildPageUrl(Math.max(1, safePage - 1), q, category)} 
                className={`pagination__link ${safePage === 1 ? 'is-disabled' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                Précédent
              </Link>
              <span className="pagination__status">Page {safePage} / {totalPages}</span>
              <Link 
                href={buildPageUrl(Math.min(totalPages, safePage + 1), q, category)} 
                className={`pagination__link ${safePage === totalPages ? 'is-disabled' : ''}`}
              >
                Suivant
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <span className="footer__brand">GROUPFIND</span>
        </div>
      </footer>
    </main>
  );
}