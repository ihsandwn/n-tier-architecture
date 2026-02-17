import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    updateStock(updateStockDto: UpdateStockDto, req: any): Promise<{
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
