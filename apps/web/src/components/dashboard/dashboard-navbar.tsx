'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useSidebar } from '@/context/sidebar-context';
import { Bell, Search, Menu } from 'lucide-react';

export default function DashboardNavbar() {
    const { user } = useAuth();
    const { isCollapsed, toggleMobileSidebar } = useSidebar();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    return (
        <header
            className={`h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 fixed top-0 right-0 left-0 z-30 transition-all duration-300 ml-0 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
                }`}
        >
            <div className="h-full px-6 flex items-center justify-between">
                {/* Left Side: Mobile Toggle & Search */}
                <div className="flex items-center">
                    <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden p-2 mr-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all hidden md:flex">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Right Side: Notifications & Profile */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>

                        {isNotifOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 animate-in fade-in slide-in-from-top-5 duration-200">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                                </div>
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    <p>No new notifications</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full p-1 pr-3 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.email}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0] || 'User'}</p>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 animate-in fade-in slide-in-from-top-5 duration-200">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 md:hidden">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0]}</p>
                                </div>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    My Profile
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Settings
                                </button>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
