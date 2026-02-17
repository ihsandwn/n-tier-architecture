async function test() {
    console.log('Testing Register...');
    const registerRes = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test-' + Date.now() + '@example.com', password: 'password123' })
    });
    const regData = await registerRes.json();
    console.log('Register Status:', registerRes.status);
    console.log('Register Body:', regData);

    if (registerRes.status !== 201) return;

    console.log('Testing Login...');
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regData.access_token ? 'skip-relogin' : 'should-use-email-from-reg', password: 'password123' })
    });
    // Actually my register logic calls login internally and returns token, so regData might HAVE the token already.
    // AuthService.register returns this.login(user).
    if (regData.access_token) {
        console.log('Register already returned token!', regData.access_token.substring(0, 20) + '...');
    }
}
test();
