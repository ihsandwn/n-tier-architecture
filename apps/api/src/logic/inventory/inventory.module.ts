import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { DataModule } from '../../data/data.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [DataModule, NotificationsModule],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService],
})
export class InventoryModule { }
