import { Pool } from "pg";

let conn: any;

if (!conn) {
  conn = new Pool({
    user: "christopher",
    host: "localhost",
    port: 5432,
    database: "christopher",
  });
}

export { conn };