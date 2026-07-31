'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../lib/supabase-browser';

type SessionUser = {
  id: string;
  email?: string | null;
  user_metadata?: { noms?: string };
};

export default function AuthHeader() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const session = supabaseBrowser.auth.getSession();
    session.then((res) => {
      if (res.data?.session?.user) {
        setUser(res.data.session.user as SessionUser);
      }
    });

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as SessionUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    setUser(null);
  }

  return (
    <nav className="main-nav">
      <Link href="/">Accueil</Link>
      <Link href="/about">À propos</Link>
      {user ? (
        <>
          <span className="nav-user">Bonjour, {user.user_metadata?.noms || user.email || 'Utilisateur'}</span>
          <Link href="/account">Compte</Link>
          <button type="button" className="button ghost" onClick={handleSignOut}>
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link href="/signup">Inscription</Link>
          <Link href="/signin">Connexion</Link>
        </>
      )}
    </nav>
  );
}
