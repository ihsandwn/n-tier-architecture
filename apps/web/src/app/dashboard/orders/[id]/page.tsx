'use client';

import { use, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Calendar, Package, User, Truck, AlertCircle } from 'lucide-react';
import { StatusBadge, OrderStatus } from '@/components/dashboard/orders/status-badge';
import clsx from 'clsx';
import { CreateShipmentModal } from '@/components/dashboard/shipments/create-shipment-modal';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        sku: string;
        price: number;
    };
}

interface Shipment {
    id: string;
    trackingNumber: string;
    status: string;
    driver?: {
        name: string;
    };
    vehicle?: {
        plateNumber: string;
    };
}

interface Order {
    id: string;
    customerName: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
    shipment?: Shipment;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() - Next.js 15+ pattern
    const { id } = use(params);
    const router = useRouter();

    const { data: order, isLoading, error } = useSWR<Order>(`/orders/${id}`, fetcher);
    const [isUpdating, setIsUpdating] = useState(false);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-full"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">The order you are looking for does not exist or you do not have permission to view it.</p>
                <Link href="/dashboard/orders" className="text-blue-600 hover:underline">Return to Orders</Link>
            </div>
        );
    }

    const totalPrice = order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleStatusUpdate = async (newStatus: string) => {
        if (newStatus === order.status) return;

        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        setIsUpdating(true);
        try {
            await api.patch(`/orders/${id}/status`, { status: newStatus });
            mutate(`/orders/${id}`); // Refresh data
        } catch (err: any) {
            console.error('Failed to update status:', err);
            alert(err.response?.data?.message || 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link
                    href="/dashboard/orders"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.id.substring(0, 8)}</h1>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm mt-1">
                        <Calendar className="w-4 h4" />
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Order Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-500" />
                                Order Items
                            </h2>
                            <span className="text-sm text-gray-500">{order.items.length} items</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{item.product.name}</div>
                                        <div className="text-xs text-gray-500">SKU: {item.product.sku}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.quantity} x ${item.product.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Customer
                        </h2>
                        <div className="font-medium text-gray-900 dark:text-white text-lg">
                            {order.customerName}
                        </div>
                    </div>

                    {/* Shipment Info */}
                    {order.shipment ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                <Truck className="w-4 h-4 mr-2" />
                                Shipment Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Tracking #</span>
                                    <div className="font-mono font-medium text-gray-900 dark:text-white">{order.shipment.trackingNumber}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase">Driver</span>
                                        <div className="font-medium text-gray-900 dark:text-white">{order.shipment.driver?.name}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase">Vehicle</span>
                                        <div className="font-medium text-gray-900 dark:text-white">{order.shipment.vehicle?.plateNumber}</div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                        {order.shipment.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                <Truck className="w-4 h-4 mr-2" />
                                Logistics
                            </h2>
                            {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED && (
                                <CreateShipmentModal orderId={order.id} onSuccess={() => mutate(`/orders/${id}`)} />
                            )}
                            {order.status === OrderStatus.CANCELLED && (
                                <p className="text-sm text-gray-500">Logistics unavailable for cancelled orders.</p>
                            )}
                            {order.status === OrderStatus.DELIVERED && (
                                <p className="text-sm text-gray-500">Order already delivered.</p>
                            )}
                        </div>
                    )}

                    {/* Status Management */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Manage Status
                        </h2>

                        <div className="space-y-2">
                            {Object.values(OrderStatus).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(status)}
                                    disabled={isUpdating || order.status === status || order.status === OrderStatus.CANCELLED || (status === OrderStatus.SHIPPED && !order.shipment)}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                                        order.status === status
                                            ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    <span className="capitalize">{status}</span>
                                    {order.status === status && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                </button>
                            ))}
                        </div>

                        {!order.shipment && order.status !== OrderStatus.CANCELLED && (
                            <p className="mt-2 text-xs text-amber-500">
                                * Create a shipment to set status to Shipped.
                            </p>
                        )}

                        {order.status === OrderStatus.CANCELLED && (
                            <p className="mt-4 text-xs text-red-500 text-center">
                                This order is cancelled and cannot be modified.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
