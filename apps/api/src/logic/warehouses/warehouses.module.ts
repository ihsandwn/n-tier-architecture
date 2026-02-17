import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { DataModule } from '../../data/data.module';

@Module({
    imports: [DataModule],
    controllers: [WarehousesController],
    providers: [WarehousesService],
    exports: [WarehousesService],
})
export class WarehousesModule { }
