"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('--- Debugging Data State ---');
    console.log('\n1. Checking Users...');
    const users = await prisma.user.findMany({ take: 5, include: { tenant: true } });
    console.log(`Found ${users.length} users.`);
    users.forEach(u => console.log(` - ${u.email} (ID: ${u.id}, Tenant: ${u.tenantId})`));
    console.log('\n2. Checking Products...');
    const products = await prisma.product.findMany({ take: 5 });
    console.log(`Found ${products.length} products.`);
    products.forEach(p => console.log(` - ${p.name} (ID: ${p.id}, Tenant: ${p.tenantId})`));
    console.log('\n3. Checking Inventory...');
    const inventory = await prisma.inventory.findMany({ take: 5, include: { product: true, warehouse: true } });
    console.log(`Found ${inventory.length} inventory records.`);
    inventory.forEach(i => console.log(` - Product: ${i.product.name}, Qty: ${i.quantity}, Warehouse: ${i.warehouse.name} (ID: ${i.id})`));
    if (products.length > 0) {
        const productId = products[0].id;
        const tenantId = products[0].tenantId;
        console.log(`\n4. Simulating Order Query for Product: ${products[0].name}...`);
        const stock = await prisma.inventory.findMany({
            where: {
                productId: productId,
                quantity: { gte: 1 },
                product: { tenantId: tenantId }
            },
            include: { product: true }
        });
        console.log(`Found ${stock.length} matching inventory records for order.`);
    }
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=debug-data.js.map