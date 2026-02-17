import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DataModule } from '../../data/data.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [DataModule, NotificationsModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }
