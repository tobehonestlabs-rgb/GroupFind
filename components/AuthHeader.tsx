// components/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '../lib/supabase';
import Image from 'next/image';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setAuthMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    setAuthMenuOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Header Mobile */}
      <header className="header-mobile">
        <nav className="header-mobile__nav">
          <div className="header-mobile__logo">
            <Link href="/" aria-label="Accueil">
              <Image 
                src="/logo.svg" 
                alt="GroupFind.ci" 
                width={128} 
                height={80}
                className="header-mobile__logo-icon"
              />
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
        <div className="header-desktop__container">
          {/* Logo - Gauche */}
          <div className="header-desktop__left">
            <Link href="/" className="header-desktop__logo" aria-label="Accueil">
              <Image 
                src="/public/logo.svg" 
                alt="GroupFind.ci" 
                width={136} 
                height={88}
                className="header-desktop__logo-icon"
                priority
              />
            </Link>
          </div>

          {/* Liens - Centre */}
          <nav className="header-desktop__center">
            <Link href="/search" className="header-desktop__link">Rechercher</Link>
            <Link href="/gerer-communauté" className="header-desktop__link">Ajouter un groupe</Link>
          </nav>

          {/* Auth - Droite */}
          <div className="header-desktop__right" ref={authMenuRef}>
            {user ? (
              <>
                <button 
                  className="header-desktop__auth-btn"
                  onClick={() => setAuthMenuOpen(!authMenuOpen)}
                >
                  <span className="header-desktop__auth-avatar">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="header-desktop__auth-name">
                    {user.email?.split('@')[0] || 'Compte'}
                  </span>
                  <svg className="header-desktop__auth-chevron" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 8L1 3h10L6 8z" fill="currentColor"/>
                  </svg>
                </button>

                {authMenuOpen && (
                  <div className="header-desktop__auth-dropdown">
                    <Link href="/account" className="header-desktop__auth-dropdown-link" onClick={() => setAuthMenuOpen(false)}>
                      Mon compte
                    </Link>
                    <button onClick={() => { handleLogout(); setAuthMenuOpen(false); }} className="header-desktop__auth-dropdown-link header-desktop__auth-dropdown-link--logout">
                      Déconnexion
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link href="/signin" className="header-desktop__link">Connexion</Link>
                <Link href="/signup" className="header-desktop__btn">S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        /* ===== HEADER MOBILE ===== */
        .header-mobile {
          display: none;
          background: #1e1f22;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0 16px;
          height: 56px;
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }

        .header-mobile__nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-mobile__logo a {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .header-mobile__logo-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .header-mobile__actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-mobile__login {
          color: #b5bac1;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
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

        .header-mobile__dropdown {
          position: absolute;
          top: 56px;
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
          font-weight: 600;
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
          font-weight: 600;
          text-align: center;
          margin-top: 4px;
        }

        .header-mobile__dropdown-btn:hover {
          background: #008f5a;
        }

        /* ===== HEADER DESKTOP ===== */
        .header-desktop {
          display: flex;
          background: transparent;
          padding: 0 24px;
          height: 72px;
          position: sticky;
          top: 0;
          z-index: 1000;
          align-items: center;
          width: 100%;
          transition: background 0.3s ease;
        }

        .header-desktop__container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ===== GAUCHE ===== */
        .header-desktop__left {
          display: flex;
          align-items: center;
          min-width: 60px;
        }

        .header-desktop__logo {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .header-desktop__logo-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        /* ===== CENTRE ===== */
        .header-desktop__center {
          display: flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .header-desktop__link {
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 4px;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .header-desktop__link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ===== DROITE ===== */
        .header-desktop__right {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
          justify-content: flex-end;
          position: relative;
        }

        .header-desktop__auth-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #ffffff;
        }

        .header-desktop__auth-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .header-desktop__auth-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #00a86b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #ffffff;
        }

        .header-desktop__auth-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #ffffff;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header-desktop__auth-chevron {
          color: rgba(255, 255, 255, 0.5);
        }

        .header-desktop__btn {
          padding: 8px 20px;
          background: #00a86b;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 168, 107, 0.3);
        }

        .header-desktop__btn:hover {
          background: #008f5a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 168, 107, 0.4);
        }

        /* ===== AUTH DROPDOWN ===== */
        .header-desktop__auth-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #1e1f22;
          border-radius: 8px;
          padding: 6px;
          min-width: 200px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .header-desktop__auth-dropdown-link {
          padding: 10px 14px;
          color: #b5bac1;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 4px;
          transition: all 0.2s ease;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          width: 100%;
        }

        .header-desktop__auth-dropdown-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .header-desktop__auth-dropdown-link--logout {
          color: #dc2626;
        }

        .header-desktop__auth-dropdown-link--logout:hover {
          color: #ef4444;
          background: rgba(220, 38, 38, 0.1);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .header-desktop {
            display: none !important;
          }

          .header-mobile {
            display: block !important;
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