import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(req: any, createVehicleDto: CreateVehicleDto): Promise<{
        id: string;
        tenantId: string;
        type: string;
        plateNumber: string;
    }>;
    findAll(req: any): Promise<{
        id: string;
        tenantId: string;
        type: string;
        plateNumber: string;
    }[]>;
    remove(req: any, id: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        plateNumber: string;
    }>;
}
