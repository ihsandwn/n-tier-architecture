import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
export declare class WarehousesController {
    private readonly warehousesService;
    constructor(warehousesService: WarehousesService);
    create(createWarehouseDto: CreateWarehouseDto): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        lat: number | null;
        lng: number | null;
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
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        lat: number | null;
        lng: number | null;
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
            tenantId: string | null;
            updatedAt: Date;
            quantity: number;
            warehouseId: string;
            productId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        lat: number | null;
        lng: number | null;
        capacity: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateWarehouseDto: UpdateWarehouseDto): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        lat: number | null;
        lng: number | null;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        lat: number | null;
        lng: number | null;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
