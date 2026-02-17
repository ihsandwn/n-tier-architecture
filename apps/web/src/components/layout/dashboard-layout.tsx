'use client';

import { useAuth } from '@/context/auth-context';
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar';
import DashboardNavbar from '@/components/dashboard/dashboard-navbar';

import { useSidebar } from '@/context/sidebar-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { isCollapsed } = useSidebar();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-blue-500 selection:text-white">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Navbar */}
            <DashboardNavbar />

            {/* Main Content Area */}
            <main
                className={`pt-20 pb-12 px-4 md:px-8 min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}`}
            >
                <div className="max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
