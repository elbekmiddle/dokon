import  {AdminTabs}  from '@/components/admin/ui/tabs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== 'admin') {
    redirect('/auth/access-denied');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel Boshqaruvi</h1>
      <AdminTabs />
    </div>
  );
}