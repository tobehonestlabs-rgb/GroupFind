export default function SignupPage() {
  return (
    <main>
      <section className="section">
        <h1 className="section-title">Créer un compte</h1>
        <p className="page-note">Inscrivez-vous pour publier des groupes et accéder à vos favoris.</p>
      </section>

      <section className="section input-card">
        <div className="field">
          <label htmlFor="name">Nom complet</label>
          <input id="name" placeholder="Jean Yao" />
        </div>
        <div className="field">
          <label htmlFor="phone">Numéro de téléphone</label>
          <input id="phone" placeholder="+225 01 23 45 67" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="jean@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>
        <button type="button" className="button">Créer mon compte</button>
      </section>
    </main>
  );
}
