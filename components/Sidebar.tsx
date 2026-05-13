'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const nav = [
  { section: 'Overview', items: [
    { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
    { label: 'Quick Start', href: '/dashboard/quick-start', icon: '★' },
  ]},
  { section: 'Create', items: [
    { label: 'AI Writer', href: '/dashboard/writer', icon: '✍', badge: 'New', badgeColor: '#4F7CFF' },
    { label: 'Research', href: '/dashboard/research', icon: '🔍' },
    { label: 'Templates', href: '/dashboard/templates', icon: '📄' },
    { label: 'Bulk Generate', href: '/dashboard/bulk', icon: '⚡', badge: 'Pro', badgeColor: '#1DB8A0' },
  ]},
  { section: 'Analyze', items: [
    { label: 'SEO Analytics', href: '/dashboard/analytics', icon: '📈' },
    { label: 'Keyword Tracker', href: '/dashboard/keywords', icon: '🎯' },
    { label: 'Competitors', href: '/dashboard/competitors', icon: '📊', badge: 'Pro', badgeColor: '#1DB8A0' },
    { label: 'Clusters', href: '/dashboard/clusters', icon: '🕸' },
  ]},
  { section: 'Site', items: [
    { label: 'Site Audit', href: '/dashboard/site-audit', icon: '🌐' },
    { label: 'Publish', href: '/dashboard/publish', icon: '🚀' },
    { label: 'Landing Pages', href: '/dashboard/landing-pages', icon: '📱', badge: 'Pro', badgeColor: '#1DB8A0' },
  ]},
  { section: 'Workspace', items: [
    { label: 'Projects', href: '/dashboard/projects', icon: '📁' },
    { label: 'Article Library', href: '/dashboard/article-library', icon: '📚' },
    { label: 'Integrations', href: '/dashboard/integrations', icon: '🔌' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside style={{ width: '220px', flexShrink: 0, background: '#161F35', borderRight: '1px solid #1E2D5A', display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>

      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1E2D5A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polyline points="2,14 7,8 11,11 18,4" stroke="#4F7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,4 18,4 18,8" stroke="#4F7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.3px' }}>
            <span style={{ color: '#E8EDF8' }}>Rank</span>
            <span style={{ color: '#4F7CFF' }}>Flow</span>
          </span>
        </div>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '8px', color: '#7B8DB0', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          <span>My Workspace</span>
          <span>▾</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #1E2D5A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '8px', padding: '7px 10px' }}>
          <span style={{ color: '#7B8DB0', fontSize: '13px' }}>⌕</span>
          <span style={{ fontSize: '12px', color: '#7B8DB0', flex: 1 }}>Search...</span>
          <span style={{ fontSize: '10px', color: '#7B8DB0', background: '#161F35', padding: '2px 5px', borderRadius: '4px' }}>⌘K</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {nav.map((section, si) => (
          <div key={section.section}>
            {si > 0 && <div style={{ height: '1px', background: '#1E2D5A', margin: '6px 12px' }} />}
            <p style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7B8DB0', padding: '8px 16px 4px' }}>{section.section}</p>
            {section.items.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 12px', margin: '1px 8px', borderRadius: '8px', textDecoration: 'none', background: active ? 'rgba(79,124,255,0.12)' : 'transparent', position: 'relative' }}>
                  {active && <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '16px', background: '#4F7CFF', borderRadius: '0 2px 2px 0' }} />}
                  <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', flex: 1, color: active ? '#E8EDF8' : '#7B8DB0', fontWeight: active ? '500' : '400' }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '10px', background: item.badgeColor + '22', color: item.badgeColor }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid #1E2D5A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#4F7CFF,#1DB8A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#E8EDF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName ?? 'My Account'}</div>
            <div style={{ fontSize: '11px', color: '#7B8DB0' }}>Pro Plan</div>
          </div>
          <span style={{ color: '#7B8DB0', fontSize: '14px' }}>···</span>
        </div>
      </div>
    </aside>
  );
}