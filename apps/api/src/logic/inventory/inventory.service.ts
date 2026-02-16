import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class InventoryService {
    constructor(private readonly prisma: PrismaService) { }

    async updateStock(updateStockDto: UpdateStockDto) {
        const { warehouseId, productId, quantity } = updateStockDto;

        // Verify warehouse and product exist (optional, but good practice)
        // Prisma will throw foreign key error if not found, but we can be explicit if needed.

        // Upsert: Create if not exists, update if exists
        return this.prisma.inventory.upsert({
            where: {
                warehouseId_productId: {
                    warehouseId,
                    productId,
                },
            },
            update: {
                quantity,
            },
            create: {
                warehouseId,
                productId,
                quantity,
            },
            include: {
                product: true,
                warehouse: true,
            },
        });
    }

    async getStock(warehouseId: string, productId: string) {
        const inventory = await this.prisma.inventory.findUnique({
            where: {
                warehouseId_productId: {
                    warehouseId,
                    productId,
                },
            },
            include: {
                product: true,
            },
        });

        if (!inventory) {
            throw new NotFoundException('Inventory record not found');
        }
        return inventory;
    }

    async getWarehouseInventory(warehouseId: string) {
        return this.prisma.inventory.findMany({
            where: { warehouseId },
            include: {
                product: true,
            },
        });
    }
}
