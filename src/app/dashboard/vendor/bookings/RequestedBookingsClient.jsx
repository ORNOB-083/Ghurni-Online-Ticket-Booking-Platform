'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, CheckCircle, XCircle, Clock3,
    Loader2, ArrowRight, Users, Calendar,
    CreditCard, Search, Filter, Mail, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        icon: Clock3
    },
    accepted: {
        label: 'Accepted',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: CheckCircle
    },
    rejected: {
        label: 'Rejected',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: XCircle
    },
    paid: {
        label: 'Paid',
        color: 'text-violet-600 dark:text-violet-400',
        bg: 'bg-violet-50 dark:bg-violet-900/20',
        border: 'border-violet-200 dark:border-violet-800',
        icon: CreditCard
    },
};

export default function RequestedBookingsClient({ user }) {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/vendor/bookings?vendorEmail=${user?.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (bookingId, status) => {
        setActionLoading(bookingId + status);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            if (res.ok) {
                toast.success(`Booking ${status}!`);
                setBookings(prev =>
                    prev.map(b => b._id === bookingId ? { ...b, status } : b)
                );
            } else {
                toast.error('Action failed');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = bookings.filter(b => {
        const matchFilter = filter === 'all' ? true : b.status === filter;
        const matchSearch = search
            ? b.ticketTitle?.toLowerCase().includes(search.toLowerCase()) ||
            b.userName?.toLowerCase().includes(search.toLowerCase()) ||
            b.userEmail?.toLowerCase().includes(search.toLowerCase())
            : true;
        return matchFilter && matchSearch;
    });

    const counts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
        paid: bookings.filter(b => b.status === 'paid').length,
    };

    const totalRevenue = bookings
        .filter(b => b.status === 'paid')
        .reduce((sum, b) => sum + (b.price * b.quantity), 0);

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Requested Bookings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Manage booking requests from travellers
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total', value: counts.all, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    { label: 'Pending', value: counts.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Accepted', value: counts.accepted, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Revenue', value: `৳${totalRevenue.toLocaleString()}`, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} rounded-2xl p-4 border border-gray-100 dark:border-gray-800`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ticket or traveller..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'pending', 'accepted', 'rejected', 'paid'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${filter === f
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            {f} {f !== 'all' && counts[f] > 0 && `(${counts[f]})`}
                        </button>
                    ))}
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800"
                >
                    <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">No bookings found</h3>
                    <p className="text-sm text-gray-400">
                        {filter === 'all' ? 'No booking requests yet.' : `No ${filter} bookings.`}
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Traveller</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ticket</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Qty</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filtered.map((booking, i) => {
                                    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                                    const StatusIcon = status.icon;
                                    const total = booking.price * booking.quantity;

                                    return (
                                        <motion.tr
                                            key={booking._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                                                        <User className="w-4 h-4 text-indigo-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                                                            {booking.userName || 'Unknown'}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate max-w-[120px] flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {booking.userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                                                    {booking.ticketTitle}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                                    <span>{booking.from}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                    <span>{booking.to}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {booking.quantity}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                    ৳{total?.toLocaleString()}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>
                                                        {new Date(booking.createdAt).toLocaleDateString('en-BD', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border`}>
                                                    <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                                                    <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(booking._id, 'accepted')}
                                                                disabled={actionLoading === booking._id + 'accepted'}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-all disabled:opacity-50"
                                                            >
                                                                {actionLoading === booking._id + 'accepted' ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="w-3 h-3" />
                                                                )}
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(booking._id, 'rejected')}
                                                                disabled={actionLoading === booking._id + 'rejected'}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                                                            >
                                                                {actionLoading === booking._id + 'rejected' ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="w-3 h-3" />
                                                                )}
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {booking.status === 'accepted' && (
                                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                            Awaiting payment
                                                        </span>
                                                    )}

                                                    {booking.status === 'paid' && (
                                                        <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                                                            ✓ Completed
                                                        </span>
                                                    )}

                                                    {booking.status === 'rejected' && (
                                                        <span className="text-xs text-red-400 font-medium">
                                                            Declined
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}