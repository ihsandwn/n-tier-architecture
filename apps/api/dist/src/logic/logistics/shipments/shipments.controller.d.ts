import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
export declare class ShipmentsController {
    private readonly shipmentsService;
    constructor(shipmentsService: ShipmentsService);
    create(req: any, createShipmentDto: CreateShipmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        trackingNumber: string;
        orderId: string;
        vehicleId: string | null;
        driverId: string | null;
    }>;
    findAll(req: any): Promise<({
        vehicle: {
            id: string;
            tenantId: string;
            type: string;
            plateNumber: string;
        } | null;
        driver: {
            id: string;
            name: string;
            tenantId: string;
            license: string;
        } | null;
        order: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            customerName: string;
            status: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        trackingNumber: string;
        orderId: string;
        vehicleId: string | null;
        driverId: string | null;
    })[]>;
}
