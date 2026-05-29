const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

const toSha256 = value => {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
};

const getMigrationFiles = migrationsDir => {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter(fileName => fileName.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, 'en'));
};

const normalizeMysqlConfig = options => {
  return {
    host: options.host || '127.0.0.1',
    port: Number(options.port || 3306),
    user: options.user || 'root',
    password: options.password || '',
    database: options.database || 'chatbot_db',
  };
};

const createConnection = async options => {
  const mysqlConfig = normalizeMysqlConfig(options);

  const connection = await mysql.createConnection({
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    multipleStatements: true,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${mysqlConfig.database}\`
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;`
  );

  await connection.changeUser({ database: mysqlConfig.database });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      migration_name VARCHAR(255) NOT NULL,
      checksum CHAR(64) NOT NULL,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_schema_migrations_name (migration_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  return connection;
};

const getAppliedMigrations = async connection => {
  const [rows] = await connection.query(
    `SELECT migration_name, checksum, executed_at
     FROM schema_migrations
     ORDER BY migration_name ASC`
  );

  return rows;
};

const runMigrations = async options => {
  const migrationsDir =
    options.migrationsDir || path.resolve(__dirname, '../sql/migrations');

  const connection = await createConnection(options);
  try {
    const files = getMigrationFiles(migrationsDir);
    const applied = await getAppliedMigrations(connection);
    const appliedMap = new Map(
      applied.map(row => [row.migration_name, row.checksum])
    );

    let appliedCount = 0;

    for (const fileName of files) {
      const migrationPath = path.join(migrationsDir, fileName);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const checksum = toSha256(sql);

      if (appliedMap.has(fileName)) {
        const existingChecksum = appliedMap.get(fileName);
        if (existingChecksum !== checksum) {
          throw new Error(
            `Migration checksum mismatch for ${fileName}. Create a new migration instead of editing applied files.`
          );
        }
        continue;
      }

      await connection.query(sql);
      await connection.query(
        `INSERT INTO schema_migrations (migration_name, checksum)
         VALUES (?, ?)`,
        [fileName, checksum]
      );
      appliedCount += 1;
    }

    return {
      totalFiles: files.length,
      newlyApplied: appliedCount,
      alreadyApplied: files.length - appliedCount,
      migrationsDir,
    };
  } finally {
    await connection.end();
  }
};

const getMigrationStatus = async options => {
  const migrationsDir =
    options.migrationsDir || path.resolve(__dirname, '../sql/migrations');

  const connection = await createConnection(options);
  try {
    const files = getMigrationFiles(migrationsDir);
    const applied = await getAppliedMigrations(connection);
    const appliedByName = new Map(applied.map(row => [row.migration_name, row]));

    return files.map(fileName => {
      const appliedRecord = appliedByName.get(fileName);
      return {
        migration: fileName,
        status: appliedRecord ? 'applied' : 'pending',
        executedAt: appliedRecord ? appliedRecord.executed_at : null,
      };
    });
  } finally {
    await connection.end();
  }
};

module.exports = {
  runMigrations,
  getMigrationStatus,
};
