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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../data/prisma/prisma.service");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tenantId, createOrderDto) {
        console.log('OrdersService.create started', { userId, tenantId });
        const { customerName, items } = createOrderDto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        try {
            return await this.prisma.$transaction(async (tx) => {
                console.log('Transaction started');
                const order = await tx.order.create({
                    data: {
                        customerName,
                        tenantId,
                        status: update_order_status_dto_1.OrderStatus.PENDING,
                    }
                });
                console.log('Order created:', order.id);
                for (const item of items) {
                    const inventoryRecords = await tx.inventory.findMany({
                        where: {
                            productId: item.productId,
                            quantity: { gte: item.quantity },
                            product: { tenantId }
                        },
                        orderBy: { quantity: 'desc' },
                        include: { product: true }
                    });
                    if (inventoryRecords.length === 0) {
                        throw new common_1.BadRequestException(`Insufficient stock for product ID: ${item.productId}`);
                    }
                    const sourceInventory = inventoryRecords[0];
                    await tx.orderItem.create({
                        data: {
                            orderId: order.id,
                            productId: item.productId,
                            quantity: item.quantity,
                        }
                    });
                    await tx.inventory.update({
                        where: { id: sourceInventory.id },
                        data: { quantity: sourceInventory.quantity - item.quantity }
                    });
                    await tx.inventoryTransaction.create({
                        data: {
                            type: 'OUT',
                            quantity: item.quantity,
                            note: `Order #${order.id}`,
                            inventoryId: sourceInventory.id,
                            userId,
                            tenantId
                        }
                    });
                }
                console.log('Transaction successful');
                return order;
            });
        }
        catch (error) {
            console.error('OrdersService.create error:', error);
            throw error;
        }
    }
    async findAll(tenantId) {
        return this.prisma.order.findMany({
            where: { tenantId },
            include: {
                items: {
                    include: { product: true }
                },
                _count: { select: { items: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id, tenantId) {
        const order = await this.prisma.order.findUnique({
            where: { id, tenantId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shipment: {
                    include: {
                        driver: true,
                        vehicle: true,
                    }
                }
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(id, tenantId, userId, updateOrderStatusDto) {
        const { status } = updateOrderStatusDto;
        const order = await this.findOne(id, tenantId);
        if (order.status === update_order_status_dto_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot update status of a cancelled order');
        }
        if (status === update_order_status_dto_1.OrderStatus.CANCELLED && order.status !== update_order_status_dto_1.OrderStatus.CANCELLED) {
            return this.prisma.$transaction(async (tx) => {
                const updatedOrder = await tx.order.update({
                    where: { id },
                    data: { status }
                });
                for (const item of order.items) {
                    let inventory = await tx.inventory.findFirst({
                        where: { productId: item.productId, product: { tenantId } }
                    });
                    if (inventory) {
                        await tx.inventory.update({
                            where: { id: inventory.id },
                            data: { quantity: inventory.quantity + item.quantity }
                        });
                        await tx.inventoryTransaction.create({
                            data: {
                                type: 'IN',
                                quantity: item.quantity,
                                note: `Order #${id} Cancelled`,
                                inventoryId: inventory.id,
                                userId,
                                tenantId
                            }
                        });
                    }
                }
                return updatedOrder;
            });
        }
        return this.prisma.order.update({
            where: { id },
            data: { status }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map