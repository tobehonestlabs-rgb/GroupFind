import { NextResponse } from 'next/server';
import { insertUser } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await insertUser(body);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
