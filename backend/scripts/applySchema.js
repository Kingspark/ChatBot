const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const run = async () => {
  const sqlPath = path.resolve(__dirname, '../sql/schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log('Schema applied successfully.');
  } finally {
    await connection.end();
  }
};

run().catch(error => {
  console.error('Failed to apply schema:', error.message);
  process.exit(1);
});
