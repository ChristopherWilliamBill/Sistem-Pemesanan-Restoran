////////////
// HEROKU //
////////////

// import { Pool } from "pg";

// let conn: any;

// if (!conn) {
//   conn = new Pool({
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     host: process.env.HOST,
//     port: process.env.PORT,
//     database: process.env.DATABASE,
//     ssl: {rejectUnauthorized: false }
//   });
// }

// export { conn };



///////////////
// LOCALHOST //
///////////////

import { Pool } from "pg";

let conn: any;

if (!conn) {
  conn = new Pool({
    user: 'christopher',
    host: 'localhost',
    port: 5432,
    database: 'christopher',
  });
}

export { conn };

