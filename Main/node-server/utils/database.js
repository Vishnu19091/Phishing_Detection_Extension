const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  uri: process.env.SERVICE_URI,
});

async function fetchAllURLs() {
  const [rows] = await pool.execute("select * from urls");
  console.log(rows);
}

async function blocked_Domains() {
  const [rows] = await pool.execute("select * from blocked_domains");
  console.log(rows);
}

fetchAllURLs();

module.exports = pool;
