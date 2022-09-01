const { Router } = require('express')
const router = Router()
const { crear_mensaje, mostrarMensajes, updateLike } = require('../db/mensajes.js')
const { crear_comentario, mostrarComentarios } = require('../db/comentarios.js')

const moment = require('moment')

// ____________________________proteger tus rutas______________________________________________________ 
function protected_route(req, res, next) {
  if (!req.session.user) {
    req.flash('errors', 'Debe loguearse primero')
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user;
  // finalmente, seguimos el camino original
  next()
}

// ___________________________________________________________________________________
// funcion para dar formato a las fechas
const formatDate = (date) => {
  const dateFormat = moment(date).format("L");
  const timeFormat = moment(date).format("LTS");
  return `${dateFormat} ${timeFormat}`;

};

// _______________________________________

router.get('/', protected_route, async (req, res) => {
  let mensajes = await mostrarMensajes()
  let comentarios = await mostrarComentarios()


  mensajes = mensajes.map(m => {
    m.fecha_creacion = formatDate(m.fecha_creacion)
    return m
  })

  comentarios = comentarios.map(c => {
    c.fecha_creacion = formatDate(c.fecha_creacion)
    return c
  })

   let extension = mensajes.map(msj_extension =>{
    if(msj_extension.es_imagen == true){  
      const extension = msj_extension.mensaje.split('.')[1]
       msj_extension.extension = extension
    }
    return msj_extension
  })

  const obj = {
    mensajes,
    comentarios
  }
  // console.log(obj);
  res.render('index.html', { obj })

  // res.render('index.html', {user: req.session.user})
})

router.post('/crearMensaje', protected_route, async (req, res) => {
  const mensaje = req.body.mensaje
  const usuario_id = req.session.user.id

  await crear_mensaje(usuario_id, mensaje,false)

  res.redirect('/')
})

router.post('/crearImg', protected_route, async (req, res) => {
  const usuario_id = req.session.user.id
  const imagen = req.files.image
  const nombreImagen = imagen.name

  await imagen.mv(`public/uploaded/${nombreImagen}`)
  //agregar a la base
  await crear_mensaje(usuario_id, nombreImagen,true)
  res.redirect('/')
})

router.post('/crearComentario/:id', protected_route, async (req, res) => {
  const comentario = req.body.comentario
  const mensaje_id = req.params.id
  const usuario_id = req.session.user.id
  // const usuario_id = req.session.user.id
  await crear_comentario(mensaje_id, usuario_id, comentario)
  res.redirect('/')
})

router.get('/like/:id',protected_route,async (req,res)=>{
  const id = req.params.id
  await updateLike(id)
  //console.log('bgfdsa', id);
  res.json({})
})

router.get('*', (req, res) => {
  res.render('404.html')
})
module.exports = router;