import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, tenantId: string, createOrderDto: CreateOrderDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        status: string;
    }>;
    findAll(tenantId: string): Promise<({
        _count: {
            items: number;
        };
        items: ({
            product: {
                id: string;
                name: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
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
    findOne(id: string, tenantId: string): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
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
        shipment: ({
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            trackingNumber: string;
            orderId: string;
            vehicleId: string | null;
            driverId: string | null;
        }) | null;
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        status: string;
    }>;
    updateStatus(id: string, tenantId: string, userId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        status: string;
    }>;
}
