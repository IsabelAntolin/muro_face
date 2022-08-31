const pool = require('./conexion.js')

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
      fecha_actualizacion timestamp default now(),
      contador_like int  not null default 0
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

const mostrarMensajes = async()=>{
  const client = await pool.connect()
  const resp = await client.query({
    text:`select mensajes.id ,(firstname || ' ' || lastname) AS name,mensaje,fecha_creacion,contador_like from mensajes inner join usuarios on usuario_id=usuarios.id order by fecha_creacion desc;`,
    //rowMode:'array'
    
  })
  client.release()
  return resp.rows
}

const updateLike = async(id)=>{
  const client = await pool.connect()
  const resp = await client.query({
    text:`select * from mensajes where id=$1`,
    values:[id]
  })
  let likes = resp.rows[0].contador_like
  likes ++
  
  await client.query({
    text:`update mensajes set contador_like=${likes} where id=${id}`
  })
  
  console.log(likes);
}

module.exports = {updateLike,mostrarMensajes, crear_mensaje}