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
        orderId: string;
        vehicleId: string | null;
        driverId: string | null;
        trackingNumber: string;
    }>;
    findAll(req: any): Promise<({
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
