import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        description: string | null;
        price: number;
    }>;
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
        sku: string;
        description: string | null;
        price: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ProductClient<({
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
        sku: string;
        description: string | null;
        price: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateProductDto: UpdateProductDto): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        description: string | null;
        price: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        description: string | null;
        price: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
