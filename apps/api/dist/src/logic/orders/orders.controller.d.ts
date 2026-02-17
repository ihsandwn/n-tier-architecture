import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        status: string;
    }>;
    findAll(req: any): Promise<({
        _count: {
            items: number;
        };
        items: ({
            product: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                description: string | null;
                price: number;
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        status: string;
    })[]>;
    findOne(req: any, id: string): Promise<{
        shipment: ({
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
        }) | null;
        items: ({
            product: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                description: string | null;
                price: number;
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        status: string;
    }>;
    updateStatus(req: any, id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        status: string;
    }>;
}
