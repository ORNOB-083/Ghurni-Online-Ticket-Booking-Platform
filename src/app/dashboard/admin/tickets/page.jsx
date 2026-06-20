import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ManageTicketsClient from './ManageTicketsClient';

export default async function ManageTicketsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return <ManageTicketsClient user={session.user} />;
}