import DashboardSidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0D1117',
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      fontFamily: "'Geist', sans-serif",
    }}>
      <style>{`@import url('https://fonts.cdnfonts.com/css/geist');`}</style>
      <DashboardSidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
