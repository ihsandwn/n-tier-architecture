'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Warehouse,
    Package,
    Box,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    PieChart,
    Shield,
    X,
    ShoppingCart,
    Truck
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/auth-context';
import { useSidebar } from '@/context/sidebar-context';

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
    { name: 'Tenants', href: '/dashboard/tenants', icon: Users, roles: ['admin'] },
    { name: 'Warehouses', href: '/dashboard/warehouses', icon: Warehouse },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Box },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Fleet', href: '/dashboard/fleet', icon: Truck },
    { name: 'RBAC & Roles', href: '/dashboard/roles', icon: Shield, roles: ['admin'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
    const { isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebar();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <>
            {/* Mobile Toggle Button (Visible only on small screens) */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleMobileSidebar}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                    {isMobileOpen ? <X size={20} /> : <div className="space-y-1"><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div></div>}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            <aside
                className={clsx(
                    "h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl overflow-hidden",
                    // Width Control
                    isCollapsed ? "w-[80px]" : "w-[280px]",
                    // Mobile behavior: slide in/out
                    isMobileOpen ? "translate-x-0 !w-[280px]" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <div className={clsx("flex items-center transition-opacity duration-300", isCollapsed && !isMobileOpen ? "opacity-0 invisible w-0" : "opacity-100 visible")}>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 truncate">
                            OmniERP
                        </span>
                    </div>



                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className={clsx(
                            "hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all",
                            isCollapsed && "mx-auto"
                        )}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-1 overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        // Skip if role doesn't match
                        if (item.roles && user && !item.roles.some(r => user.roles.includes(r))) return null;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileSidebar}
                                className={clsx(
                                    "flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-200 group relative whitespace-nowrap",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon className={clsx("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 group-hover:text-gray-700")} />

                                <span className={clsx(
                                    "ml-3 transition-all duration-300",
                                    (isCollapsed && !isMobileOpen) ? "opacity-0 translate-x-10 hidden" : "opacity-100 translate-x-0"
                                )}>
                                    {item.name}
                                </span>

                                {isActive && !isCollapsed && !isMobileOpen && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <button
                        onClick={logout}
                        className={clsx(
                            "flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap",
                            (isCollapsed && !isMobileOpen) ? "justify-center" : ""
                        )}
                        title={isCollapsed ? "Log Out" : undefined}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {(!isCollapsed || isMobileOpen) && <span className="ml-3 font-medium">Log Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
