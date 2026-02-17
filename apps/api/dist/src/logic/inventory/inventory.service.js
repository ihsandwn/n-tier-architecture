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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../data/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let InventoryService = class InventoryService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async updateStock(userId, tenantId, updateStockDto) {
        const { warehouseId, productId, quantity, type, note } = updateStockDto;
        return this.prisma.$transaction(async (tx) => {
            let inventory = await tx.inventory.findUnique({
                where: {
                    warehouseId_productId: { warehouseId, productId }
                }
            });
            if (!inventory && type === 'OUT') {
                throw new common_1.NotFoundException('Cannot check out from non-existent inventory');
            }
            if (!inventory) {
                inventory = await tx.inventory.create({
                    data: {
                        warehouseId,
                        productId,
                        quantity: 0,
                        tenantId
                    }
                });
            }
            let newQuantity = inventory.quantity;
            if (type === 'IN') {
                newQuantity += quantity;
            }
            else if (type === 'OUT') {
                if (inventory.quantity < quantity) {
                    throw new Error(`Insufficient stock. Current: ${inventory.quantity}, Requested: ${quantity}`);
                }
                newQuantity -= quantity;
            }
            else if (type === 'ADJUSTMENT') {
            }
            const updatedInventory = await tx.inventory.update({
                where: { id: inventory.id },
                data: { quantity: newQuantity }
            });
            await tx.inventoryTransaction.create({
                data: {
                    type,
                    quantity,
                    note,
                    inventoryId: inventory.id,
                    userId,
                    tenantId
                }
            });
            this.notificationsService.notifyDataChange(tenantId, 'INVENTORY');
            return updatedInventory;
        });
    }
    async getStock(warehouseId, productId) {
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
            throw new common_1.NotFoundException('Inventory record not found');
        }
        return inventory;
    }
    async getWarehouseInventory(warehouseId) {
        return this.prisma.inventory.findMany({
            where: { warehouseId },
            include: {
                product: true,
            },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map