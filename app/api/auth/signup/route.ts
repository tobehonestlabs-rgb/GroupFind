import { NextResponse } from 'next/server';
import { createServerSupabase, insertUser } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, mot_de_passe, noms, numero_telephone } = body;
    if (!email || !mot_de_passe || !noms) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Create auth user via admin
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: mot_de_passe,
      email_confirm: true,
      user_metadata: { noms, numero_telephone },
    } as any);

    // Debug logging for createUser
    console.log('signup.createUser', { authData, authError });

    if (authError) {
      console.error('signup.authError', authError);
      return NextResponse.json({ ok: false, error: authError.message }, { status: 500 });
    }

    const user_id = authData?.user?.id ?? null;

    // Insert profile into utilisateurs table
    const profile = {
      user_id,
      noms,
      email,
      mot_de_passe,
      numero_telephone,
      abonne: false,
    };

    try {
      const inserted = await insertUser(profile);
      console.log('signup.insertUser', inserted);
      return NextResponse.json({ ok: true, user: inserted?.[0] || null });
    } catch (dbErr: any) {
      console.error('signup.insertUser.error', dbErr);
      return NextResponse.json({ ok: false, error: dbErr?.message || 'Database insert failed' }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
