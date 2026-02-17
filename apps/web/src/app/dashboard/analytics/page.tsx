'use client';

import { api } from '@/lib/api';
import useSWR from 'swr';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Package,
    AlertTriangle,
    ArrowUpRight,
    Filter,
    Calendar,
    Warehouse as WarehouseIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Fetcher function
const fetcher = (url: string) => api.get(url).then((res) => res.data);

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group"
    >
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`}></div>

        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {typeof value === 'number' && title.toLowerCase().includes('revenue')
                        ? `$${value.toLocaleString()}`
                        : value}
                </h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>

        {trendValue && (
            <div className="flex items-center text-sm">
                <span className={`flex items-center font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {trendValue}
                </span>
                <span className="text-gray-400 ml-2">vs last period</span>
            </div>
        )}
    </motion.div>
);

export default function AnalyticsPage() {
    const { data: stats, isLoading: statsLoading } = useSWR('/analytics/dashboard', fetcher);
    const { data: trends, isLoading: trendsLoading } = useSWR('/analytics/trends', fetcher);
    const { data: health, isLoading: healthLoading } = useSWR('/analytics/inventory-health', fetcher);

    // Mock trend value logic for visual impact
    const dashboardStats = useMemo(() => [
        {
            title: "Total Revenue",
            value: stats?.totalRevenue || 0,
            icon: DollarSign,
            color: "bg-green-500 text-green-600",
            trend: "up",
            trendValue: "+12.5%",
            delay: 0.1
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: "bg-blue-500 text-blue-600",
            trend: "up",
            trendValue: "+8.2%",
            delay: 0.2
        },
        {
            title: "Inventory Value",
            value: (stats?.totalInventory || 0),
            icon: Package,
            color: "bg-purple-500 text-purple-600",
            trend: "down",
            trendValue: "-3.1%",
            delay: 0.3
        },
        {
            title: "Stock Alerts",
            value: stats?.lowStockItems || 0,
            icon: AlertTriangle,
            color: "bg-orange-500 text-orange-600",
            trend: stats?.lowStockItems > 0 ? "up" : "down",
            trendValue: stats?.lowStockItems > 0 ? "Critical" : "Stable",
            delay: 0.4
        }
    ], [stats]);

    const maxRevenue = useMemo(() => {
        if (!trends || trends.length === 0) return 100;
        return Math.max(...trends.map((t: any) => t.revenue), 10);
    }, [trends]);

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Insights</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time performance metrics and operational analytics.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last 6 Months
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(statsLoading ? [...Array(4)] : dashboardStats).map((stat, i) => (
                    statsLoading ? (
                        <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl border border-gray-100 dark:border-gray-700"></div>
                    ) : (
                        <StatCard key={i} {...stat} />
                    )
                ))}
            </div>

            {/* Charts & Health Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue & Order Trends */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue & Order Trends</h3>
                            <p className="text-sm text-gray-500 mt-1">Growth tracking over the last 6 months</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-lg">
                            <button className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white">Revenue</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Orders</button>
                        </div>
                    </div>

                    {trendsLoading ? (
                        <div className="h-64 flex items-end justify-between space-x-4 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg h-32"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-64 flex items-end justify-between space-x-3 px-2">
                            {trends?.map((t: any, i: number) => (
                                <div key={i} className="w-full bg-blue-50 dark:bg-blue-900/10 rounded-t-xl relative group h-full flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(t.revenue / maxRevenue) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="w-full bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity relative"
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl whitespace-nowrap z-10 pointer-events-none">
                                            ${t.revenue.toLocaleString()}
                                            <div className="text-[10px] font-medium opacity-70">{t.orders} orders</div>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45"></div>
                                        </div>
                                    </motion.div>
                                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        {t.month}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Warehouse Health */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Inventory Health</h3>
                    <p className="text-sm text-gray-500 mb-8 font-medium">Utilization by Location</p>

                    <div className="space-y-8 flex-1">
                        {healthLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-3 animate-pulse">
                                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                                </div>
                            ))
                        ) : (
                            health?.map((w: any, i: number) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="p-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg mr-3 text-gray-500">
                                                <WarehouseIcon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{w.name}</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${w.utilization > 80 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                                w.utilization > 50 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                                                    'bg-green-100 text-green-600 dark:bg-green-900/30'
                                            }`}>
                                            {Math.round(w.utilization)}%
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700/50">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${w.utilization}%` }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                            className={`h-full rounded-full ${w.utilization > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                                    w.utilization > 50 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                                                        'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                        <span>{w.totalQuantity.toLocaleString()} Units</span>
                                        <span>Cap: {w.capacity.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                        {!healthLoading && health?.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                                <Package className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-sm text-gray-400">No warehouse data available</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-8 py-3 bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all flex items-center justify-center group tracking-wide">
                        View Detailed Inventory Report
                        <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
