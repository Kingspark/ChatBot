const path = require('path');
const dotenv = require('dotenv');
const { runMigrations, getMigrationStatus } = require('./migrationRunner');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const args = process.argv.slice(2);
const showStatus = args.includes('--status');

const options = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const main = async () => {
  if (showStatus) {
    const statusRows = await getMigrationStatus(options);
    if (statusRows.length === 0) {
      console.log('No SQL migrations found in backend/sql/migrations.');
      return;
    }

    console.table(statusRows);
    return;
  }

  const result = await runMigrations(options);
  console.log('Migration run completed.');
  console.log(`- Directory: ${result.migrationsDir}`);
  console.log(`- Total files: ${result.totalFiles}`);
  console.log(`- Newly applied: ${result.newlyApplied}`);
  console.log(`- Already applied: ${result.alreadyApplied}`);
};

main().catch(error => {
  console.error('Migration command failed:', error.message);
  process.exit(1);
});
