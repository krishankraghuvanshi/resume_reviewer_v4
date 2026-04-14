const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://localhost:5432/template1'
});
async function run() {
  try {
    await client.connect();
    await client.query('CREATE DATABASE resumereviewer');
    console.log('Database created successfully');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', err);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}
run();
