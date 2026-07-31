"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../lib/supabase-browser';

type Props = {
  groupLink: string;
  isSubscribedFallback: boolean;
};

type AccessState = 'loading' | 'verified' | 'unverified' | 'anonymous';

export default function GroupAccessSection({ groupLink, isSubscribedFallback }: Props) {
  const [accessState, setAccessState] = useState<AccessState>('loading');
  const [message, setMessage] = useState<string>('Vérification du statut...');

  useEffect(() => {
    async function checkAccess() {
      const session = await supabaseBrowser.auth.getSession();
      const user = session.data?.session?.user;

      if (!user) {
        setAccessState('anonymous');
        setMessage('Connectez-vous pour rejoindre le groupe.');
        return;
      }

      try {
        const { data, error } = await supabaseBrowser
          .from('utilisateurs')
          .select('est_verifie')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          setAccessState('unverified');
          setMessage('Impossible de vérifier votre statut.');
          return;
        }

        if (data?.est_verifie) {
          setAccessState('verified');
          setMessage('Votre compte est vérifié, vous pouvez rejoindre le groupe librement.');
        } else {
          setAccessState('unverified');
          setMessage('Vous devez souscrire pour rejoindre ce groupe.');
        }
      } catch (err) {
        setAccessState('unverified');
        setMessage('Erreur lors de la vérification du statut.');
      }
    }

    checkAccess();
  }, []);

  if (isSubscribedFallback) {
    return (
      <>
        <a href={groupLink} className="button" target="_blank" rel="noreferrer">
          Rejoindre le groupe
        </a>
        <p className="page-note" style={{ marginTop: '16px' }}>
          Accès autorisé via abonnement.
        </p>
      </>
    );
  }

  if (accessState === 'loading') {
    return <button className="button" disabled>Chargement...</button>;
  }

  if (accessState === 'verified') {
    return (
      <>
        <a href={groupLink} className="button" target="_blank" rel="noreferrer">
          Rejoindre le groupe
        </a>
        <p className="page-note" style={{ marginTop: '16px' }}>{message}</p>
      </>
    );
  }

  if (accessState === 'anonymous') {
    return (
      <>
        <Link href="/signin" className="button secondary">
          Se connecter pour rejoindre
        </Link>
        <p className="page-note" style={{ marginTop: '16px' }}>{message}</p>
      </>
    );
  }

  return (
    <>
      <Link href="/payment" className="button secondary">
        Abonnez-vous pour rejoindre
      </Link>
      <p className="page-note" style={{ marginTop: '16px' }}>{message}</p>
    </>
  );
}
