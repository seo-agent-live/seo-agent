import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}