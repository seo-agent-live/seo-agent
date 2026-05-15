import DashboardSidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1C2B4A' }}>
      <DashboardSidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}