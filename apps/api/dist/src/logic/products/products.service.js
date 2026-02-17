"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../data/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ProductsService = class ProductsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createProductDto) {
        const existing = await this.prisma.product.findUnique({
            where: {
                tenantId_sku: {
                    tenantId: createProductDto.tenantId,
                    sku: createProductDto.sku,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('SKU already exists for this tenant');
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
    findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                tenant: true,
                inventory: true,
            },
        });
    }
    update(id, updateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }
    async remove(id, tenantId) {
        return this.prisma.product.delete({
            where: { id, tenantId },
        });
    }
    async importProducts(tenantId, products) {
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
        this.notificationsService.notifyDataChange(tenantId, 'PRODUCTS');
        return results;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map