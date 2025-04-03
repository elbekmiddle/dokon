import { getAdminStats } from '@/lib/actions/admin';
import DashboardCards from '@/components/admin/DashboardCard';

export default async function DashboardPage() {
  const stats = await getAdminStats();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <DashboardCards stats={stats} />
      
      {/* Recent activity, charts, etc. */}
    </div>
  );
}