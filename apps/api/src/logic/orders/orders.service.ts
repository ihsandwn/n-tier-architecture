import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, OrderStatus } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, tenantId: string, createOrderDto: CreateOrderDto) {
        console.log('OrdersService.create started', { userId, tenantId });
        const { customerName, items } = createOrderDto;

        if (!items || items.length === 0) {
            throw new BadRequestException('Order must contain at least one item');
        }

        try {
            return await this.prisma.$transaction(async (tx) => {
                console.log('Transaction started');
                // 1. Create the Order
                const order = await tx.order.create({
                    data: {
                        customerName,
                        tenantId,
                        status: OrderStatus.PENDING,
                    }
                });
                console.log('Order created:', order.id);

                // 2. Process each item: Create OrderItem and Deduct Inventory
                for (const item of items) {
                    // Check if product exists and get current stock
                    // We need to find a warehouse to deduct from.
                    // For MVP, we'll arbitrarily pick the FIRST warehouse that has stock.
                    // In a real app, user would select a warehouse or logic would optimize.

                    // Find inventory across all warehouses for this product (in this tenant)
                    const inventoryRecords = await tx.inventory.findMany({
                        where: {
                            productId: item.productId,
                            quantity: { gte: item.quantity }, // Find warehouses with enough stock
                            // Note: Inventory model has tenantId? We should filter by it if possible or rely on product->tenant
                            product: { tenantId }
                        },
                        orderBy: { quantity: 'desc' }, // Use the one with most stock
                        include: { product: true }
                    });

                    if (inventoryRecords.length === 0) {
                        throw new BadRequestException(`Insufficient stock for product ID: ${item.productId}`);
                    }

                    const sourceInventory = inventoryRecords[0];

                    // Create OrderItem
                    await tx.orderItem.create({
                        data: {
                            orderId: order.id,
                            productId: item.productId,
                            quantity: item.quantity,
                        }
                    });

                    // Deduct Inventory
                    await tx.inventory.update({
                        where: { id: sourceInventory.id },
                        data: { quantity: sourceInventory.quantity - item.quantity }
                    });

                    // Record Transaction
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
        } catch (error) {
            console.error('OrdersService.create error:', error);
            throw error;
        }
    }

    async findAll(tenantId: string) {
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

    async findOne(id: string, tenantId: string) {
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
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(id: string, tenantId: string, userId: string, updateOrderStatusDto: UpdateOrderStatusDto) {
        const { status } = updateOrderStatusDto;

        const order = await this.findOne(id, tenantId);

        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Cannot update status of a cancelled order');
        }

        if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
            // Restore inventory if cancelling
            return this.prisma.$transaction(async (tx) => {
                // Update Order Status
                const updatedOrder = await tx.order.update({
                    where: { id },
                    data: { status }
                });

                // Return items to inventory
                // We need to know where they came from... 
                // The current OrderItem model unfortunately DOES NOT store the warehouseId source.
                // Limitation of MVP schema. 
                // Solution: We will return them to the *first available warehouse* or just increment *an* inventory record.
                // Better approach for MVP: Find the inventory record for this product with the highest stock (or just any) and add it back.

                for (const item of order.items) {
                    // Try to find an existing inventory record to assume return
                    let inventory = await tx.inventory.findFirst({
                        where: { productId: item.productId, product: { tenantId } }
                    });

                    // If no inventory record exists (weird case if we deleted warehouse?), skip or create?
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

        // Normal Status Update
        return this.prisma.order.update({
            where: { id },
            data: { status }
        });
    }
}
