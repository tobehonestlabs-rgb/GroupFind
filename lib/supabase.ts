import { createClient } from '@supabase/supabase-js';

// Variables publiques (disponibles côté client ET serveur)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_SUPABASE_ANON_PUBLIC_KEY || '';

// Variables serveur (disponibles UNIQUEMENT côté serveur)
const SUPABASE_SERVICE_ROLE = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

const GROUPS_TABLE = process.env.NEXT_PUBLIC_SUPABASE_GROUPS || 'groupes';
const USERS_TABLE = process.env.NEXT_PUBLIC_SUPABASE_USERS || 'utilisateurs';

// Client public pour les opérations côté client
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Client serveur pour les opérations admin (uniquement en server-side)
export function createServerSupabase() {
  if (!SUPABASE_URL) {
    throw new Error('Supabase URL is not configured');
  }
  // Utiliser ANON_KEY si SERVICE_ROLE n'est pas disponible
  const key = SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY;
  return createClient(SUPABASE_URL, key);
}

// ============================================
// FONCTIONS PUBLIQUES (utilisent le client public)
// ============================================

export async function fetchGroups({ q, category }: { q?: string; category?: string }) {
  // Utiliser le client public pour les lectures
  let query = supabaseClient.from(GROUPS_TABLE).select('*').eq('est_actif', true);
  
  if (category && category !== 'Tous') {
    query = query.eq('categorie', category);
  }
  if (q) {
    const term = `%${q}%`;
    query = query.or(`nom.ilike.${term},description.ilike.${term},ville.ilike.${term}`);
  }
  const { data, error } = await query.order('cree_le', { ascending: false }).limit(200);
  if (error) throw error;
  return data || [];
}
// lib/supabase.ts
export async function fetchCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabaseClient
      .from('groupes')
      .select('categorie')
      .eq('est_actif', true)
      .not('categorie', 'is', null);

    if (error) throw error;
    
    // Extraire les catégories uniques
    const uniqueCategories = [...new Set(data.map((item: any) => item.categorie))];
    return uniqueCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
export async function fetchGroupById(id: string) {
  const { data, error } = await supabaseClient
    .from(GROUPS_TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function fetchUserById(user_id: string) {
  const { data, error } = await supabaseClient
    .from(USERS_TABLE)
    .select('*')
    .eq('user_id', user_id)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

// ============================================
// FONCTIONS D'ECRITURE (utilisent le client serveur si disponible)
// ============================================

export async function insertGroup(payload: any) {
  // Utiliser le client public (avec RLS)
  const { data, error } = await supabaseClient.from(GROUPS_TABLE).insert(payload).select();
  if (error) throw error;
  return data;
}

export async function insertUser(payload: any) {
  // Utiliser le client public (avec RLS)
  const { data, error } = await supabaseClient.from(USERS_TABLE).insert(payload).select();
  if (error) throw error;
  return data;
}

// ============================================
// FONCTIONS SERVEUR UNIQUEMENT (ne pas appeler depuis le client)
// ============================================

export async function createAuthUser({ email, password, noms, numero_telephone }: { 
  email: string; 
  password: string; 
  noms?: string; 
  numero_telephone?: string 
}) {
  // Cette fonction doit être appelée UNIQUEMENT depuis une API route ou server component
  if (typeof window !== 'undefined') {
    throw new Error('createAuthUser cannot be called from the client');
  }
  
  const supabase = createServerSupabase();
  // @ts-ignore admin method
  const { data, error } = await (supabase.auth as any).admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { noms, numero_telephone },
  });
  if (error) throw error;
  return data;
}