// backend/config/db.js
// This file sets up the connection to Azure SQL Database using the mssql package

require('dotenv').config(); // Load environment variables from .env file
const sql = require('mssql');

// Debug missing environment variables
// if (!process.env.DB_SERVER) console.error("❌ Missing DB_SERVER in .env file");
// if (!process.env.DB_USER) console.error("❌ Missing DB_USER in .env file");
// if (!process.env.DB_PASSWORD) console.error("❌ Missing DB_PASSWORD in .env file");
// if (!process.env.DB_DATABASE) console.error("❌ Missing DB_DATABASE in .env file");

// Azure SQL configuration using environment variables
const config = {
 user: process.env.AZURE_SQL_USERNAME,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: false,
  },
};

// Create a connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to Azure SQL Database');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
