import { PrismaService } from '../../../data/prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
export declare class ShipmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, userId: string, createShipmentDto: CreateShipmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        orderId: string;
        vehicleId: string | null;
        driverId: string | null;
        trackingNumber: string;
    }>;
    findAll(tenantId: string): Promise<({
        order: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            customerName: string;
            status: string;
        };
        vehicle: {
            id: string;
            tenantId: string;
            type: string;
            plateNumber: string;
        } | null;
        driver: {
            id: string;
            tenantId: string;
            name: string;
            license: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        orderId: string;
        vehicleId: string | null;
        driverId: string | null;
        trackingNumber: string;
    })[]>;
}
