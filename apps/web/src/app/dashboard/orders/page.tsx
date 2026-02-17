'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { Plus, ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/dashboard/orders/status-badge';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface Order {
    id: string;
    customerName: string;
    status: string;
    createdAt: string;
    items: any[];
    _count?: {
        items: number;
    }
}

export default function OrdersPage() {
    const { data: orders, isLoading } = useSWR<Order[]>('/orders', fetcher);

    const columns: any[] = [
        {
            header: 'Order ID',
            accessorKey: 'id',
            cell: (row: Order) => (
                <div className="font-mono text-xs text-gray-500">
                    {row.id.substring(0, 8)}...
                </div>
            )
        },
        {
            header: 'Customer',
            accessorKey: 'customerName',
            cell: (row: Order) => (
                <div className="font-medium text-gray-900 dark:text-white">
                    {row.customerName}
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row: Order) => <StatusBadge status={row.status} />
        },
        {
            header: 'Items',
            accessorKey: (row: Order) => row._count?.items || row.items?.length || 0,
            cell: (row: Order) => (
                <div className="text-gray-600 dark:text-gray-400">
                    {row._count?.items || row.items?.length || 0} items
                </div>
            )
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: (row: Order) => (
                <span className="text-sm text-gray-500">
                    {new Date(row.createdAt).toLocaleDateString()}
                </span>
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: (row: Order) => (
                <Link
                    href={`/dashboard/orders/${row.id}`} // We'll build detail page later
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                </Link>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and track customer orders here.</p>
                </div>
                <Link
                    href="/dashboard/orders/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Order
                </Link>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-full"></div>
                </div>
            ) : (
                <DataTable<Order>
                    data={orders || []}
                    columns={columns}
                    searchKey="customerName"
                />
            )}
        </div>
    );
}
