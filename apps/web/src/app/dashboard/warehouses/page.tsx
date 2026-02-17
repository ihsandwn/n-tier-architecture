'use client';

import dynamic from 'next/dynamic';
import { Warehouse as WarehouseIcon, MapPin, Box, ArrowRight, Plus, Edit, Trash2 } from 'lucide-react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import WarehouseModal from '@/components/dashboard/warehouse-modal';

// Dynamically import Map to disable SSR
const WarehouseMap = dynamic(() => import('@/components/dashboard/warehouse-map'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface Warehouse {
    id: string;
    name: string;
    location: string;
    lat: number;
    lng: number;
    capacity: number;
    inventory: any[];
}

export default function WarehousesPage() {
    const { data: warehouses, error, isLoading, mutate } = useSWR<Warehouse[]>('/warehouses', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const warehouseList = useMemo(() => {
        if (Array.isArray(warehouses)) return warehouses;
        // @ts-ignore
        if (warehouses?.data && Array.isArray(warehouses.data)) return warehouses.data;
        return [];
    }, [warehouses]);

    const handleCreate = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.post('/warehouses', data);
            await mutate(); // Refresh list
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to create warehouse:', err);
            alert('Failed to create warehouse');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedWarehouse) return;
        setIsSubmitting(true);
        try {
            await api.patch(`/warehouses/${selectedWarehouse.id}`, data);
            await mutate();
            setIsModalOpen(false);
            setSelectedWarehouse(undefined);
        } catch (err) {
            console.error('Failed to update warehouse:', err);
            alert('Failed to update warehouse');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation to detail page
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this warehouse?')) return;
        try {
            await api.delete(`/warehouses/${id}`);
            mutate();
        } catch (err) {
            console.error('Failed to delete warehouse:', err);
            alert('Failed to delete warehouse');
        }
    };

    const openCreateModal = () => {
        setSelectedWarehouse(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (e: React.MouseEvent, warehouse: Warehouse) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedWarehouse(warehouse);
        setIsModalOpen(true);
    };

    if (error) return <div className="p-8 text-center text-red-500">Failed to load warehouses. API might be down or unreachable.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Warehouses</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage your distribution centers.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center disabled:opacity-50"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Warehouse
                </button>
            </div>

            {/* Map View */}
            {!isLoading && warehouseList.length > 0 && (
                <WarehouseMap warehouses={warehouseList} />
            )}

            {/* Warehouse Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-48 animate-pulse"></div>
                    ))
                ) : (
                    warehouseList.length > 0 ? (
                        warehouseList.map((warehouse: Warehouse) => (
                            <Link
                                href={`/dashboard/warehouses/${warehouse.id}`}
                                key={warehouse.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group relative block"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                        <WarehouseIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                                        <button
                                            onClick={(e) => openEditModal(e, warehouse)}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, warehouse.id)}
                                            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                                    {warehouse.name}
                                </h3>

                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {warehouse.location}
                                </div>

                                <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-500">Utilization</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {Math.floor(Math.random() * 100)}%
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            No warehouses found. Click "Add Warehouse" to get started.
                        </div>
                    )
                )}
            </div>

            <WarehouseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={selectedWarehouse ? handleUpdate : handleCreate}
                initialData={selectedWarehouse}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
