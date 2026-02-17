'use client';

import React from 'react';
import { useNotifications } from '@/context/notification-context';
import { Bell, CheckCheck, Package, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const router = useRouter();

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Notifications</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">
                        Stay updated with real-time operational alerts and system signals.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <CheckCheck size={18} />
                        <span>Mark all as read</span>
                    </button>
                )}
            </div>

            {/* Stats / Feedback Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <Bell size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Signals</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{notifications.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Unread Alerts</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{unreadCount}</p>
                    </div>
                </div>
            </div>

            {/* Main List Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                        Inbox History
                    </h2>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    <AnimatePresence initial={false}>
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => {
                                const Icon = notif.type === 'SUCCESS' ? Package : notif.type === 'WARNING' ? AlertCircle : Bell;
                                const color = notif.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                    notif.type === 'WARNING' ? 'bg-amber-100 text-amber-600' :
                                        notif.type === 'ERROR' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600';

                                return (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={clsx(
                                            "p-8 flex flex-col md:flex-row gap-6 transition-all group relative",
                                            !notif.isRead ? "bg-blue-50/20 dark:bg-blue-900/5" : "hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                                        )}
                                    >
                                        {!notif.isRead && (
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-r-full" />
                                        )}

                                        <div className={clsx("w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform", color)}>
                                            <Icon size={24} />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className={clsx("text-lg", notif.isRead ? "text-gray-700 dark:text-gray-300 font-semibold" : "text-gray-900 dark:text-white font-black")}>
                                                        {notif.title}
                                                    </h3>
                                                    <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider", color)}>
                                                        {notif.type}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                    {new Date(notif.createdAt).toLocaleString([], { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
                                                {notif.message}
                                            </p>

                                            <div className="pt-4 flex items-center space-x-6">
                                                {!notif.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notif.id)}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                                    >
                                                        Mark Read
                                                    </button>
                                                )}
                                                {notif.link && (
                                                    <button
                                                        onClick={() => router.push(notif.link!)}
                                                        className="text-xs font-bold text-gray-900 dark:text-white flex items-center hover:underline"
                                                    >
                                                        <ExternalLink size={14} className="mr-1.5" />
                                                        View Source
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto opacity-50 border-4 border-dashed border-gray-200 dark:border-gray-700">
                                    <Bell size={40} className="text-gray-300" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">Your inbox is clear</p>
                                    <p className="text-sm text-gray-500 font-medium italic">New alerts will appear here as they are detected.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
