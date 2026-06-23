'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
    Bus, Train, Ship, Plane, ArrowRight,
    Tag, Users, Ticket, Clock,
    MapPin, Sparkles
} from 'lucide-react';

const TRANSPORT_ICONS = { bus: Bus, train: Train, launch: Ship, plane: Plane };
const TRANSPORT_COLORS = {
    bus: 'from-emerald-500 to-teal-500',
    train: 'from-blue-500 to-indigo-500',
    launch: 'from-cyan-500 to-blue-500',
    plane: 'from-violet-500 to-purple-500',
};
const TRANSPORT_LABELS = { bus: 'Bus', train: 'Train', launch: 'Launch', plane: 'Plane' };

function TicketCard({ ticket, index }) {
    const TransportIcon = TRANSPORT_ICONS[ticket.transportType] || Bus;
    const transportColor = TRANSPORT_COLORS[ticket.transportType] || 'from-indigo-500 to-violet-500';
    const transportLabel = TRANSPORT_LABELS[ticket.transportType] || ticket.transportType;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
            }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500"
        >
            <div className={`absolute -inset-1 bg-gradient-to-r ${transportColor} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`} />

            <div className="relative h-44 overflow-hidden">
                {ticket.image ? (
                    <img
                        src={ticket.image}
                        alt={ticket.ticketTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${transportColor} flex items-center justify-center`}>
                        <TransportIcon className="w-16 h-16 text-white/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${transportColor} text-white text-xs font-bold shadow-lg border border-white/10 backdrop-blur-sm`}>
                    <TransportIcon className="w-3 h-3" />
                    {transportLabel}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    New
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                        <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="text-white text-xs font-semibold truncate">{ticket.from}</span>
                        <ArrowRight className="w-3 h-3 text-white/50 flex-shrink-0" />
                        <span className="text-white text-xs font-semibold truncate">{ticket.to}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 relative z-10">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {ticket.ticketTitle}
                </h3>
                <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{ticket.quantity} seats</span>
                    </div>
                    {ticket.departureDate && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{new Date(ticket.departureDate).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</span>
                        </div>
                    )}
                </div>

                {ticket.perks?.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mb-3">
                        {ticket.perks.slice(0, 3).map((perk, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium border border-indigo-100 dark:border-indigo-800"
                            >
                                <Tag className="w-2.5 h-2.5" />
                                {perk}
                            </span>
                        ))}
                        {ticket.perks.length > 3 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                +{ticket.perks.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400">per ticket</p>
                        <p className={`text-xl font-bold bg-gradient-to-r ${transportColor} bg-clip-text text-transparent`}>
                            ৳{ticket.price?.toLocaleString()}
                        </p>
                    </div>
                    <Link
                        href={`/tickets/${ticket._id}`}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${transportColor} text-white text-xs font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200`}
                    >
                        See Details
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${transportColor} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="h-44 bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/2 animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-6 w-12 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                    <div className="h-6 w-12 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-1">
                        <div className="h-3 w-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default function LatestTickets() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useRef(null);

    // Parallax effect for background blobs
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });
    const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

    const fetchLatest = useCallback(async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tickets?verificationStatus=approved&perPage=8`
            );
            const data = await res.json();
            setTickets(Array.isArray(data.tickets) ? data.tickets : []);
        } catch {
            console.error('Failed to fetch latest tickets');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLatest();
    }, [fetchLatest]);

    if (!isLoading && tickets.length === 0) return null;

    return (
        <section ref={sectionRef} className="relative py-24 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-[120px]"
                />
                <motion.div
                    style={{ y: y2 }}
                    className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
                >
                    <div>
                        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                            Just Added
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                            Latest{' '}
                            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                                Tickets
                            </span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base max-w-lg">
                            Fresh routes just listed — grab your seat before they fill up.
                        </p>
                    </div>

                    <Link
                        href="/tickets"
                        className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200"
                    >
                        Browse All Tickets
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                        {tickets.map((ticket, index) => (
                            <TicketCard key={ticket._id} ticket={ticket} index={index} />
                        ))}
                    </motion.div>
                )}

                {!isLoading && tickets.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center mt-12"
                    >
                        <Link
                            href="/tickets"
                            className="group flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 transition-all duration-200"
                        >
                            <Ticket className="w-4 h-4" />
                            See All Available Tickets
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}