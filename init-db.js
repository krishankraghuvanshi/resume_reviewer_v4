require('dotenv').config({ path: '.env.backend' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function initDb() {
    // Parsing the connection string to connect to 'postgres' db first
    const dbUrl = process.env.DATABASE_URL;
    const urlParts = new URL(dbUrl);
    const targetDbName = urlParts.pathname.split('/')[1];

    // Connect to default 'postgres' database
    urlParts.pathname = '/postgres';
    const adminConnectionString = urlParts.toString();

    const client = new Client({
        connectionString: adminConnectionString
    });

    try {
        await client.connect();
        console.log(`Connected to postgres database to check for '${targetDbName}'...`);

        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDbName]);
        if (res.rowCount === 0) {
            console.log(`Database '${targetDbName}' does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${targetDbName}"`);
            console.log(`Database '${targetDbName}' created.`);
        } else {
            console.log(`Database '${targetDbName}' already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }

    // Now connect to the target database and run schema
    const { pool } = require('./backend-src/db');

    try {
        const schemaPath = path.join(__dirname, 'backend-src', 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema initialization...');
        await pool.query(schemaSql);
        console.log('Schema initialized successfully.');
    } catch (err) {
        console.error('Error initializing schema:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initDb();
