import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import VendorDashboardClient from './VendorDashboardClient';

export default async function VendorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <VendorDashboardClient user={session.user} />;
}