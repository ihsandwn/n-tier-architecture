import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
export declare class WarehousesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createWarehouseDto: CreateWarehouseDto): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        tenant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            plan: string;
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        capacity: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__WarehouseClient<({
        tenant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            plan: string;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
            warehouseId: string;
            quantity: number;
        }[];
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        capacity: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateWarehouseDto: UpdateWarehouseDto): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
