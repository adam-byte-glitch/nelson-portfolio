import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin();
  if (!ok) redirect('/admin/login');
  return <>{children}</>;
}
