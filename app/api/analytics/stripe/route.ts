import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
    });

    const activeSubscriptions = subscriptions.data.length;

    const mrr = subscriptions.data.reduce((sum, sub) => {
      const item = sub.items.data[0];
      if (!item) return sum;
      const amount = item.price.unit_amount ?? 0;
      const interval = item.price.recurring?.interval;
      if (interval === 'year') return sum + Math.round(amount / 12);
      return sum + amount;
    }, 0);

    const charges = await stripe.charges.list({ limit: 100 });
    const totalRevenue = charges.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0);

    const recentCharges = charges.data
      .filter((c) => c.paid && !c.refunded)
      .slice(0, 10)
      .map((c) => ({
        date: new Date(c.created * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        amount: c.amount,
        customer: c.billing_details?.name || c.receipt_email || 'Customer',
      }));

    return NextResponse.json({
      mrr,
      totalRevenue,
      activeSubscriptions,
      recentPayments: recentCharges,
    });
  } catch (err) {
    console.error('Stripe analytics error:', err);
    return NextResponse.json({ error: 'Failed to fetch Stripe data' }, { status: 500 });
  }
}