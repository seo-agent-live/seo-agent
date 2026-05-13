'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  LayoutDashboard, Star, PenLine, Users, FileText, Zap,
  BarChart2, Clock, TrendingDown, Network, Globe, Upload,
  MonitorDot, FolderOpen, Library, Plug, Settings
} from 'lucide-react';

const nav = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',   href: '/dashboard',             icon: LayoutDashboard },
      { label: 'Quick Start', href: '/dashboard/quick-start', icon: Star },
    ]
  },
  {
    label: 'Create',
    items: [
      { label: 'AI Writer',         href: '/dashboard/writer',    icon: PenLine,    badge: 'New' },
      { label: 'Research',          href: '/dashboard/research',  icon: Users },
      { label: 'Content Templates', href: '/dashboard/templates', icon: FileText },
      { label: 'Bulk Generate',     href: '/dashboard/bulk',      icon: Zap,        badge: 'Pro' },
    ]
  },
  {
    label: 'Analyze',
    items: [
      { label: 'SEO Analytics',      href: '/dashboard/analytics',   icon: BarChart2 },
      { label: 'Keyword Tracker',    href: '/dashboard/keywords',    icon: Clock },
      { label: 'Competitive Analysis',href: '/dashboard/competitors',icon: TrendingDown, badge: 'Pro' },
      { label: 'Clusters',           href: '/dashboard/clusters',    icon: Network },
    ]
  },
  {
    label: 'Site',
    items: [
      { label: 'Site Audit',    href: '/dashboard/audit',   icon: Globe },
      { label: 'Publish',       href: '/dashboard/publish', icon: Upload },
      { label: 'Landing Pages', href: '/dashboard/pages',   icon: MonitorDot, badge: 'Pro' },
    ]
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Projects',        href: '/dashboard/projects',     icon: FolderOpen },
      { label: 'Article Library', href: '/dashboard/library',      icon: Library },
      { label: 'Integrations',    href: '/dashboard/integrations', icon: Plug },
      { label: 'Settings',        href: '/dashboard/settings',     icon: Settings },
    ]
  },
];

function RankFlowLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <polyline points="1,18 7,10 12,14 21,3" stroke="#4F7CFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16,3 21,3 21,8" stroke="#4F7CFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: '16px', fontWeight: '500', color: '#E8EDF8' }}>
        Rank<span style={{ color: '#4F7CFF' }}>Flow</span>
      </span>
    </div>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside style={{
      width: '218px', flexShrink: 0, background: '#213354',
      borderRight: '1px solid #2A3F6A', display: 'flex',
      flexDirection: 'column', height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #2A3F6A' }}>
        <RankFlowLogo />
      </div>

      {/* Workspace */}
      <div style={{
        margin: '10px 10px 0', background: '#1C2B4A', border: '1px solid #2A3F6A',
        borderRadius: '8px', padding: '7px 10px', fontSize: '12px', color: '#7B8DB0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
      }}>
        My Workspace <span style={{ fontSize: '10px' }}>▾</span>
      </div>

      {/* Search */}
      <div style={{
        margin: '8px 10px 0', background: '#1C2B4A', border: '1px solid #2A3F6A',
        borderRadius: '8px', padding: '7px 10px', fontSize: '12px', color: '#7B8DB0',
        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'text',
      }}>
        <span style={{ fontSize: '13px' }}>⌕</span>
        <span style={{ flex: 1 }}>Search...</span>
        <kbd style={{
          fontSize: '10px', color: '#7B8DB0', background: '#2A3F6A',
          padding: '2px 5px', borderRadius: '4px', fontFamily: 'monospace',
        }}>⌘K</kbd>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {nav.map((section, i) => (
          <div key={section.label}>
            {i > 0 && <div style={{ height: '1px', background: '#2A3F6A', margin: '4px 12px' }} />}
            <p style={{
              fontSize: '10px', fontWeight: '500', letterSpacing: '0.09em',
              textTransform: 'uppercase', color: '#2A3F6A', padding: '10px 16px 3px',
            }}>
              {section.label}
            </p>
            {section.items.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '9px',
                    padding: '7px 16px', fontSize: '12.5px', cursor: 'pointer',
                    color: active ? '#E8EDF8' : '#7B8DB0',
                    background: active ? 'rgba(79,124,255,0.12)' : 'transparent',
                    position: 'relative',
                    borderLeft: active ? '3px solid #4F7CFF' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}>
                    <Icon size={14} color={active ? '#4F7CFF' : '#7B8DB0'} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge === 'New' && (
                      <span style={{
                        fontSize: '10px', fontWeight: '500', padding: '2px 6px',
                        borderRadius: '20px', background: 'rgba(79,124,255,0.2)', color: '#4F7CFF',
                      }}>New</span>
                    )}
                    {item.badge === 'Pro' && (
                      <span style={{
                        fontSize: '10px', fontWeight: '500', padding: '2px 6px',
                        borderRadius: '20px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                      }}>Pro</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px', borderTop: '1px solid #2A3F6A' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '6px 8px', borderRadius: '8px', cursor: 'pointer',
        }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #4F7CFF, #1DB8A0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: '500', color: '#fff',
          }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: '500', color: '#E8EDF8', margin: 0 }}>
              {user?.fullName ?? 'My Account'}
            </p>
            <p style={{ fontSize: '11px', color: '#7B8DB0', margin: 0 }}>Pro Plan</p>
          </div>
          <span style={{ color: '#7B8DB0', fontSize: '15px' }}>···</span>
        </div>
      </div>
    </aside>
  );
}