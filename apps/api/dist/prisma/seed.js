"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting comprehensive seeding...');
    const DEFAULT_TENANT_ID = '11111111-1111-1111-1111-111111111111';
    const tenant = await prisma.tenant.upsert({
        where: { id: DEFAULT_TENANT_ID },
        update: {},
        create: {
            id: DEFAULT_TENANT_ID,
            name: 'Omni Global Logistics',
            plan: 'enterprise',
        },
    });
    console.log(`✅ Tenant created: ${tenant.name}`);
    const passwordHash = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: passwordHash,
            roles: ['admin'],
            tenantId: tenant.id,
        },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
    const manager = await prisma.user.upsert({
        where: { email: 'manager@example.com' },
        update: {},
        create: {
            email: 'manager@example.com',
            password: passwordHash,
            roles: ['manager'],
            tenantId: tenant.id,
        },
    });
    console.log(`✅ Manager user created: ${manager.email}`);
    for (let i = 0; i < 5; i++) {
        const email = faker_1.faker.internet.email();
        await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                roles: ['user'],
                tenantId: tenant.id
            }
        });
    }
    console.log('✅ Created 5 random staff users');
    const warehousesData = [
        { name: 'JFK International Hub', location: 'New York, NY', lat: 40.6413, lng: -73.7781 },
        { name: 'LAX Distribution Center', location: 'Los Angeles, CA', lat: 33.9416, lng: -118.4085 },
        { name: 'O\'Hare Cargo Facility', location: 'Chicago, IL', lat: 41.9742, lng: -87.9073 },
        { name: 'George Bush Intercontinental', location: 'Houston, TX', lat: 29.9902, lng: -95.3368 },
        { name: 'Sky Harbor Logistics', location: 'Phoenix, AZ', lat: 33.4352, lng: -112.0101 }
    ];
    const warehouses = [];
    for (const w of warehousesData) {
        let warehouse = await prisma.warehouse.findFirst({
            where: { name: w.name, tenantId: tenant.id }
        });
        if (!warehouse) {
            warehouse = await prisma.warehouse.create({
                data: {
                    name: w.name,
                    location: w.location,
                    lat: w.lat,
                    lng: w.lng,
                    tenantId: tenant.id
                }
            });
        }
        warehouses.push(warehouse);
    }
    console.log(`✅ Created ${warehouses.length} warehouses`);
    const products = [];
    for (let i = 0; i < 50; i++) {
        const sku = faker_1.faker.commerce.isbn();
        let product = await prisma.product.findFirst({
            where: { sku, tenantId: tenant.id }
        });
        if (!product) {
            product = await prisma.product.create({
                data: {
                    name: faker_1.faker.commerce.productName(),
                    sku: sku,
                    description: faker_1.faker.commerce.productDescription(),
                    price: parseFloat(faker_1.faker.commerce.price()),
                    tenantId: tenant.id
                }
            });
        }
        products.push(product);
    }
    console.log(`✅ Created ${products.length} products`);
    console.log('🌱 Generating inventory and transactions...');
    for (const warehouse of warehouses) {
        for (const product of products) {
            if (Math.random() > 0.3) {
                const quantity = faker_1.faker.number.int({ min: 10, max: 500 });
                let inventory = await prisma.inventory.findUnique({
                    where: {
                        warehouseId_productId: {
                            warehouseId: warehouse.id,
                            productId: product.id
                        }
                    }
                });
                if (!inventory) {
                    inventory = await prisma.inventory.create({
                        data: {
                            productId: product.id,
                            warehouseId: warehouse.id,
                            quantity: quantity,
                            tenantId: tenant.id
                        }
                    });
                    await prisma.inventoryTransaction.create({
                        data: {
                            inventoryId: inventory.id,
                            type: 'IN',
                            quantity: quantity,
                            userId: admin.id,
                            tenantId: tenant.id,
                            createdAt: faker_1.faker.date.recent({ days: 30 })
                        }
                    });
                }
            }
        }
    }
    console.log('✅ Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map