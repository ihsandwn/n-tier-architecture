import { PrismaService } from '../../data/prisma/prisma.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class InventoryService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    updateStock(userId: string, tenantId: string, updateStockDto: UpdateStockDto): Promise<{
        id: string;
        tenantId: string | null;
        updatedAt: Date;
        quantity: number;
        warehouseId: string;
        productId: string;
    }>;
    getStock(warehouseId: string, productId: string): Promise<{
        product: {
            id: string;
            name: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            description: string | null;
            price: number;
        };
    } & {
        id: string;
        tenantId: string | null;
        updatedAt: Date;
        quantity: number;
        warehouseId: string;
        productId: string;
    }>;
    getWarehouseInventory(warehouseId: string): Promise<({
        product: {
            id: string;
            name: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            description: string | null;
            price: number;
        };
    } & {
        id: string;
        tenantId: string | null;
        updatedAt: Date;
        quantity: number;
        warehouseId: string;
        productId: string;
    })[]>;
}
