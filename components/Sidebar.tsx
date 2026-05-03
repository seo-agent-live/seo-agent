'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: '📊' },
  { label: 'Payments', href: '/dashboard/payments', icon: '💳' },
  { label: 'Users', href: '/dashboard/users', icon: '👥' },
  { label: 'Products', href: '/dashboard/products', icon: '📦' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#0f0f0f',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
        }}>⚡</div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>SEOAgent</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px' }}>
        {navItems.map(({ label, href, icon }) => {
          const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '4px',
              textDecoration: 'none',
              color: isActive ? '#fff' : '#9ca3af',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: '14px',
              transition: 'all 0.15s ease',
            }}>
              <span style={{ fontSize: '16px' }}>{icon}</span>
              {label}
              {isActive && <span style={{
                marginLeft: 'auto',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
              }} />}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => signOut({ redirectUrl: '/' })} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 12px',
          borderRadius: '8px',
          border: 'none',
          background: 'transparent',
          color: '#9ca3af',
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%',
        }}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  )
}