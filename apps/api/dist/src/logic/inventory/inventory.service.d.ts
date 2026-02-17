import { PrismaService } from '../../data/prisma/prisma.service';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
