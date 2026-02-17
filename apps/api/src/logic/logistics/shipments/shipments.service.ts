import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../data/prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@Injectable()
export class ShipmentsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(tenantId: string, userId: string, createShipmentDto: CreateShipmentDto) {
        const { orderId, vehicleId, driverId, trackingNumber } = createShipmentDto;

        // Check if order exists and belongs to tenant
        const order = await this.prisma.order.findUnique({
            where: { id: orderId, tenantId },
        });

        if (!order) throw new NotFoundException('Order not found');

        // Check if shipment already exists
        const existingShipment = await this.prisma.shipment.findUnique({
            where: { orderId: orderId } // assuming 1:1 for MVP
        });
        if (existingShipment) throw new BadRequestException('Order is already shipped');

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Shipment
            const shipment = await tx.shipment.create({
                data: {
                    orderId,
                    vehicleId,
                    driverId,
                    trackingNumber,
                    status: 'assigned',
                }
            });

            // 2. Update Order Status
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'shipped' }
            });

            return shipment;
        });
    }

    async findAll(tenantId: string) {
        // Shipments are linked to Orders, which are linked to Tenants.
        // Shipment model doesn't have tenantId directly in MVP, so we query via order
        return this.prisma.shipment.findMany({
            where: {
                order: { tenantId }
            },
            include: {
                order: true,
                driver: true,
                vehicle: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
