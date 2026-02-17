import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { DataModule } from '../../data/data.module';

@Module({
    imports: [DataModule],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService], // Export service in case other modules need it
})
export class OrdersModule { }
