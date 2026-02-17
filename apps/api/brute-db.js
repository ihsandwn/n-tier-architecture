const { Client } = require('pg');

const creds = [
    { user: 'postgres', password: '12345', db: 'pwa' }
];

async function test() {
    for (const c of creds) {
        console.log(`Testing ${c.user}:${c.password}@${c.db}...`);
        const client = new Client({
            user: c.user,
            host: '127.0.0.1',
            database: c.db,
            password: c.password,
            port: 5432,
        });
        try {
            await client.connect();
            console.log('SUCCESS!');
            await client.end();
            return;
        } catch (e) {
            console.log('Failed:', e.message);
            await client.end();
        }
    }
}

test();
