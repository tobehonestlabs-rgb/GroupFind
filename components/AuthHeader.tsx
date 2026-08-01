// components/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Récupérer la session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Écouter les changements d'auth
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
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          <span className="header__logo-icon">📱</span>
          <span className="header__logo-text">GroupFind<span className="header__logo-dot">.</span>ci</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="header__nav desktop-nav">
          <Link href="/search" className="header__nav-link">Rechercher</Link>
          <Link href="/gerer-communauté" className="header__nav-link">Ajouter un groupe</Link>
          {user ? (
            <>
              <Link href="/account" className="header__nav-link">Mon compte</Link>
              <button onClick={handleLogout} className="header__nav-link header__nav-link--logout">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="header__nav-link">Connexion</Link>
              <Link href="/signup" className="button header__nav-btn">S'inscrire</Link>
            </>
          )}
        </nav>

        {/* Menu Burger (mobile) */}
        <button 
          className={`header__burger ${menuOpen ? 'is-active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Mobile */}
        <nav className={`header__nav mobile-nav ${menuOpen ? 'is-open' : ''}`}>
          <Link href="/search" className="header__nav-link" onClick={() => setMenuOpen(false)}>Rechercher</Link>
          <Link href="/gerer-communauté" className="header__nav-link" onClick={() => setMenuOpen(false)}>Ajouter un groupe</Link>
          {user ? (
            <>
              <Link href="/account" className="header__nav-link" onClick={() => setMenuOpen(false)}>Mon compte</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="header__nav-link header__nav-link--logout">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className="header__nav-link" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link href="/signin" className="button header__nav-btn" onClick={() => setMenuOpen(false)}>S'inscrire</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}