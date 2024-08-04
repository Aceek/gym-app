// src/db.js
import dotenv from "dotenv";
import Pool from "pg";

dotenv.config();

const pool = new Pool.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const query = (text, params) => pool.query(text, params);

export { query };

export default pool;
