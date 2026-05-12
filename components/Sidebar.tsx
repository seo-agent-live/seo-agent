'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  LayoutDashboard, PenLine, Users, FileText, Zap,
  LineChart, Clock, TrendingDown, Network, Globe, Upload,
  MonitorDot, FolderOpen, Library, Plug, Settings, Star
} from 'lucide-react';

const nav = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/dashboard',             icon: LayoutDashboard },
      { label: 'Quick Start',href: '/dashboard/quick-start', icon: Star },
    ]
  },
  {
    label: 'Create',
    items: [
      { label: 'AI Writer',          href: '/dashboard/writer',    icon: PenLine,      badge: 'New' },
      { label: 'Research',           href: '/dashboard/research',  icon: Users },
      { label: 'Content Templates',  href: '/dashboard/templates', icon: FileText },
      { label: 'Bulk Generate',      href: '/dashboard/bulk',      icon: Zap,          badge: 'Pro' },
    ]
  },
  {
    label: 'Analyze',
    items: [
      { label: 'SEO Analytics',      href: '/dashboard/analytics',   icon: LineChart },
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

function ScaleRankLogo() {
  return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)' }}>
      {/* Abstract upward bars — like a ranking/chart going up */}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="10" width="3.5" height="7" rx="1" fill="white" fillOpacity="0.9" />
        <rect x="7.25" y="6" width="3.5" height="11" rx="1" fill="white" fillOpacity="0.9" />
        <rect x="13.5" y="1" width="3.5" height="16" rx="1" fill="white" fillOpacity="0.9" />
        {/* Small arrow tip on tallest bar */}
        <path d="M15.25 0L17.5 2.5H13L15.25 0Z" fill="white" fillOpacity="0.7" />
      </svg>
      {/* Subtle shine */}
      <div className="absolute inset-0 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
    </div>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-60 shrink-0 bg-[#0d0d14] border-r border-white/[0.06] flex flex-col h-screen">

      {/* Logo */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 mb-3">
          <ScaleRankLogo />
          <div>
            <span className="text-sm font-bold text-white/90 tracking-tight">ScaleRank</span>
            <span className="block text-[10px] text-white/30 leading-none -mt-0.5">SEO Platform</span>
          </div>
        </div>
        <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] transition-colors">
          <span className="text-xs font-medium text-white/50">My Workspace</span>
          <span className="text-white/30 text-xs">▾</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-1.5 cursor-text">
          <span className="text-white/25 text-sm">⌕</span>
          <span className="text-xs text-white/25 flex-1">Search...</span>
          <kbd className="text-[10px] text-white/20 bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-none">
        {nav.map((section, i) => (
          <div key={section.label} className={i > 0 ? 'mt-1' : ''}>
            {i > 0 && <div className="h-px bg-white/[0.05] mx-3 my-2" />}
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-4 py-2">
              {section.label}
            </p>
            {section.items.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`relative flex items-center gap-2.5 px-3 py-1.5 mx-1.5 rounded-lg transition-colors
                    ${active ? 'bg-indigo-500/15' : 'hover:bg-white/[0.05]'}`}>
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                      style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
                  )}
                  <Icon size={14} className={active ? 'text-indigo-400' : 'text-white/40'} />
                  <span className={`text-[13px] flex-1 ${active ? 'text-white/90 font-medium' : 'text-white/50'}`}>
                    {item.label}
                  </span>
                  {item.badge === 'New' && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300">
                      New
                    </span>
                  )}
                  {item.badge === 'Pro' && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-400">
                      Pro
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/80 truncate">{user?.fullName ?? 'My Account'}</p>
            <p className="text-[11px] text-white/30">Pro Plan</p>
          </div>
          <span className="text-white/20 text-sm">···</span>
        </div>
      </div>
    </aside>
  );
}