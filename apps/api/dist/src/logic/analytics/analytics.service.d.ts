import { PrismaService } from '../../data/prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(tenantId: string): Promise<{
        totalOrders: number;
        totalProducts: number;
        totalInventory: number;
        lowStockItems: number;
        totalRevenue: any;
    }>;
    getOrderTrends(tenantId: string): Promise<{
        month: string;
        year: number;
        orders: number;
        revenue: number;
    }[]>;
    getInventoryHealth(tenantId: string): Promise<{
        name: any;
        itemCount: any;
        totalQuantity: any;
        capacity: any;
        utilization: number;
    }[]>;
}
