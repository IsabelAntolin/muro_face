const { Pool } = require('pg')

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'muro_facebook',
  password: '1234',
  min: 3,
  max: 6,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000,
  port: 5432
}
const pool = new Pool(config)

module.exports = pool;