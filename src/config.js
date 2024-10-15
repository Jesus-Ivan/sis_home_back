import { config } from "dotenv";

config();

export const API_PORT = process.env.API_PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER || "root";
export const USER_PASSWORD = process.env.USER_PASSWORD || "";
export const DATABASE = process.env.DATABASE || "test";
