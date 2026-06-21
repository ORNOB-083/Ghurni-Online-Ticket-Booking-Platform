import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import RequestedBookingsClient from './RequestedBookingsClient';

export default async function RequestedBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return <RequestedBookingsClient user={session.user} />;
}