import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from './notifications.gateway';
import { PrismaService } from '../../data/prisma/prisma.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    providers: [NotificationsService, NotificationGateway, PrismaService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
