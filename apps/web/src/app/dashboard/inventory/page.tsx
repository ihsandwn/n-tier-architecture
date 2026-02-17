'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { DataTable, Column } from '@/components/ui/data-table';
import {
    Plus,
    Search,
    Warehouse as WarehouseIcon,
    Edit,
    Trash2,
    ArrowUpRight,
    AlertTriangle,
    CheckCircle2,
    ArrowLeftRight
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import StockAdjustmentModal from '@/components/dashboard/inventory/stock-adjustment-modal';
import clsx from 'clsx';


const fetcher = (url: string) => api.get(url).then(res => res.data);

interface InventoryItem {
    id: string;
    sku: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    location: string;
    product?: {
        name: string;
        price: number;
    };
}

interface Warehouse {
    id: string;
    name: string;
}

export default function InventoryPage() {
    const { data: warehouses, isLoading: isLoadingWarehouses } = useSWR<Warehouse[]>('/warehouses', fetcher);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('');
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    // Select first warehouse by default when loaded
    useMemo(() => {
        if (warehouses && warehouses.length > 0 && !selectedWarehouseId) {
            setSelectedWarehouseId(warehouses[0].id);
        }
    }, [warehouses, selectedWarehouseId]);

    const { data: inventory, isLoading: isLoadingInventory, mutate } = useSWR<InventoryItem[]>(
        selectedWarehouseId ? `/inventory/warehouse/${selectedWarehouseId}` : null,
        fetcher
    );

    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openAdjustmentModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsAdjustmentModalOpen(true);
    };

    const handleStockAdjustment = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.post('/inventory/stock', data);
            await mutate(); // Refresh inventory list
            setIsAdjustmentModalOpen(false);
            setSelectedItem(undefined);
            // Optional: Success Toast
        } catch (err: any) {
            console.error('Failed to adjust stock:', err);
            const message = err.response?.data?.message || 'Failed to adjust stock';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<InventoryItem>[] = [
        {
            header: 'Product Name',
            accessorKey: (row: InventoryItem) => row.product?.name,
            cell: (row: InventoryItem) => (
                <div className="font-medium text-gray-900 dark:text-white">
                    {row.product?.name || 'Unknown Product'}
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
            header: 'Location',
            accessorKey: 'location',
            cell: (row: InventoryItem) => (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                        {row.location}
                    </span>
                </div>
            )
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
            cell: (row: InventoryItem) => (
                <div className={`font-bold ${row.quantity < 10 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {row.quantity}
                    {row.quantity < 10 && (
                        <span className="ml-2 inline-flex items-center text-xs font-normal text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low Stock
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Value',
            accessorKey: (row: InventoryItem) => (row.product?.price || 0) * row.quantity,
            cell: (row: InventoryItem) => (
                <span className="text-gray-600 dark:text-gray-400">
                    ${((row.product?.price || 0) * row.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (row: InventoryItem) => (
                <button
                    onClick={() => openAdjustmentModal(row)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                    <ArrowLeftRight className="w-4 h-4 mr-1" />
                    Adjust
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track stock levels across all your warehouses.</p>
                </div>

                {/* Warehouse Selector */}
                <div className="flex items-center space-x-4">
                    <Select
                        value={selectedWarehouseId}
                        onValueChange={setSelectedWarehouseId}
                        disabled={isLoadingWarehouses}
                    >
                        <SelectTrigger className="min-w-[240px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 shadow-sm rounded-xl [&>span]:flex [&>span]:items-center">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-lg text-blue-600 dark:text-blue-400 mr-2">
                                <WarehouseIcon className="w-4 h-4" />
                            </div>
                            <SelectValue placeholder="Select Warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses?.map(w => (
                                <SelectItem key={w.id} value={w.id}>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        {w.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Low Stock Toggle */}
                <button
                    onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                    className={clsx(
                        "flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all font-medium text-sm",
                        showLowStockOnly
                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 shadow-sm shadow-red-100 dark:shadow-none"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750"
                    )}
                >
                    <AlertTriangle className={clsx("w-4 h-4", showLowStockOnly ? "animate-pulse" : "opacity-50")} />
                    <span>Low Stock Only</span>
                </button>
            </div>

            {/* Inventory Table */}
            {isLoadingInventory && selectedWarehouseId ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-full"></div>
                </div>
            ) : !selectedWarehouseId ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-xl text-center border border-yellow-100 dark:border-yellow-900/30">
                    <WarehouseIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400">No Warehouse Selected</h3>
                    <p className="text-yellow-600 dark:text-yellow-300/80">Please select a warehouse to view its inventory.</p>
                </div>
            ) : (
                <DataTable<InventoryItem>
                    data={inventory || []}
                    columns={columns}
                    searchKeys={['sku', 'product.name']}
                    customFilter={(item) => !showLowStockOnly || item.quantity < 10}
                />
            )}

            <StockAdjustmentModal
                isOpen={isAdjustmentModalOpen}
                onClose={() => setIsAdjustmentModalOpen(false)}
                onSubmit={handleStockAdjustment}
                product={selectedItem?.product ? {
                    id: selectedItem.productId,
                    name: selectedItem.product.name,
                    sku: selectedItem.sku || '' // Fallback if sku missing on item level
                } : undefined}
                warehouseId={selectedWarehouseId}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
