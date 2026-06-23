'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users, Ticket, ShoppingBag, TrendingUp,
    Store, CreditCard, Loader2, ArrowRight,
    CheckCircle, Clock3, Shield
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';

export default function AdminOverviewClient({ user }) {
    const [stats, setStats] = useState(null);
    const [tickets, setTickets] = useState([]);
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

            const [statsRes, ticketsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets?perPage=100`, { headers }),
            ]);

            const statsData = await statsRes.json();
            const ticketsData = await ticketsRes.json();

            setStats(statsData);
            setTickets(Array.isArray(ticketsData.tickets) ? ticketsData.tickets : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const ticketsByType = ['bus', 'train', 'launch', 'plane'].map(type => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: tickets.filter(t => t.transportType === type).length,
    }));

    const verificationData = [
        { name: 'Pending', value: tickets.filter(t => t.verificationStatus === 'pending').length, color: '#f59e0b' },
        { name: 'Approved', value: tickets.filter(t => t.verificationStatus === 'approved').length, color: '#10b981' },
        { name: 'Rejected', value: tickets.filter(t => t.verificationStatus === 'rejected').length, color: '#ef4444' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 rounded-2xl p-6 text-white"
            >
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                />
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-white/80" />
                            <span className="text-white/80 text-sm font-medium">Admin Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                        <p className="text-white/60 text-sm mt-1">Platform overview at a glance</p>
                    </div>
                    <Link
                        href="/dashboard/admin/tickets"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
                    >
                        Manage Tickets
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {[
                    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800', href: '/dashboard/admin/users' },
                    { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: Store, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', href: '/dashboard/admin/users' },
                    { label: 'Total Tickets', value: stats?.totalTickets || 0, icon: Ticket, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-100 dark:border-cyan-800', href: '/dashboard/admin/tickets' },
                    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: ShoppingBag, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', href: '/dashboard/admin/tickets' },
                    { label: 'Total Revenue', value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800', href: '/dashboard/admin/tickets' },
                    { label: 'Transactions', value: stats?.totalTransactions || 0, icon: CreditCard, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800', href: '/dashboard/admin/tickets' },
                ].map((stat, i) => (
                    <Link key={i} href={stat.href}>
                        <div className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-all cursor-pointer`}>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </Link>
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
                        Tickets by Transport Type
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={ticketsByType}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                            <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1d24',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="count" fill="url(#adminGrad)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#f97316" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Ticket Verification Status
                    </h2>
                    <div className="space-y-4 mt-6">
                        {verificationData.map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.name}</span>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.value}</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: tickets.length > 0 ? `${(item.value / tickets.length) * 100}%` : '0%' }}
                                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2">
                        <Link
                            href="/dashboard/admin/tickets"
                            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Review Tickets
                        </Link>
                        <Link
                            href="/dashboard/admin/users"
                            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                        >
                            <Users className="w-3.5 h-3.5" />
                            Manage Users
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}