# GroupFind

GroupFind est une démo de site web pour trouver des groupes WhatsApp par thème et région.

## Fonctionnalités

- Page d'accueil avec recherche et filtres par catégorie
- Résultats de recherche en temps réel
- Page de présentation d'un groupe
- Pages d'inscription, compte, paiement et informations
- Paiement Paystack via route API

## Installation

1. `npm install`
2. `npm run dev`
3. Ouvrir `http://localhost:3000`

## Environnement

- `PAYSTACK_SECRET_KEY` : clé secrète Paystack
- `PAYSTACK_RETURN_URL` : URL de retour après paiement
 - `NEXT_PUBLIC_SUPABASE_URL` : URL Supabase
 - `NEXT_SUPABASE_ANON_PUBLIC_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY` : Supabase anon key
 - `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` : Supabase service role key (server only)
 - `NEXT_PUBLIC_SUPABASE_USERS` : nom de la table utilisateurs (default `utilisateurs`)
 - `NEXT_PUBLIC_SUPABASE_GROUPS` : nom de la table groupes (default `groupes`)
 - `PAYSTACK_PUBLIC_API_KEY` : clé publique Paystack
 - `PAYSTACK_SECRET_KEY` : clé secrète Paystack

Usage:

1. Configurez les variables d'environnement dans Vercel ou localement.
2. Lancez `npm run dev`.
3. Les pages `Accueil`, `Recherche`, `Groupe` et `Compte` vont lire les données depuis Supabase.
