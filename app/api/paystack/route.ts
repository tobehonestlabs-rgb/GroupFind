import { NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_RETURN_URL = process.env.PAYSTACK_RETURN_URL || 'https://example.com';

export async function GET() {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: 'PAYSTACK_SECRET_KEY missing' }, { status: 500 });
  }

  const body = {
    email: 'client@groupfind.ci',
    amount: 99,
    currency: 'XOF',
    callback_url: PAYSTACK_RETURN_URL,
    metadata: {
      service: 'GroupFind Pass 30 jours',
    },
  };

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    return NextResponse.json(
      { error: 'Paystack initialization failed', details: errorData },
      { status: 502 }
    );
  }

  const data = await response.json();
  return NextResponse.redirect(data.data.authorization_url);
}
