import { Pool } from "pg";

let conn: any;

if (!conn) {
  conn = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
  });
}

export { conn };
