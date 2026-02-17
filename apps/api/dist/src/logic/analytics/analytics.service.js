"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../data/prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(tenantId) {
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
                    quantity: { lt: 20 },
                },
            }),
        ]);
        const orders = await this.prisma.order.findMany({
            where: { tenantId, status: { not: 'cancelled' } },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        const totalRevenue = orders.reduce((acc, order) => {
            const orderTotal = order.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
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
    async getOrderTrends(tenantId) {
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
        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const monthLabel = months[orderDate.getMonth()];
            const year = orderDate.getFullYear();
            const trend = trends.find(t => t.month === monthLabel && t.year === year);
            if (trend) {
                trend.orders += 1;
                const revenue = order.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
                trend.revenue += revenue;
            }
        });
        return trends;
    }
    async getInventoryHealth(tenantId) {
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
        return warehouses.map((w) => ({
            name: w.name,
            itemCount: w._count.inventory,
            totalQuantity: w.inventory.reduce((sum, inv) => sum + inv.quantity, 0),
            capacity: w.capacity,
            utilization: w.capacity > 0
                ? (w.inventory.reduce((sum, inv) => sum + inv.quantity, 0) / w.capacity) * 100
                : 0,
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map