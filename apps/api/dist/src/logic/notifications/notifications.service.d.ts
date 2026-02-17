import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notifications.gateway';
export declare class NotificationsService {
    private readonly prisma;
    private readonly gateway;
    constructor(prisma: PrismaService, gateway: NotificationGateway);
    create(dto: CreateNotificationDto): Promise<any>;
    findByUserId(userId: string): Promise<any>;
    markAsRead(id: string): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
    notifyRole(roleName: string, title: string, message: string, type?: string): Promise<void>;
    notifyDataChange(tenantId: string, domain: 'ORDERS' | 'INVENTORY' | 'PRODUCTS'): Promise<void>;
}
