import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import BookedTicketsClient from './BookedTicketsClient';

export default async function BookedTicketsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <BookedTicketsClient user={session.user} />;
}