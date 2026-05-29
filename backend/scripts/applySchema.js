const path = require('path');
const { runMigrations } = require('./migrationRunner');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const run = async () => {
  const result = await runMigrations({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'chatbot_db',
  });

  console.log('Schema applied successfully via SQL migrations.');
  console.log(`Newly applied migrations: ${result.newlyApplied}`);
};

run().catch(error => {
  console.error('Failed to apply schema:', error.message);
  process.exit(1);
});
