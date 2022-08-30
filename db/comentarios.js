const pool = require('./conexion.js')

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

async function crear_comentario( mensaje_id, usuario_id,comentario){
  const client = await pool.connect()
  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(
    `insert into comentarios(mensaje_id,usuario_id,comentario) values ($1, $2, $3)`,
    [mensaje_id,usuario_id, comentario]  )
  // 3. Devuelvo el cliente al pool
  client.release()
}
const mostrarComentarios = async()=>{
 const client = await pool.connect()
 const resp = await client.query({
  text:`select comentarios.id ,(firstname || ' ' || lastname) AS name,comentario,comentarios.fecha_creacion,mensaje_id from comentarios inner join usuarios on usuario_id=usuarios.id inner join mensajes on mensajes.id=mensaje_id order by comentarios.fecha_creacion;`
 })

 client.release()
 return resp.rows
}

module.exports = {mostrarComentarios, crear_comentario}