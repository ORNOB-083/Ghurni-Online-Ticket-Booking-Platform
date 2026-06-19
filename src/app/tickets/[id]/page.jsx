import { notFound } from 'next/navigation';
import TicketDetailsClient from './TicketDetailsClient';

export default async function TicketDetailsPage({ params }) {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) return notFound();

    const ticket = await res.json();
    if (!ticket) return notFound();

    return <TicketDetailsClient ticket={ticket} />;
}