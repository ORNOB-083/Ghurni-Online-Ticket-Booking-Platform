import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function VendorLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect('/auth/signin');
  if (session.user?.role !== 'vendor') redirect('/unauthorized');

  return children;
}