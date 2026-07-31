import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '../../../lib/supabase';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: 'PAYSTACK_SECRET_KEY missing' }, { status: 500 });
  }

  const body = await request.json();
  const { email, amount, plan, groupeId, userId } = body;

  if (!email || !amount || !userId) {
    return NextResponse.json(
      { error: 'Email, montant et userId sont requis' },
      { status: 400 }
    );
  }

  const payload = {
    email,
    amount: Number(amount) * 100,
    currency: 'XOF',
    plan: plan || 'premium',
    metadata: {
      plan,
      groupeId,
      userId,
    },
    callback_url: `${APP_URL}/payment/status`,
  };

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    console.error('Paystack error:', data);
    return NextResponse.json(
      { error: data.message || 'Erreur lors de l\'initialisation du paiement' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    status: 'success',
    message: 'Paiement initialisé avec succès',
    data: {
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      access_code: data.data.access_code,
    },
  });
}

export async function GET(request: NextRequest) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: 'PAYSTACK_SECRET_KEY missing' }, { status: 500 });
  }

  const url = new URL(request.url);
  const reference = url.searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: 'Référence de transaction requise' }, { status: 400 });
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    console.error('Paystack verification error:', data);
    return NextResponse.json(
      { error: data.message || 'Erreur de vérification' },
      { status: 400 }
    );
  }

  const transaction = data.data;
  const isSuccessful = transaction.status === 'success';
  const userId = transaction.metadata?.userId;

  if (isSuccessful && userId) {
    try {
      const supabase = createServerSupabase();
      const { error: updateError } = await supabase
        .from('utilisateurs')
        .update({ est_verifie: true })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Supabase update error:', updateError);
      }
    } catch (error) {
      console.error('Supabase update exception:', error);
    }
  }

  return NextResponse.json({
    status: isSuccessful ? 'success' : 'failed',
    message: isSuccessful ? 'Paiement vérifié avec succès' : 'Le paiement n\'a pas abouti',
    data: {
      reference: transaction.reference,
      amount: transaction.amount / 100,
      status: transaction.status,
      plan: transaction.metadata?.plan || 'premium',
      userId,
      groupeId: transaction.metadata?.groupeId,
      paid_at: transaction.paid_at,
      channel: transaction.channel,
    },
  });
}
