import clsx from 'clsx';
import { Clock, Loader2, Truck, CheckCircle, XCircle } from 'lucide-react';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const statusConfig = {
        [OrderStatus.PENDING]: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
        [OrderStatus.PROCESSING]: { label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Loader2 },
        [OrderStatus.SHIPPED]: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck },
        [OrderStatus.DELIVERED]: { label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
        [OrderStatus.CANCELLED]: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
    };

    // Default fallback
    const config = statusConfig[status as OrderStatus] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;

    return (
        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent/10", config.color)}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
        </span>
    );
}
