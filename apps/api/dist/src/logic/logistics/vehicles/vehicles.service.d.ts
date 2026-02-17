import { PrismaService } from '../../../data/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehiclesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createVehicleDto: CreateVehicleDto): Promise<{
        id: string;
        tenantId: string;
        type: string;
        plateNumber: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        plateNumber: string;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        plateNumber: string;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        plateNumber: string;
    }>;
}
