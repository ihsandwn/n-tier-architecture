'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useSidebar } from '@/context/sidebar-context';
import { useNotifications } from '@/context/notification-context';
import {
    Bell,
    Search,
    Menu,
    User,
    Settings,
    LogOut,
    X,
    Package,
    AlertCircle,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Mock Search targets (simulating global search indexing)
const SEARCH_TARGETS = [
    { name: 'Dashboard Overview', href: '/dashboard' },
    { name: 'Analytics Dashboard', href: '/dashboard/analytics' },
    { name: 'User Management', href: '/dashboard/users' },
    { name: 'Security Settings', href: '/dashboard/settings' },
    { name: 'Warehouse Operations', href: '/dashboard/warehouses' },
    { name: 'Inventory Control', href: '/dashboard/inventory' },
    { name: 'Role Management', href: '/dashboard/roles' },
    { name: 'Fleet Tracker', href: '/dashboard/fleet' },
];

export default function DashboardNavbar() {
    const { user, logout } = useAuth();
    const { isCollapsed, toggleMobileSidebar } = useSidebar();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const router = useRouter();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof SEARCH_TARGETS>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Simple reactive search filtering
    useEffect(() => {
        if (searchQuery.length > 0) {
            setSearchResults(SEARCH_TARGETS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return (
        <header
            className={clsx(
                "h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 fixed top-0 right-0 left-0 z-30 transition-all duration-300 ml-0",
                isCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
            )}
        >
            <div className="h-full px-6 flex items-center justify-between">
                {/* Left Section: Mobile Toggle & Global Search */}
                <div className="flex items-center flex-1 max-w-xl">
                    <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden p-2 mr-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div ref={searchRef} className="relative w-full hidden md:block">
                        <div className={clsx(
                            "flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 w-full transition-all border border-transparent rounded-xl",
                            isSearchFocused && "bg-white dark:bg-gray-900 ring-4 ring-blue-500/5 border-blue-500/30 shadow-sm"
                        )}>
                            <Search className={clsx("w-4 h-4 transition-colors shrink-0", isSearchFocused ? "text-blue-500" : "text-gray-400")} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                            />
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setSearchQuery('')}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={14} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {isSearchFocused && searchQuery.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-0 right-0 mt-3 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 overflow-hidden z-50 ring-1 ring-black/5"
                                >
                                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-800 mb-1">Quick results</p>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {searchResults.length > 0 ? (
                                            searchResults.map(result => (
                                                <button
                                                    key={result.href}
                                                    onClick={() => {
                                                        router.push(result.href);
                                                        setIsSearchFocused(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 rounded-xl transition-all group"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                                                            <Search size={14} className="text-gray-400 group-hover:text-blue-500" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">{result.name}</span>
                                                    </div>
                                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-10 text-center space-y-2">
                                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                                    <SearchX className="text-gray-300 w-6 h-6" />
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">No matches found for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Section: Alerts & Account */}
                <div className="flex items-center space-x-1 md:space-x-3">
                    {/* Alerts/Notifications Dropdown */}
                    <div ref={notifRef} className="relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={clsx(
                                "relative p-2.5 rounded-xl transition-all group",
                                isNotifOpen
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                            )}
                        >
                            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 flex min-w-[10px] h-2.5 px-1 items-center justify-center bg-red-500 text-[8px] font-bold text-white rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
                                >
                                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Alerts</h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{unreadCount} unread notifications</p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => {
                                                const Icon = notif.type === 'SUCCESS' ? Package : notif.type === 'WARNING' ? AlertCircle : Bell;
                                                const color = notif.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                                    notif.type === 'WARNING' ? 'bg-amber-100 text-amber-600' :
                                                        notif.type === 'ERROR' ? 'bg-red-100 text-red-600' :
                                                            'bg-blue-100 text-blue-600';

                                                return (
                                                    <button
                                                        key={notif.id}
                                                        onClick={() => {
                                                            if (!notif.isRead) markAsRead(notif.id);
                                                            if (notif.link) {
                                                                router.push(notif.link);
                                                                setIsNotifOpen(false);
                                                            }
                                                        }}
                                                        className={clsx(
                                                            "w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-all flex gap-4 items-start group",
                                                            !notif.isRead && "bg-blue-50/30 dark:bg-blue-900/5"
                                                        )}
                                                    >
                                                        <div className={clsx("p-2 rounded-xl mt-1 shrink-0 shadow-sm transition-transform group-hover:scale-110", color)}>
                                                            <Icon size={18} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <p className={clsx("text-sm leading-tight", notif.isRead ? "text-gray-600 dark:text-gray-400 font-medium" : "text-gray-900 dark:text-white font-bold")}>{notif.title}</p>
                                                                <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap ml-2 uppercase">
                                                                    {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="px-5 py-20 text-center space-y-2">
                                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto opacity-50">
                                                    <Bell className="text-gray-400 w-6 h-6" />
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">No alerts at the moment</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => { setIsNotifOpen(false); router.push('/dashboard/notifications'); }}
                                        className="w-full py-4 text-xs font-bold text-center text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-gray-50/10 border-t dark:border-gray-800"
                                    >
                                        View Notifications Inbox
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Account Menu Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className={clsx(
                                "flex items-center space-x-2 p-1 pl-1 pr-1 md:pr-4 rounded-2xl transition-all",
                                isProfileOpen ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white dark:ring-gray-900 overflow-hidden relative group">
                                <span className="relative z-10">{user?.email?.[0].toUpperCase() || 'U'}</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate max-w-[140px] leading-none mb-1">{user?.email}</p>
                                <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded leading-none">{user?.roles?.[0] || 'Member'}</span>
                            </div>
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
                                >
                                    {/* Mobile Profile Peek */}
                                    <div className="px-4 py-4 lg:hidden border-b border-gray-50 dark:border-gray-800 mb-2 bg-gray-50/30 dark:bg-gray-800/20 rounded-xl">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                                        <p className="text-[10px] text-blue-600 font-bold uppercase mt-0.5">{user?.roles?.[0]}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <button
                                            onClick={() => { router.push('/dashboard/settings'); setIsProfileOpen(false); }}
                                            className="w-full flex items-center px-3 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all font-semibold group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                                <Settings className="w-4 h-4 text-blue-500" />
                                            </div>
                                            Account Settings
                                        </button>
                                    </div>

                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2"></div>

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center px-3 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center mr-3 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                                            <LogOut className="w-4 h-4 text-red-500" />
                                        </div>
                                        Secure Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
