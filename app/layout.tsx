import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GroupFind',
  description: 'Trouve des groupes WhatsApp par thème et région en Côte d’Ivoire.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="page-shell">
          <header className="topbar">
            <div className="brand">
              <div className="brand-mark">GF</div>
              <div>
                <p className="brand-label">GroupFind</p>
                <p className="brand-subtitle">Groupes WhatsApp Côte d’Ivoire</p>
              </div>
            </div>
            <nav className="main-nav">
              <a href="/">Accueil</a>
              <a href="/about">À propos</a>
              <a href="/signup">Inscription</a>
              <a href="/account">Compte</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
