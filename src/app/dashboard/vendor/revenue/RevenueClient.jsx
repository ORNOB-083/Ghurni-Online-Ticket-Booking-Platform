'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Ticket, ShoppingBag,
    DollarSign, Loader2, ArrowRight
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LineChart,
    Line, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function RevenueClient({ user }) {
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
            const s = await authClient.getSession();
            const token = s?.data?.session?.token;
            const headers = { authorization: `Bearer ${token}` };

            const [ticketsRes, bookingsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets?vendorEmail=${user?.email}&perPage=100`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/bookings?vendorEmail=${user?.email}`, { headers }),
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

    const paidBookings = bookings.filter(b => b.status === 'paid');
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.price * b.quantity), 0);
    const totalSold = paidBookings.reduce((sum, b) => sum + b.quantity, 0);

    const revenueByTicket = tickets.map(t => {
        const ticketBookings = paidBookings.filter(b => b.ticketId === t._id?.toString());
        const revenue = ticketBookings.reduce((sum, b) => sum + (b.price * b.quantity), 0);
        return {
            name: t.ticketTitle?.length > 15 ? t.ticketTitle.substring(0, 15) + '...' : t.ticketTitle,
            revenue,
            sold: ticketBookings.reduce((sum, b) => sum + b.quantity, 0),
        };
    }).filter(t => t.revenue > 0);

    const statusData = [
        { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
        { name: 'Accepted', value: bookings.filter(b => b.status === 'accepted').length, color: '#10b981' },
        { name: 'Paid', value: paidBookings.length, color: '#8b5cf6' },
        { name: 'Rejected', value: bookings.filter(b => b.status === 'rejected').length, color: '#ef4444' },
    ].filter(d => d.value > 0);

    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayLabel = date.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' });
        const dayBookings = paidBookings.filter(b => {
            const bDate = new Date(b.updatedAt || b.createdAt);
            return bDate.toDateString() === date.toDateString();
        });
        const revenue = dayBookings.reduce((sum, b) => sum + (b.price * b.quantity), 0);
        return { day: dayLabel, revenue };
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your earnings and ticket performance</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800' },
                    { label: 'Tickets Sold', value: totalSold, icon: ShoppingBag, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800' },
                    { label: 'Total Tickets', value: tickets.length, icon: Ticket, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-100 dark:border-cyan-800' },
                    { label: 'Total Bookings', value: bookings.length, icon: DollarSign, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800' },
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
                        Last 7 Days Revenue
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={last7Days}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1d24',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}
                                formatter={(value) => [`৳${value}`, 'Revenue']}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                dot={{ fill: '#10b981', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Booking Status Breakdown
                    </h2>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, i) => (
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
                                <Legend iconType="circle" iconSize={8} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[220px]">
                            <p className="text-sm text-gray-400">No booking data yet</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {revenueByTicket.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Revenue by Ticket
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={revenueByTicket} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1d24',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}
                                formatter={(value) => [`৳${value}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="url(#revenueGrad)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
}