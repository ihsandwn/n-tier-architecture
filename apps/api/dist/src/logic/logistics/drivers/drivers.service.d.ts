import { PrismaService } from '../../../data/prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
export declare class DriversService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createDriverDto: CreateDriverDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        license: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        license: string;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        license: string;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        license: string;
    }>;
}
