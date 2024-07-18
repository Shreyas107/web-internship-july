const mysql = require("mysql2");
const config = require("./config");

// Creatng the connection pool.
const pool = mysql.createPool({
  host: "localhost",
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections,
  idleTimeout: 60000, // idle connections timeout,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = pool;
