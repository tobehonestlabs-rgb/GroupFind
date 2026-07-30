import Link from 'next/link';

export default function AccountPage() {
  return (
    <main>
      <section className="section">
        <h1 className="section-title">Mon compte</h1>
        <p className="page-note">Suivez vos groupes et gérez votre abonnement.</p>
      </section>

      <section className="section card">
        <div className="section-summary">
          <div>
            <h2 style={{ margin: 0 }}>Statistiques du compte</h2>
            <p style={{ margin: '10px 0 0', color: '#475569' }}>Aperçu de votre utilisation sur GroupFind.</p>
          </div>
        </div>

        <div className="card-meta" style={{ marginTop: '20px' }}>
          <span>Groupes rejoints : 4</span>
          <span>Pass actif : non</span>
          <span>Jour d’abonnement : -</span>
        </div>
      </section>

      <section className="section input-card">
        <h2 style={{ marginTop: 0 }}>Publier un groupe</h2>
        <div className="field">
          <label htmlFor="nom">Nom du groupe</label>
          <input id="nom" placeholder="Nom du groupe" />
        </div>
        <div className="field">
          <label htmlFor="theme">Thème</label>
          <input id="theme" placeholder="Par exemple : Tech, Business" />
        </div>
        <div className="field">
          <label htmlFor="ville">Ville</label>
          <input id="ville" placeholder="Abidjan, San Pedro..." />
        </div>
        <div className="field">
          <label htmlFor="link">Lien d’invitation</label>
          <input id="link" placeholder="https://chat.whatsapp.com/..." />
        </div>
        <button type="button" className="button">Publier un groupe</button>
      </section>

      <Link href="/payment" className="button" style={{ marginTop: '18px' }}>
        Souscrire au pass 30 jours
      </Link>
    </main>
  );
}
