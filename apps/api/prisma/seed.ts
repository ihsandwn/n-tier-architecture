import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive seeding...');

    // 0. Clean up existing data (optional, but good for reset)
    // await prisma.transaction.deleteMany();
    // await prisma.inventory.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.warehouse.deleteMany();
    // await prisma.user.deleteMany();
    // await prisma.tenant.deleteMany();

    // 1. Create Default Tenant
    // Use a fixed valid UUID for the default tenant to ensure consistency
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

    // 2. Create Users
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

    // Create 5 Staff Users
    for (let i = 0; i < 5; i++) {
        const email = faker.internet.email();
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

    // 3. Create Warehouses (Real Locations for Maps)
    const warehousesData = [
        { name: 'JFK International Hub', location: 'New York, NY', lat: 40.6413, lng: -73.7781 },
        { name: 'LAX Distribution Center', location: 'Los Angeles, CA', lat: 33.9416, lng: -118.4085 },
        { name: 'O\'Hare Cargo Facility', location: 'Chicago, IL', lat: 41.9742, lng: -87.9073 },
        { name: 'George Bush Intercontinental', location: 'Houston, TX', lat: 29.9902, lng: -95.3368 },
        { name: 'Sky Harbor Logistics', location: 'Phoenix, AZ', lat: 33.4352, lng: -112.0101 }
    ];

    const warehouses = [];
    for (const w of warehousesData) {
        // Since we can't use name as ID anymore (must be UUID), we'll rely on auto-generation
        // We use findFirst to avoid duplicates if re-running
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

    // 4. Create Products
    const products = [];
    for (let i = 0; i < 50; i++) {
        // Products have a unique constraint on [tenantId, sku]
        const sku = faker.commerce.isbn();

        let product = await prisma.product.findFirst({
            where: { sku, tenantId: tenant.id }
        });

        if (!product) {
            product = await prisma.product.create({
                data: {
                    name: faker.commerce.productName(),
                    sku: sku,
                    description: faker.commerce.productDescription(),
                    price: parseFloat(faker.commerce.price()),
                    tenantId: tenant.id
                }
            });
        }
        products.push(product);
    }
    console.log(`✅ Created ${products.length} products`);

    // 5. Create Inventory & Transactions
    console.log('🌱 Generating inventory and transactions...');
    for (const warehouse of warehouses) {
        for (const product of products) {
            // Randomly assign inventory
            if (Math.random() > 0.3) {
                const quantity = faker.number.int({ min: 10, max: 500 });

                // Check if inventory exists
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

                    // Create initial transaction log
                    await prisma.inventoryTransaction.create({
                        data: {
                            inventoryId: inventory.id,
                            type: 'IN',
                            quantity: quantity,
                            userId: admin.id,
                            tenantId: tenant.id,
                            createdAt: faker.date.recent({ days: 30 })
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
