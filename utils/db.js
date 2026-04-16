import mysql from "mysql2/promise";

let pool;

function parseBoolean(value) {
  return String(value).toLowerCase() === "true";
}

export function isDbConfigured() {
  return Boolean(
    process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_NAME &&
      process.env.DB_PORT,
  );
}

export function getDb() {
  if (!isDbConfigured()) {
    throw new Error("Database environment variables are not configured.");
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: parseBoolean(process.env.DB_SSL)
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  return pool;
}
