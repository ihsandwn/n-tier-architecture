async function testRBAC() {
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
    if (adminReg.status !== 201) {
        console.error('Failed to register admin:', adminData);
        return;
    }
    const adminToken = adminData.access_token;
    console.log('Admin Registered & Access Token received.');

    // 2. Register Normal User
    console.log(`Registering User: ${userEmail}`);
    const userReg = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password, roles: ['user'] }) // Explicitly user, but default is user anyway
    });
    const userData = await userReg.json();
    if (userReg.status !== 201) {
        console.error('Failed to register user:', userData);
        return;
    }
    const userToken = userData.access_token;
    console.log('User Registered & Access Token received.');

    console.log('\n--- Testing Protection (GET /api/v1/users) ---');

    // 3. Test Access as User (Should Fail)
    console.log('Attempting access as NORMAL USER...');
    const userAccess = await fetch('http://localhost:3000/api/v1/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    console.log(`User Access Status: ${userAccess.status} (Expected 403)`);
    if (userAccess.status === 403) {
        console.log('PASSED: User was denied access.');
    } else {
        console.error('FAILED: User was NOT denied access properly.');
    }

    // 4. Test Access as Admin (Should Succeed)
    console.log('Attempting access as ADMIN...');
    const adminAccess = await fetch('http://localhost:3000/api/v1/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log(`Admin Access Status: ${adminAccess.status} (Expected 200)`);
    if (adminAccess.status === 200) {
        console.log('PASSED: Admin was granted access.');
        const users = await adminAccess.json();
        console.log(`Admin retrieved ${users.length} users.`);
    } else {
        console.error('FAILED: Admin was denied access.');
        console.log(await adminAccess.text());
    }
}

testRBAC();
