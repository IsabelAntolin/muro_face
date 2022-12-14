const pool = require('./conexion.js')

async function create_table () {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists usuarios (
      id serial primary key,
      firstName varchar(255) not null,
      lastName varchar(255) not null,
      email varchar(255) not null unique,
      password varchar(255) not null
    )
  `)

  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()


async function get_user (email) {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  const  {rows}  = await client.query(
    `select * from usuarios where email=$1`,
    [email]
  )

  // 3. Devuelvo el cliente al pool
  client.release()

  // 4. retorno el primer usuario, en caso de que exista
  return rows[0]
}

async function create_user (name, lastName,email, password) {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(
    `insert into usuarios (firstName, lastName ,email, password) values ($1, $2, $3,$4)`,
    [name, lastName ,email, password]
  )

  // 3. Devuelvo el cliente al pool
  client.release()
}

module.exports = { get_user, create_user }

