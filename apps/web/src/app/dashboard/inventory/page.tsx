'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';
import useSWR from 'swr';
import { Package, Search } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function InventoryPage() {
    const { data: warehouses } = useSWR('/warehouses', fetcher);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

    // Only fetch inventory if warehouse is selected
    const { data: inventory } = useSWR(
        selectedWarehouse ? `/inventory/warehouse/${selectedWarehouse}` : null,
        fetcher
    );

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Inventory Management</h1>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Warehouse</label>
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                        >
                            <option value="">-- Choose a Warehouse --</option>
                            {warehouses?.map((wh: any) => (
                                <option key={wh.id} value={wh.id}>{wh.name} ({wh.location})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 flex items-end">
                        {/* Search or Filters could go here */}
                    </div>
                </div>
            </div>

            {!selectedWarehouse && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Warehouse Selected</h3>
                    <p className="mt-1 text-sm text-gray-500">Select a warehouse above to view inventory levels.</p>
                </div>
            )}

            {selectedWarehouse && inventory && (
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-xl shadow-sm">
                    <ul role="list" className="divide-y divide-gray-200">
                        {inventory.length === 0 ? (
                            <li className="py-4 text-center text-gray-500">No inventory found in this warehouse.</li>
                        ) : inventory.map((item: any) => (
                            <li key={item.id} className="py-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {item.product?.name[0]}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{item.product?.name}</div>
                                        <div className="text-sm text-gray-500">{item.product?.sku}</div>
                                    </div>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        {item.quantity} Units
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </DashboardLayout>
    );
}
