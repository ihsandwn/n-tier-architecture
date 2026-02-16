async function testLogistics() {
    const timestamp = Date.now();
    const adminEmail = `admin-logistics-${timestamp}@example.com`;
    const password = 'password123';
    const baseUrl = 'http://localhost:3000/api/v1';

    console.log('--- Setup ---');

    // 1. Register Admin
    console.log(`Registering Admin: ${adminEmail}`);
    const adminReg = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password, roles: ['admin'] })
    });
    const adminData = await adminReg.json();
    const token = adminData.access_token;
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    console.log('Admin Access Token received.');

    // 2. Create Tenant
    console.log('\n--- 2. Create Tenant ---');
    const tenantRes = await fetch(`${baseUrl}/tenants`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: 'Logistics Corp', plan: 'enterprise' })
    });
    const tenant = await tenantRes.json();
    console.log('Created Tenant:', tenant.id, tenant.name);

    // 3. Create Warehouse
    console.log('\n--- 3. Create Warehouse ---');
    const whRes = await fetch(`${baseUrl}/warehouses`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
            name: 'Main Hub',
            location: 'New York',
            tenantId: tenant.id
        })
    });
    const warehouse = await whRes.json();
    console.log('Created Warehouse:', warehouse.id, warehouse.name);

    // 4. Create Product
    console.log('\n--- 4. Create Product ---');
    const prodRes = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
            sku: `SKU-${timestamp}`,
            name: 'Super Gadget',
            tenantId: tenant.id
        })
    });
    const product = await prodRes.json();
    console.log('Created Product:', product.id, product.sku);

    // 5. Add Inventory (Stock)
    console.log('\n--- 5. Add Inventory ---');
    const stockRes = await fetch(`${baseUrl}/inventory/stock`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
            warehouseId: warehouse.id,
            productId: product.id,
            quantity: 100
        })
    });
    const stock = await stockRes.json();
    console.log('Stock Updated:', stock.quantity);

    // 6. Verify Inventory
    console.log('\n--- 6. Verify Inventory ---');
    const verifyRes = await fetch(`${baseUrl}/inventory/warehouse/${warehouse.id}`, {
        headers: authHeaders
    });
    const inventoryList = await verifyRes.json();
    const item = inventoryList.find(i => i.productId === product.id);

    if (item && item.quantity === 100) {
        console.log('PASSED: Inventory correct.');
    } else {
        console.error('FAILED: Inventory mismatch.', item);
    }
}

testLogistics();
