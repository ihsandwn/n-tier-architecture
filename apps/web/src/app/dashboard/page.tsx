'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Package, Users, Warehouse, TrendingUp, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group"
    >
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`}></div>

        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>

        <div className="flex items-center text-sm">
            <span className="text-green-500 flex items-center font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </motion.div>
);

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back to your OmniLogistics control center.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="$124,500"
                    icon={DollarSign}
                    color="bg-green-500 text-green-600"
                    trend="+12.5%"
                />
                <StatCard
                    title="Active Tenants"
                    value="12"
                    icon={Users}
                    color="bg-blue-500 text-blue-600"
                    trend="+2"
                />
                <StatCard
                    title="Total Inventory"
                    value="8,540"
                    icon={Package}
                    color="bg-purple-500 text-purple-600"
                    trend="+540"
                />
                <StatCard
                    title="Active Warehouses"
                    value="8"
                    icon={Warehouse}
                    color="bg-orange-500 text-orange-600"
                    trend="Stable"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Mock) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Analytics</h3>
                        <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm px-3 py-1 outline-none">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    {/* Mock Chart Visual */}
                    <div className="h-64 flex items-end justify-between space-x-2 px-4">
                        {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 65, 85].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-lg relative group h-full flex items-end">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className="w-full bg-blue-500 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${h}k
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-start">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 mr-4">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">New stock arrived</p>
                                    <p className="text-xs text-gray-500 mt-1">Warehouse A - 500 units</p>
                                </div>
                                <span className="ml-auto text-xs text-gray-400">2m ago</span>
                            </div>
                        ))}
                    </div>
                    <Link href="/dashboard/notifications" className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors flex items-center justify-center">
                        View All Activity
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
