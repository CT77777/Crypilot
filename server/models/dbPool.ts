import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.RDS_MYSQL_HOST || process.env.MYSQL_HOST,
  user: process.env.RDS_MYSQL_USER || process.env.MYSQL_USER,
  password: process.env.RDS_MYSQL_PASSWORD || process.env.MYSQL_PASSWORD,
  database: process.env.RDS_MYSQL_DATABASE || process.env.MYSQL_DATABASE,
});

export default pool;
