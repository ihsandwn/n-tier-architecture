const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'pwa',
    password: '12345',
    port: 5432,
});

console.log('Connecting to DB...');
client.connect()
    .then(() => {
        console.log('Connected successfully!');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('Result:', res.rows[0]);
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        client.end();
    });
