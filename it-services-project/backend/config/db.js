const { Pool } = require("pg");
require("dotenv").config();

// DATABASE_URL from .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Exporting a query function that uses the pool
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Exporting the pool itself if I ever need direct access
};
