import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_SUPABASE_ANON_PUBLIC_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY || '';
const SUPABASE_SERVICE_ROLE = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';
const GROUPS_TABLE = process.env.NEXT_PUBLIC_SUPABASE_GROUPS || 'groupes';
const USERS_TABLE = process.env.NEXT_PUBLIC_SUPABASE_USERS || 'utilisateurs';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function createServerSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    throw new Error('Supabase server keys are not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
}

export async function fetchGroups({ q, category }: { q?: string; category?: string }) {
  const supabase = createServerSupabase();
  let query = supabase.from(GROUPS_TABLE).select('*').eq('est_actif', true);
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

export async function fetchGroupById(id: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from(GROUPS_TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function fetchUserById(user_id: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from(USERS_TABLE).select('*').eq('user_id', user_id).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function insertGroup(payload: any) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from(GROUPS_TABLE).insert(payload).select();
  if (error) throw error;
  return data;
}

export async function insertUser(payload: any) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from(USERS_TABLE).insert(payload).select();
  if (error) throw error;
  return data;
}

export async function createAuthUser({ email, password, noms, numero_telephone }: { email: string; password: string; noms?: string; numero_telephone?: string }) {
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
