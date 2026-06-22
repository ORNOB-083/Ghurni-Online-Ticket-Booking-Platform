import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import RevenueClient from './RevenueClient';

export default async function RevenuePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <RevenueClient user={session.user} />;
}