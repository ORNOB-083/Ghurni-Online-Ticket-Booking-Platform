'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Ticket, CreditCard, Clock3, CheckCircle,
    XCircle, ArrowRight, Loader2, TrendingUp,
    MapPin, Calendar
} from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import {
    PieChart, Pie, Cell, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const STATUS_COLORS = {
    pending: '#f59e0b',
    accepted: '#10b981',
    rejected: '#ef4444',
    paid: '#8b5cf6',
};

export default function UserOverviewClient({ user: serverUser }) {
    const { data: session } = useSession();
    const user = session?.user || serverUser;

    const [bookings, setBookings] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const s = await authClient.getSession();
            const token = s?.data?.session?.token;
            const headers = { authorization: `Bearer ${token}` };

            const [bookingsRes, txRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings?userId=${user?.id}`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions?userId=${user?.id}`, { headers }),
            ]);

            const bookingsData = await bookingsRes.json();
            const txData = await txRes.json();

            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
            setTransactions(Array.isArray(txData) ? txData : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        paid: bookings.filter(b => b.status === 'paid').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    const pieData = [
        { name: 'Pending', value: stats.pending, color: STATUS_COLORS.pending },
        { name: 'Accepted', value: stats.accepted, color: STATUS_COLORS.accepted },
        { name: 'Paid', value: stats.paid, color: STATUS_COLORS.paid },
        { name: 'Rejected', value: stats.rejected, color: STATUS_COLORS.rejected },
    ].filter(d => d.value > 0);

    const recentBookings = bookings.slice(0, 3);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full py-32">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 rounded-2xl p-6 text-white"
            >
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                />
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-white/70 text-sm font-medium mb-1">Welcome back 👋</p>
                        <h1 className="text-2xl font-bold">{user?.name}</h1>
                        <p className="text-white/60 text-sm mt-1">Here&apos;s your travel summary</p>
                    </div>
                    <Link
                        href="/tickets"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
                    >
                        Browse Tickets
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Bookings', value: stats.total, icon: Ticket, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800' },
                    { label: 'Pending', value: stats.pending, icon: Clock3, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800' },
                    { label: 'Paid', value: stats.paid, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800' },
                    { label: 'Total Spent', value: `৳${totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800' },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border ${stat.border} shadow-sm`}>
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
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Booking Status Distribution
                    </h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1d24',
                                        border: '1px solid #374151',
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[220px]">
                            <p className="text-sm text-gray-400">No booking data yet</p>
                        </div>
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
                            href="/dashboard/user/booked-tickets"
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="text-center py-8">
                            <Ticket className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">No bookings yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((booking, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                                        <Ticket className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {booking.ticketTitle}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                            <MapPin className="w-3 h-3" />
                                            <span>{booking.from} → {booking.to}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${booking.status === 'paid' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' :
                                        booking.status === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                                            booking.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' :
                                                'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}