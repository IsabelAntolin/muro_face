const pool = require('./pool.js')

async function create_table () {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists comentarios(
      id serial primary key,
      mensaje_id int not null references mensajes(id),
      usuario_id int not null references usuarios(id),
      comentario text not null,
      fecha_creacion timestamp default now(),
      fecha_actualizacion timestamp default now()
    )
  `)

  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()

async function crear_comentario( usuario_id, mensaje_id, comentario){
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(
    `insert into comentarios(usuario_id, mensaje_id, comentario) values ($1, $2, $3)`,
    [usuario_id, mensaje_id, comentario]
  )

  // 3. Devuelvo el cliente al pool
  client.release()
}

module.exports = {crear_comentario}