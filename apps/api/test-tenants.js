async function testTenants() {
    const timestamp = Date.now();
    const adminEmail = `admin-${timestamp}@example.com`;
    const userEmail = `user-${timestamp}@example.com`;
    const password = 'password123';

    console.log('--- Setup ---');

    // 1. Register Admin
    console.log(`Registering Admin: ${adminEmail}`);
    const adminReg = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password, roles: ['admin'] })
    });
    const adminData = await adminReg.json();
    const adminToken = adminData.access_token;
    console.log('Admin Access Token received.');

    // 2. Register Normal User
    console.log(`Registering User: ${userEmail}`);
    const userReg = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password })
    });
    const userData = await userReg.json();
    const userToken = userData.access_token;
    console.log('User Access Token received.');

    console.log('\n--- Testing Tenant Creation (POST /api/v1/tenants) ---');

    // 3. Create Tenant as User (Should Fail)
    console.log('Attempting to create tenant as USER...');
    const userCreate = await fetch('http://localhost:3000/api/v1/tenants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ name: 'User Tenant' })
    });
    console.log(`User Create Status: ${userCreate.status} (Expected 403)`);

    // 4. Create Tenant as Admin (Should Succeed)
    console.log('Attempting to create tenant as ADMIN...');
    const adminCreate = await fetch('http://localhost:3000/api/v1/tenants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ name: 'Admin Tenant', plan: 'pro' })
    });
    console.log(`Admin Create Status: ${adminCreate.status} (Expected 201)`);
    const newTenant = await adminCreate.json();
    console.log('Created Tenant:', newTenant);

    console.log('\n--- Testing Tenant Retrieval (GET /api/v1/tenants) ---');

    const tenantsList = await fetch('http://localhost:3000/api/v1/tenants', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const tenants = await tenantsList.json();
    console.log(`Admin retrieved ${tenants.length} tenants.`);
}

testTenants();
