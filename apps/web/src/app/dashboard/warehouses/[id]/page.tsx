'use client';

import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Box, Edit, Trash2, Package } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import Link from 'next/link';

// Dynamically import Map to disable SSR
const WarehouseMap = dynamic(() => import('@/components/dashboard/warehouse-map'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface Warehouse {
    id: string;
    name: string;
    location: string;
    lat: number;
    lng: number;
    capacity: number;
}

interface InventoryItem {
    id: string;
    sku: string;
    quantity: number;
    location: string;
    product?: {
        name: string;
        price: number;
    };
}

export default function WarehouseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: warehouse, isLoading: isLoadingWarehouse, error: warehouseError } = useSWR<Warehouse>(id ? `/warehouses/${id}` : null, fetcher);
    const { data: inventory, isLoading: isLoadingInventory } = useSWR<InventoryItem[]>(id ? `/inventory/warehouse/${id}` : null, fetcher);

    const warehouseLocation = useMemo(() => {
        if (!warehouse) return [];
        return [warehouse];
    }, [warehouse]);

    const inventoryColumns: any[] = [
        {
            header: 'Product Name',
            accessorKey: (row: InventoryItem) => row.product?.name,
            cell: (row: InventoryItem) => (
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mr-3">
                        <Package className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{row.product?.name || 'Unknown Product'}</span>
                </div>
            )
        },
        {
            header: 'SKU',
            accessorKey: 'sku',
            cell: (row: InventoryItem) => (
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    {row.sku}
                </span>
            )
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
            cell: (row: InventoryItem) => (
                <div className={`font-bold ${row.quantity < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {row.quantity}
                </div>
            )
        },
        {
            header: 'Bin Location',
            accessorKey: 'location',
            cell: (row: InventoryItem) => (
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300">
                    {row.location}
                </span>
            )
        }
    ];

    if (isLoadingWarehouse) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div>
        );
    }

    if (warehouseError || !warehouse) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Warehouse Not Found</h2>
                <p className="text-gray-500 mt-2">The warehouse you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Warehouses
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/warehouses"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {warehouse.name}
                            <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">Active</span>
                        </h1>
                        <div className="flex items-center text-gray-500 text-sm mt-1 gap-4">
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {warehouse.location}</span>
                            <span className="flex items-center"><Box className="w-3 h-3 mr-1" /> Capacity: {warehouse.capacity}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </button>
                    <button className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map & Info Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
                        <WarehouseMap warehouses={warehouseLocation} />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-500 text-sm">Total Items</span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {inventory?.reduce((acc, item) => acc + item.quantity, 0) || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-500 text-sm">Unique SKUs</span>
                                <span className="font-bold text-gray-900 dark:text-white">{inventory?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Utilization</span>
                                <span className="font-bold text-green-600">
                                    {Math.round(((inventory?.reduce((acc, item) => acc + item.quantity, 0) || 0) / warehouse.capacity) * 100)}%
                                </span>
                            </div>
                            {/* Utilization Bar */}
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.round(((inventory?.reduce((acc, item) => acc + item.quantity, 0) || 0) / warehouse.capacity) * 100))}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Table Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white">Current Inventory</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Add Stock</button>
                        </div>

                        {isLoadingInventory ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                            </div>
                        ) : (
                            <DataTable
                                data={inventory || []}
                                columns={inventoryColumns}
                                searchKey="sku"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
