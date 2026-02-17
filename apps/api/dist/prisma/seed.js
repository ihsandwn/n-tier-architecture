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
    await prisma.shipment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryTransaction.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.driver.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
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
    const permissionNames = [
        'users:read', 'users:write', 'users:delete',
        'roles:read', 'roles:write', 'roles:delete',
        'inventory:read', 'inventory:write', 'inventory:adjust',
        'analytics:read',
        'warehouses:read', 'warehouses:write',
        'products:read', 'products:write',
        'orders:read', 'orders:write', 'orders:delete',
        'fleet:read', 'fleet:write', 'fleet:delete',
        'tenants:read', 'tenants:write'
    ];
    const permissions = [];
    for (const name of permissionNames) {
        const p = await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name, description: `Can ${name.replace(':', ' ')}` }
        });
        permissions.push(p);
    }
    console.log(`✅ Created ${permissions.length} permissions`);
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {
            permissions: { set: permissions.map(p => ({ id: p.id })) }
        },
        create: {
            name: 'admin',
            description: 'System Administrator with full access',
            permissions: { connect: permissions.map(p => ({ id: p.id })) }
        }
    });
    const managerRole = await prisma.role.upsert({
        where: { name: 'manager' },
        update: {
            permissions: {
                set: permissions
                    .filter(p => p.name.startsWith('inventory') || p.name.startsWith('products') || p.name.startsWith('analytics') || p.name === 'warehouses:read')
                    .map(p => ({ id: p.id }))
            }
        },
        create: {
            name: 'manager',
            description: 'Operations Manager',
            permissions: {
                connect: permissions
                    .filter(p => p.name.startsWith('inventory') || p.name.startsWith('products') || p.name.startsWith('analytics') || p.name === 'warehouses:read')
                    .map(p => ({ id: p.id }))
            }
        }
    });
    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {
            permissions: {
                set: permissions
                    .filter(p => p.name.endsWith(':read'))
                    .map(p => ({ id: p.id }))
            }
        },
        create: {
            name: 'user',
            description: 'Standard User with read-only access',
            permissions: {
                connect: permissions
                    .filter(p => p.name.endsWith(':read'))
                    .map(p => ({ id: p.id }))
            }
        }
    });
    console.log('✅ Created default roles (admin, manager, user)');
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            name: 'System Admin',
            phone: '+1234567890',
            roles: { set: [{ id: adminRole.id }] }
        },
        create: {
            email: 'admin@example.com',
            password: passwordHash,
            name: 'System Admin',
            phone: '+1234567890',
            tenantId: tenant.id,
            roles: { connect: [{ id: adminRole.id }] }
        },
    });
    console.log(`✅ Admin user created: ${adminUser.email}`);
    const managerUser = await prisma.user.upsert({
        where: { email: 'manager@example.com' },
        update: {
            name: 'Operations Manager',
            phone: '+1987654321',
            roles: { set: [{ id: managerRole.id }] }
        },
        create: {
            email: 'manager@example.com',
            password: passwordHash,
            name: 'Operations Manager',
            phone: '+1987654321',
            tenantId: tenant.id,
            roles: { connect: [{ id: managerRole.id }] }
        },
    });
    console.log(`✅ Manager user created: ${managerUser.email}`);
    for (let i = 0; i < 5; i++) {
        const firstName = faker_1.faker.person.firstName();
        const lastName = faker_1.faker.person.lastName();
        const email = faker_1.faker.internet.email({ firstName, lastName });
        await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                name: `${firstName} ${lastName}`,
                phone: faker_1.faker.phone.number(),
                tenantId: tenant.id,
                roles: { connect: [{ id: userRole.id }] }
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
    console.log('🌱 Generating initial inventory...');
    for (const warehouse of warehouses) {
        for (const product of products) {
            if (Math.random() > 0.3) {
                const quantity = faker_1.faker.number.int({ min: 50, max: 1000 });
                const inventory = await prisma.inventory.create({
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
                        userId: adminUser.id,
                        tenantId: tenant.id,
                        note: 'Initial stock seeding',
                        createdAt: faker_1.faker.date.recent({ days: 30 })
                    }
                });
            }
        }
    }
    console.log('✅ Initial inventory and transactions created');
    const vehicleTypes = ['Truck', 'Van', 'Bike'];
    const vehicles = [];
    for (let i = 0; i < 10; i++) {
        const type = faker_1.faker.helpers.arrayElement(vehicleTypes);
        const vehicle = await prisma.vehicle.create({
            data: {
                plateNumber: `${faker_1.faker.string.alpha({ length: 2, casing: 'upper' })} ${faker_1.faker.number.int({ min: 1000, max: 9999 })} ${faker_1.faker.string.alpha({ length: 2, casing: 'upper' })}`,
                type: type.toLowerCase(),
                tenantId: tenant.id
            }
        });
        vehicles.push(vehicle);
    }
    console.log(`✅ Created ${vehicles.length} vehicles`);
    const drivers = [];
    for (let i = 0; i < 15; i++) {
        const driver = await prisma.driver.create({
            data: {
                name: faker_1.faker.person.fullName(),
                license: faker_1.faker.string.alphanumeric({ length: 10, casing: 'upper' }),
                tenantId: tenant.id
            }
        });
        drivers.push(driver);
    }
    console.log(`✅ Created ${drivers.length} drivers`);
    console.log('🌱 Generating orders and shipments...');
    for (let i = 0; i < 30; i++) {
        const status = faker_1.faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']);
        const order = await prisma.order.create({
            data: {
                customerName: faker_1.faker.person.fullName(),
                status: status,
                tenantId: tenant.id,
                items: {
                    create: Array.from({ length: faker_1.faker.number.int({ min: 1, max: 5 }) }).map(() => ({
                        productId: faker_1.faker.helpers.arrayElement(products).id,
                        quantity: faker_1.faker.number.int({ min: 1, max: 10 })
                    }))
                }
            },
            include: { items: true }
        });
        if (['shipped', 'delivered'].includes(status)) {
            const shipment = await prisma.shipment.create({
                data: {
                    trackingNumber: `TRK${faker_1.faker.string.numeric(10)}`,
                    status: status === 'delivered' ? 'delivered' : 'in_transit',
                    orderId: order.id,
                    vehicleId: faker_1.faker.helpers.arrayElement(vehicles).id,
                    driverId: faker_1.faker.helpers.arrayElement(drivers).id
                }
            });
            for (const item of order.items) {
                const inventory = await prisma.inventory.findFirst({
                    where: { productId: item.productId, tenantId: tenant.id }
                });
                if (inventory) {
                    await prisma.inventoryTransaction.create({
                        data: {
                            inventoryId: inventory.id,
                            type: 'OUT',
                            quantity: item.quantity,
                            userId: adminUser.id,
                            tenantId: tenant.id,
                            note: `Order ${order.id.slice(0, 8)} shipment`,
                            createdAt: order.createdAt
                        }
                    });
                    await prisma.inventory.update({
                        where: { id: inventory.id },
                        data: { quantity: { decrement: item.quantity } }
                    });
                }
            }
        }
    }
    console.log('🌱 Seeding mock notifications...');
    const notificationData = [
        { title: 'System Updated', message: 'N-Tier Architecture core modules have been refreshed.', type: 'SUCCESS' },
        { title: 'Inventory Alert', message: 'SKU #8821 is running low in JFK Hub.', type: 'WARNING' },
        { title: 'New Security Rule', message: 'Admin protection logic is now active.', type: 'INFO' },
        { title: 'Database Backup', message: 'Nightly backup completed successfully.', type: 'SUCCESS' }
    ];
    for (const notif of notificationData) {
        await prisma.notification.create({
            data: {
                userId: adminUser.id,
                ...notif,
                createdAt: faker_1.faker.date.recent({ days: 7 })
            }
        });
    }
    await prisma.notification.create({
        data: {
            userId: managerUser.id,
            title: 'Welcome Manager',
            message: 'You now have access to the Inventory Dashboard.',
            type: 'SUCCESS'
        }
    });
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