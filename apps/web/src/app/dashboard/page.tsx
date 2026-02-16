'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Package, Users, Warehouse } from 'lucide-react';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back to OmniLogistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Tenants</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Warehouses</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                            <Warehouse className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Inventory</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">1,240</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
