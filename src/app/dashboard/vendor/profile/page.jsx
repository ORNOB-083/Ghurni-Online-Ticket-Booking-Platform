import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import VendorProfile from './VendorProfile';

export default async function VendorProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <VendorProfile user={session.user} />;
}