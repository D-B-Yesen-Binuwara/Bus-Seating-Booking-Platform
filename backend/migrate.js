import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const runMigration = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const migration = fs.readFileSync('./migration.sql', 'utf8');
  const statements = migration.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      console.log('Executing:', statement);
      await connection.query(statement);
    }
  }
  
  await connection.end();
  console.log('Migration completed');
};

runMigration().catch(console.error);