import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    updateStock(updateStockDto: UpdateStockDto): Promise<{
        warehouse: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            location: string;
            capacity: number;
        };
        product: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sku: string;
            description: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        productId: string;
        warehouseId: string;
        quantity: number;
    }>;
    getWarehouseInventory(warehouseId: string): Promise<({
        product: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sku: string;
            description: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        productId: string;
        warehouseId: string;
        quantity: number;
    })[]>;
}
