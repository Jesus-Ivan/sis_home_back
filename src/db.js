import { createPool } from "mysql2/promise";
import {
  DATABASE,
  DB_HOST,
  DB_PORT,
  DB_USER,
  USER_PASSWORD,
} from "./config.js";

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: USER_PASSWORD,
  port: DB_PORT,
  database: DATABASE,
});
