import pg from "pg";

export default new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB__NAME,
  password: process.env.DB_PW,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 4043,
});
