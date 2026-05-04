import DashboardSidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0d0d14]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}