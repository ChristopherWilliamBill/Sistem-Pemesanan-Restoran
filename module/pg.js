//////////
///HEROKU //
//////////

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
/// LOCALHOST //
///////////////

import { Pool } from "pg";

let conn = null;

if (!conn) {
  conn = new Pool({
    user: 'christopher',
    host: 'localhost',
    port: 5432,
    database: 'christopher',
  });
}

export { conn };




// ELEPHANTSQL
// import { Pool } from "pg";

// let conn = null;

// if (!conn) {
//   conn = new Pool({
//     user: 'solccbfc',
//     password: 'AmR3_-TwiY3BJszEUJPq3ifG1t7QfEC9',
//     host: 'rosie.db.elephantsql.com',
//     port: 5432,
//     database: 'solccbfc',
//   });
// }

// export { conn };
