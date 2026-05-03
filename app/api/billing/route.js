import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const charges = await stripe.charges.list({ limit: 20 })

    const transactions = charges.data.map((charge) => ({
      id: charge.id,
      date: new Date(charge.created * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }),
      amount: `$${(charge.amount / 100).toFixed(2)}`,
      status: charge.status === 'succeeded' ? 'Paid' : 'Failed',
      description: charge.description || 'Subscription',
    }))

    return Response.json({ transactions })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}