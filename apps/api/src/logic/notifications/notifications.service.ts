import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly gateway: NotificationGateway,
    ) { }

    async create(dto: CreateNotificationDto) {
        const notification = await (this.prisma as any).notification.create({
            data: dto,
        });

        // Push real-time update
        this.gateway.sendToUser(dto.userId, notification);

        return notification;
    }

    async findByUserId(userId: string) {
        return (this.prisma as any).notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }

    async markAsRead(id: string) {
        return (this.prisma as any).notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async markAllAsRead(userId: string) {
        return (this.prisma as any).notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }

    async notifyRole(roleName: string, title: string, message: string, type: string = 'INFO') {
        const users = await (this.prisma as any).user.findMany({
            where: { roles: { some: { name: roleName } } },
            select: { id: true },
        });

        for (const user of users) {
            await this.create({
                userId: user.id,
                type,
                title,
                message,
            });
        }
    }

    async notifyDataChange(tenantId: string, domain: 'ORDERS' | 'INVENTORY' | 'PRODUCTS') {
        this.gateway.emitDataUpdate(tenantId, domain);
    }
}
