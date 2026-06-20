'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Ticket, BookOpen, DollarSign,
    Clock3, CheckCircle, XCircle, CreditCard,
    Plus, ArrowRight, Loader2, Store,
    AlertCircle
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Clock3 },
    accepted: { label: 'Accepted', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: XCircle },
    paid: { label: 'Paid', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', icon: CreditCard },
};

const VERIFY_CONFIG = {
    pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    approved: { label: 'Approved', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
};

export default function VendorDashboardClient({ user: serverUser }) {
    const { data: session } = useSession();
    const user = session?.user || serverUser;
    const [tickets, setTickets] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            const headers = { authorization: `Bearer ${token}` };

            const [ticketsRes, bookingsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets?vendorEmail=${user?.email}&perPage=100`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings?vendorEmail=${user?.email}`, { headers }),
            ]);

            const ticketsData = await ticketsRes.json();
            const bookingsData = await bookingsRes.json();

            setTickets(Array.isArray(ticketsData.tickets) ? ticketsData.tickets : []);
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const totalRevenue = bookings
        .filter(b => b.status === 'paid')
        .reduce((sum, b) => sum + (b.price * b.quantity), 0);

    const stats = [
        {
            label: 'Total Tickets',
            value: tickets.length,
            icon: Ticket,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            border: 'border-indigo-100 dark:border-indigo-800',
        },
        {
            label: 'Total Bookings',
            value: bookings.length,
            icon: BookOpen,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800',
        },
        {
            label: 'Pending Approval',
            value: tickets.filter(t => t.status === 'pending').length,
            icon: AlertCircle,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-100 dark:border-amber-800',
        },
        {
            label: 'Total Revenue',
            value: `৳${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            border: 'border-violet-100 dark:border-violet-800',
        },
    ];

    const recentBookings = bookings.slice(0, 4);
    const recentTickets = tickets.slice(0, 4);

    const bookingStatusCounts = {
        pending: bookings.filter(b => b.status === 'pending').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
        paid: bookings.filter(b => b.status === 'paid').length,
    };

    const maxCount = Math.max(...Object.values(bookingStatusCounts), 1);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full py-32">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white"
            >
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                />
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Store className="w-5 h-5 text-white/80" />
                            <span className="text-white/80 text-sm font-medium">Vendor Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p className="text-white/70 text-sm mt-1">Here&apos;s what&apos;s happening with your tickets today.</p>
                    </div>
                    <Link
                        href="/dashboard/vendor/add-ticket"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Ticket
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border ${stat.border} shadow-sm`}
                    >
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">Booking Status Overview</h2>
                    <div className="space-y-4">
                        {Object.entries(bookingStatusCounts).map(([status, count]) => {
                            const config = STATUS_CONFIG[status];
                            const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            return (
                                <div key={status}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{count}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${width}%` }}
                                            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${config.bg}`}
                                            style={{ minWidth: count > 0 ? '8px' : '0' }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {bookings.length === 0 && (
                        <p className="text-xs text-gray-400 text-center mt-4">No bookings yet</p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Bookings</h2>
                        <Link
                            href="/dashboard/vendor/bookings"
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="text-center py-8">
                            <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">No bookings yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((booking, i) => {
                                const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                                const StatusIcon = config.icon;
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                            <StatusIcon className={`w-4 h-4 ${config.color}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                {booking.ticketTitle}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{booking.userName || booking.userEmail}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                ৳{(booking.price * booking.quantity)?.toLocaleString()}
                                            </p>
                                            <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">My Recent Tickets</h2>
                    <Link
                        href="/dashboard/vendor/my-tickets"
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {recentTickets.length === 0 ? (
                    <div className="text-center py-8">
                        <Ticket className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 mb-3">No tickets added yet</p>
                        <Link
                            href="/dashboard/vendor/add-ticket"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Your First Ticket
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left pb-3 font-medium">Ticket</th>
                                    <th className="text-left pb-3 font-medium">Route</th>
                                    <th className="text-left pb-3 font-medium">Price</th>
                                    <th className="text-left pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {recentTickets.map((ticket, i) => {
                                    const verify = VERIFY_CONFIG[ticket.status] || VERIFY_CONFIG.pending;
                                    return (
                                        <tr key={i}>
                                            <td className="py-3 pr-4">
                                                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[140px]">
                                                    {ticket.ticketTitle}
                                                </p>
                                                <p className="text-xs text-gray-400">{ticket.transportType}</p>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {ticket.from} → {ticket.to}
                                                </p>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">৳{ticket.price?.toLocaleString()}</p>
                                            </td>
                                            <td className="py-3">
                                                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${verify.bg} ${verify.color}`}>
                                                    {verify.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

        </div>
    );
}