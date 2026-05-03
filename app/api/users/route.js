import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const client = await clerkClient()
    const { data } = await client.users.getUserList({ limit: 100 })

    const users = data.map(u => ({
      id: u.id,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
      email: u.emailAddresses[0]?.emailAddress || '',
      plan: u.publicMetadata?.plan || 'Free',
      joined: new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    }))

    return Response.json({ users })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}