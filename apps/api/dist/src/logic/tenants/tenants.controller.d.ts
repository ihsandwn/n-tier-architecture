import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): import("@prisma/client").Prisma.Prisma__TenantClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        plan: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        plan: string;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__TenantClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        plan: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateTenantDto: UpdateTenantDto): import("@prisma/client").Prisma.Prisma__TenantClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        plan: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__TenantClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        plan: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
