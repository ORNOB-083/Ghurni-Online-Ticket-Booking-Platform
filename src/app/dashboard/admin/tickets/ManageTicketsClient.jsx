'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Ticket, Search, CheckCircle, XCircle,
  Clock3, Loader2, Bus, Train, Ship,
  Plane, ArrowRight, Eye, Trash2, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { verifyTicket, deleteTicket } from '@/lib/actions/tickets';

const VERIFY_CONFIG = {
  pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: Clock3 },
  approved: { label: 'Approved', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: XCircle },
};

const TRANSPORT_ICONS = { bus: Bus, train: Train, launch: Ship, plane: Plane };

export default function ManageTicketsClient() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const session = await authClient.getSession();
      const token = session?.data?.session?.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets?perPage=100`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTickets(Array.isArray(data.tickets) ? data.tickets : []);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (ticketId, verificationStatus) => {
    setActionLoading(ticketId + verificationStatus);
    try {
      const result = await verifyTicket(ticketId, verificationStatus);
      if (result?.acknowledged) {
        toast.success(`Ticket ${verificationStatus}!`);
        setTickets(prev =>
          prev.map(t => t._id === ticketId ? { ...t, verificationStatus } : t)
        );
      } else {
        toast.error('Action failed');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (ticketId) => {
    if (!confirm('Delete this ticket permanently?')) return;
    setActionLoading(ticketId + 'delete');
    try {
      const result = await deleteTicket(ticketId);
      if (result?.deletedCount || result?.acknowledged) {
        toast.success('Ticket deleted!');
        setTickets(prev => prev.filter(t => t._id !== ticketId));
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = tickets.filter(t => {
    const matchSearch = search
      ? t.ticketTitle?.toLowerCase().includes(search.toLowerCase()) ||
      t.from?.toLowerCase().includes(search.toLowerCase()) ||
      t.to?.toLowerCase().includes(search.toLowerCase()) ||
      t.vendorEmail?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchFilter = filter === 'all' ? true : t.verificationStatus === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: tickets.length,
    pending: tickets.filter(t => t.verificationStatus === 'pending').length,
    approved: tickets.filter(t => t.verificationStatus === 'approved').length,
    rejected: tickets.filter(t => t.verificationStatus === 'rejected').length,
  };

  return (
    <div className="p-6 pt-8 max-w-7xl mx-auto space-y-6 mt-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Tickets</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Review and approve tickets submitted by vendors
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
          { label: 'Approved', value: counts.approved, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Rejected', value: counts.rejected, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
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
            placeholder="Search by title, route or vendor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${filter === f
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
          <Ticket className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No tickets found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ticket</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Route</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vendor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((ticket, i) => {
                  const verify = VERIFY_CONFIG[ticket.verificationStatus] || VERIFY_CONFIG.pending;
                  const VerifyIcon = verify.icon;
                  const TransportIcon = TRANSPORT_ICONS[ticket.transportType] || Bus;

                  return (
                    <motion.tr
                      key={ticket._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                            {ticket.image ? (
                              <img src={ticket.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <TransportIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                              {ticket.ticketTitle}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <TransportIcon className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400 capitalize">{ticket.transportType}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{ticket.from}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-medium">{ticket.to}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[140px]">
                          {ticket.vendorEmail}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          ৳{ticket.price?.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${verify.bg} ${verify.border} border`}>
                          <VerifyIcon className={`w-3.5 h-3.5 ${verify.color}`} />
                          <span className={`text-xs font-semibold ${verify.color}`}>{verify.label}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tickets/${ticket._id}`}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {ticket.verificationStatus !== 'approved' && (
                            <button
                              onClick={() => handleVerify(ticket._id, 'approved')}
                              disabled={actionLoading === ticket._id + 'approved'}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-all disabled:opacity-50"
                            >
                              {actionLoading === ticket._id + 'approved' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              Approve
                            </button>
                          )}

                          {ticket.verificationStatus !== 'rejected' && (
                            <button
                              onClick={() => handleVerify(ticket._id, 'rejected')}
                              disabled={actionLoading === ticket._id + 'rejected'}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                              {actionLoading === ticket._id + 'rejected' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(ticket._id)}
                            disabled={actionLoading === ticket._id + 'delete'}
                            className="p-1.5 rounded-lg border border-red-100 dark:border-red-900/30 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                          >
                            {actionLoading === ticket._id + 'delete' ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
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