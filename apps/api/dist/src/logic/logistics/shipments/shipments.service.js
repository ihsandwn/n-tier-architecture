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
exports.ShipmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../data/prisma/prisma.service");
let ShipmentsService = class ShipmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, userId, createShipmentDto) {
        const { orderId, vehicleId, driverId, trackingNumber } = createShipmentDto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId, tenantId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const existingShipment = await this.prisma.shipment.findUnique({
            where: { orderId: orderId }
        });
        if (existingShipment)
            throw new common_1.BadRequestException('Order is already shipped');
        return this.prisma.$transaction(async (tx) => {
            const shipment = await tx.shipment.create({
                data: {
                    orderId,
                    vehicleId,
                    driverId,
                    trackingNumber,
                    status: 'assigned',
                }
            });
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'shipped' }
            });
            return shipment;
        });
    }
    async findAll(tenantId) {
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
};
exports.ShipmentsService = ShipmentsService;
exports.ShipmentsService = ShipmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShipmentsService);
//# sourceMappingURL=shipments.service.js.map