import { readContent } from '@/lib/content';
import AdminClient from './ui/AdminClient';

export default async function AdminPage() {
  const content = await readContent();
  return <AdminClient initial={content} />;
}
