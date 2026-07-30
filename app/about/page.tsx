import Link from 'next/link';

export default function AboutPage() {
  return (
    <main>
      <section className="section">
        <h1 className="section-title">À propos de GroupFind</h1>
        <p className="page-note">GroupFind est une plateforme simple pour découvrir des groupes WhatsApp par thème et par ville, spécialement pensée pour la Côte d’Ivoire.</p>
      </section>

      <section className="section card">
        <h2>Ce que propose GroupFind</h2>
        <ul style={{ margin: '16px 0 0', paddingLeft: '20px', color: '#475569' }}>
          <li>Recherche par mot-clé et filtres par catégorie.</li>
          <li>Fiche de groupe avec description, photos et lien de participation.</li>
          <li>Page compte pour voir l’activité et publier un groupe.</li>
          <li>Paiement Paystack pour obtenir l’accès premium.</li>
        </ul>
      </section>

      <section className="section card">
        <h2>Comment utiliser</h2>
        <p>1. Recherchez un thème ou une ville.</p>
        <p>2. Sélectionnez une catégorie.</p>
        <p>3. Ouvrez une fiche de groupe pour obtenir le lien WhatsApp.</p>
        <p>4. Souscrivez au pass pour accéder au lien de rejoint.</p>
      </section>

      <section className="section card">
        <h2>Notre approche</h2>
        <p>Le site reste léger, visuel et adapté aux mobiles. Chaque page a des bordures douces, un contraste apaisant et une navigation fluide.</p>
      </section>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
        <Link href="/" className="button secondary">Retour à l’accueil</Link>
        <Link href="/signup" className="button">Créer un compte</Link>
      </div>
    </main>
  );
}
