import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import MyTicketsClient from './MyTicketsClient';

export default async function MyTicketsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return <MyTicketsClient user={session.user} />;
}