import { Module } from '@nestjs/common';
import { DataModule } from '../../data/data.module';
import { VehiclesService } from './vehicles/vehicles.service';
import { VehiclesController } from './vehicles/vehicles.controller';
import { DriversService } from './drivers/drivers.service';
import { DriversController } from './drivers/drivers.controller';
import { ShipmentsService } from './shipments/shipments.service';
import { ShipmentsController } from './shipments/shipments.controller';

@Module({
    imports: [DataModule],
    controllers: [VehiclesController, DriversController, ShipmentsController],
    providers: [VehiclesService, DriversService, ShipmentsService],
    exports: [VehiclesService, DriversService, ShipmentsService],
})
export class LogisticsModule { }
