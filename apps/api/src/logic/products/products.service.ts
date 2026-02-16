import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        // Check if SKU exists for this tenant
        const existing = await this.prisma.product.findUnique({
            where: {
                tenantId_sku: {
                    tenantId: createProductDto.tenantId,
                    sku: createProductDto.sku,
                },
            },
        });

        if (existing) {
            throw new ConflictException('SKU already exists for this tenant');
        }

        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    findAll() {
        return this.prisma.product.findMany({
            include: {
                tenant: true,
            },
        });
    }

    findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                tenant: true,
                inventory: true,
            },
        });
    }

    update(id: string, updateProductDto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    remove(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
