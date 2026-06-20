'use client';

import { motion } from 'framer-motion';
import {
    User, Mail, Shield, Calendar,
    CheckCircle, Camera
} from 'lucide-react';

export default function UserProfile({ user }) {
    const joinDate = new Date(user?.createdAt).toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    My Profile
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    View your personal information
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
            >
                <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 relative">
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }}
                    />
                </div>

                <div className="px-6 pb-6">
                    <div className="relative -mt-12 mb-4 inline-block">
                        <img
                            src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=96`}
                            alt={user?.name}
                            className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#1a1d24] object-cover shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                            <Camera className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {user?.name}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 capitalize">
                                {user?.role || 'user'}
                            </span>
                        </div>

                        {user?.emailVerified && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Verified</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                {[
                    {
                        icon: User,
                        label: 'Full Name',
                        value: user?.name,
                        color: 'text-indigo-500',
                        bg: 'bg-indigo-50 dark:bg-indigo-900/20'
                    },
                    {
                        icon: Mail,
                        label: 'Email Address',
                        value: user?.email,
                        color: 'text-violet-500',
                        bg: 'bg-violet-50 dark:bg-violet-900/20'
                    },
                    {
                        icon: Shield,
                        label: 'Account Role',
                        value: user?.role || 'user',
                        color: 'text-cyan-500',
                        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
                        capitalize: true
                    },
                    {
                        icon: Calendar,
                        label: 'Member Since',
                        value: joinDate,
                        color: 'text-emerald-500',
                        bg: 'bg-emerald-50 dark:bg-emerald-900/20'
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4"
                    >
                        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{item.label}</p>
                            <p className={`text-sm font-semibold text-gray-900 dark:text-gray-100 truncate ${item.capitalize ? 'capitalize' : ''}`}>
                                {item.value || '—'}
                            </p>
                        </div>
                    </div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Account Status
                </h3>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Active Account</span>
                    </div>
                    {user?.emailVerified && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Email Verified</span>
                        </div>
                    )}
                    {user?.image && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
                            <Camera className="w-3.5 h-3.5 text-violet-500" />
                            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Profile Photo Set</span>
                        </div>
                    )}
                </div>
            </motion.div>

        </div>
    );
}