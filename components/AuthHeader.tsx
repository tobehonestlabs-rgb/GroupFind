// components/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Header Mobile */}
      <header className="header-mobile">
        <nav className="header-mobile__nav">
          <div className="header-mobile__logo">
            <Link href="/" aria-label="Accueil">
              <span className="header-mobile__logo-text">GroupFind<span className="header-mobile__logo-dot">.</span>ci</span>
            </Link>
          </div>
          <div className="header-mobile__actions">
            {user ? (
              <button onClick={handleLogout} className="header-mobile__login">
                Déconnexion
              </button>
            ) : (
              <Link href="/signin" className="header-mobile__login">
                Connexion
              </Link>
            )}
            <button
              className={`header-mobile__menu ${menuOpen ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6ZM4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12ZM5 17C4.44772 17 4 17.4477 4 18C4 18.5523 4.44772 19 5 19H12C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17H5Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Menu Mobile déroulant */}
        {menuOpen && (
          <nav className="header-mobile__dropdown">
            <Link href="/search" className="header-mobile__dropdown-link" onClick={() => setMenuOpen(false)}>
              Rechercher
            </Link>
            <Link href="/gerer-communauté" className="header-mobile__dropdown-link" onClick={() => setMenuOpen(false)}>
              Ajouter un groupe
            </Link>
            {user ? (
              <>
                <Link href="/account" className="header-mobile__dropdown-link" onClick={() => setMenuOpen(false)}>
                  Mon compte
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="header-mobile__dropdown-link header-mobile__dropdown-link--logout">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/signup" className="header-mobile__dropdown-btn" onClick={() => setMenuOpen(false)}>
                S'inscrire
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Header Desktop */}
      <header className="header-desktop">
        <nav className="header-desktop__nav">
          <div className="header-desktop__logo">
            <Link href="/" aria-label="Accueil">
              <span className="header-desktop__logo-text">GroupFind<span className="header-desktop__logo-dot">.</span>ci</span>
            </Link>
          </div>
          <ul className="header-desktop__links">
            <li><Link href="/search" className="header-desktop__link">Rechercher</Link></li>
            <li><Link href="/gerer-communauté" className="header-desktop__link">Ajouter un groupe</Link></li>
            {user ? (
              <>
                <li><Link href="/account" className="header-desktop__link">Mon compte</Link></li>
                <li><button onClick={handleLogout} className="header-desktop__link header-desktop__link--logout">Déconnexion</button></li>
              </>
            ) : (
              <>
                <li><Link href="/signin" className="header-desktop__link">Connexion</Link></li>
                <li><Link href="/signup" className="header-desktop__btn">S'inscrire</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <style jsx>{`
        /* ===== STYLES COMMUNS ===== */
        .header-mobile__logo-text,
        .header-desktop__logo-text {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .header-mobile__logo-dot,
        .header-desktop__logo-dot {
          color: #00a86b;
        }

        /* ===== HEADER MOBILE ===== */
        .header-mobile {
          display: none;
          background: #1e1f22;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0 16px;
          height: 48px;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-mobile__nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .header-mobile__logo a {
          text-decoration: none;
        }

        .header-mobile__actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-mobile__login {
          color: #b5bac1;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
        }

        .header-mobile__login:hover {
          color: #ffffff;
        }

        .header-mobile__menu {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #b5bac1;
          display: flex;
          align-items: center;
        }

        .header-mobile__menu:hover {
          color: #ffffff;
        }

        .header-mobile__menu svg {
          width: 24px;
          height: 24px;
        }

        .header-mobile__dropdown {
          position: absolute;
          top: 48px;
          left: 0;
          right: 0;
          background: #1e1f22;
          padding: 8px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .header-mobile__dropdown-link {
          padding: 10px 12px;
          color: #b5bac1;
          text-decoration: none;
          font-size: 1rem;
          border-radius: 4px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
        }

        .header-mobile__dropdown-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .header-mobile__dropdown-link--logout {
          color: #dc2626;
        }

        .header-mobile__dropdown-link--logout:hover {
          color: #ef4444;
          background: rgba(220, 38, 38, 0.1);
        }

        .header-mobile__dropdown-btn {
          padding: 10px 12px;
          background: #00a86b;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          text-align: center;
          margin-top: 4px;
        }

        .header-mobile__dropdown-btn:hover {
          background: #008f5a;
        }

        /* ===== HEADER DESKTOP ===== */
        .header-desktop {
          display: flex;
          background: #1e1f22;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0 24px;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 1000;
          align-items: center;
        }

        .header-desktop__nav {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-desktop__logo a {
          text-decoration: none;
        }

        .header-desktop__links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .header-desktop__link {
          padding: 8px 16px;
          color: #b5bac1;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 4px;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
        }

        .header-desktop__link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .header-desktop__link--logout {
          color: #dc2626;
        }

        .header-desktop__link--logout:hover {
          color: #ef4444;
          background: rgba(220, 38, 38, 0.1);
        }

        .header-desktop__btn {
          padding: 8px 20px;
          background: #00a86b;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .header-desktop__btn:hover {
          background: #008f5a;
          transform: translateY(-1px);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .header-desktop {
            display: none;
          }

          .header-mobile {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .header-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}