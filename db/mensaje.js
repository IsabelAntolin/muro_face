const pool = require('./pool.js')

async function create_table () {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()
  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists mensajes (
      id serial primary key,
      usuario_id int not null references usuarios(id),
      mensaje text not null,
      fecha_creacion timestamp default now(),
      fecha_actualizacion timestamp default now()
    )
  `)

  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()


async function crear_mensaje( usuario_id, mensaje){
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(
    `insert into mensajes (usuario_id, mensaje) values ($1, $2)`,
    [usuario_id, mensaje]
  )

  // 3. Devuelvo el cliente al pool
  client.release()
}

module.exports = {crear_mensaje}