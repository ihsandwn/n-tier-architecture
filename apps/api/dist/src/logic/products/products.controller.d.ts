import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        tenant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            plan: string;
        };
    } & {
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ProductClient<({
        tenant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
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
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateProductDto: UpdateProductDto): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
    }>;
    import(body: {
        tenantId: string;
        products: any[];
    }): Promise<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
    }[]>;
}
