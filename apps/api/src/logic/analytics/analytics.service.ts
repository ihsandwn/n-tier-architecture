import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats(tenantId: string) {
        const [totalOrders, totalProducts, totalInventory, lowStockItems] = await Promise.all([
            this.prisma.order.count({ where: { tenantId } }),
            this.prisma.product.count({ where: { tenantId } }),
            this.prisma.inventory.aggregate({
                where: { product: { tenantId } },
                _sum: { quantity: true },
            }),
            this.prisma.inventory.count({
                where: {
                    product: { tenantId },
                    quantity: { lt: 20 }, // Threshold for low stock
                },
            }),
        ]);

        // Calculate total revenue (Join with Product price)
        const orders = await this.prisma.order.findMany({
            where: { tenantId, status: { not: 'cancelled' } },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        const totalRevenue = orders.reduce((acc: number, order: any) => {
            const orderTotal = order.items.reduce((sum: number, item: any) => sum + item.quantity * item.product.price, 0);
            return acc + orderTotal;
        }, 0);

        return {
            totalOrders,
            totalProducts,
            totalInventory: totalInventory._sum.quantity || 0,
            lowStockItems,
            totalRevenue,
        };
    }

    async getOrderTrends(tenantId: string) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await this.prisma.order.findMany({
            where: {
                tenantId,
                createdAt: { gte: sixMonthsAgo },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Group by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trends = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return {
                month: months[d.getMonth()],
                year: d.getFullYear(),
                orders: 0,
                revenue: 0,
            };
        }).reverse();

        orders.forEach((order: any) => {
            const orderDate = new Date(order.createdAt);
            const monthLabel = months[orderDate.getMonth()];
            const year = orderDate.getFullYear();

            const trend = trends.find(t => t.month === monthLabel && t.year === year);
            if (trend) {
                trend.orders += 1;
                const revenue = order.items.reduce((sum: number, item: any) => sum + item.quantity * item.product.price, 0);
                trend.revenue += revenue;
            }
        });

        return trends;
    }

    async getInventoryHealth(tenantId: string) {
        const warehouses = await this.prisma.warehouse.findMany({
            where: { tenantId },
            include: {
                _count: {
                    select: { inventory: true },
                },
                inventory: {
                    select: { quantity: true },
                },
            },
        });

        return warehouses.map((w: any) => ({
            name: w.name,
            itemCount: w._count.inventory,
            totalQuantity: w.inventory.reduce((sum: number, inv: any) => sum + inv.quantity, 0),
            capacity: w.capacity,
            utilization: w.capacity > 0
                ? (w.inventory.reduce((sum: number, inv: any) => sum + inv.quantity, 0) / w.capacity) * 100
                : 0,
        }));
    }
}
