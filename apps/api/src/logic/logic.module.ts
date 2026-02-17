import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { LogisticsModule } from './logistics/logistics.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
    imports: [DataModule, UsersModule, AuthModule, TenantsModule, WarehousesModule, ProductsModule, InventoryModule, OrdersModule, LogisticsModule, AnalyticsModule, NotificationsModule],
    providers: [],
    exports: [NotificationsModule],
})
export class LogicModule { }




