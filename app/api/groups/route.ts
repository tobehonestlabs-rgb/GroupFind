import { NextResponse } from 'next/server';
import { insertGroup } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await insertGroup(body);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
