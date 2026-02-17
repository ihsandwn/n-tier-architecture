import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(req: any): Promise<{
        totalOrders: number;
        totalProducts: number;
        totalInventory: number;
        lowStockItems: number;
        totalRevenue: any;
    }>;
    getOrderTrends(req: any): Promise<{
        month: string;
        year: number;
        orders: number;
        revenue: number;
    }[]>;
    getInventoryHealth(req: any): Promise<{
        name: any;
        itemCount: any;
        totalQuantity: any;
        capacity: any;
        utilization: number;
    }[]>;
}
