import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService
    ) { }

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

    async remove(id: string, tenantId: string) {
        return this.prisma.product.delete({
            where: { id, tenantId },
        });
    }

    async importProducts(tenantId: string, products: any[]) {
        const results = await this.prisma.$transaction(async (tx) => {
            const imported = [];
            for (const item of products) {
                const product = await tx.product.upsert({
                    where: {
                        tenantId_sku: {
                            tenantId,
                            sku: item.sku,
                        },
                    },
                    update: {
                        name: item.name,
                        description: item.description,
                        price: parseFloat(item.price) || 0,
                    },
                    create: {
                        sku: item.sku,
                        name: item.name,
                        description: item.description,
                        price: parseFloat(item.price) || 0,
                        tenantId,
                    },
                });
                imported.push(product);
            }
            return imported;
        });

        // Trigger real-time update
        this.notificationsService.notifyDataChange(tenantId, 'PRODUCTS');

        return results;
    }
}
