import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    create(req: any, createDriverDto: CreateDriverDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        license: string;
    }>;
    findAll(req: any): Promise<{
        id: string;
        tenantId: string;
        name: string;
        license: string;
    }[]>;
    remove(req: any, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        license: string;
    }>;
}
