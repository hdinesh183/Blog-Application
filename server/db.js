const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306, // Added port support
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, // REQUIRED for Aiven MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Using promise wrapper for easier async/await usage
const db = pool.promise();

// Test the connection on startup to provide immediate feedback in logs
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('   Hint: Your database server is not reachable. Check if DB_HOST is correct.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Hint: Access denied. Check DB_USER and DB_PASSWORD.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   Hint: Database DOES NOT EXIST. Check DB_NAME.');
    }
  } else {
    console.log('✅ Connected to the database successfully.');
    connection.release();
  }
});

module.exports = db;
