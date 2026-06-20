import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import AddTicketClient from './AddTicketClient';

export default async function AddTicketPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <AddTicketClient user={session?.user} />;
}