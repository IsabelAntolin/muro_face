const { Router } = require('express')
const router = Router()
const { crear_mensaje, mostrarMensajes } = require ('../db/mensajes.js')
const { crear_comentario,mostrarComentarios } = require('../db/comentarios.js')


router.get('/', async(req, res) => {
  const mensajes = await mostrarMensajes() 
  const comentarios = await mostrarComentarios()
  const user =req.session.user
  const obj = {
    user,
    mensajes,
    comentarios
  }
  console.log(obj);
  res.render('index.html',{obj})

  // res.render('index.html', {user: req.session.user})
})

router.post('/crearMensaje',async (req, res) => {
  const mensaje = req.body.mensaje
  const usuario_id = req.session.user.id
  

  //agregar a la base
  await crear_mensaje(usuario_id,mensaje)
 
  res.redirect('/')
})
router.post('/crearComentario/:id',async (req,res)=>{
  const comentario = req.body.comentario
  const mensaje_id = req.params.id
  const usuario_id =req.session.user.id
 // const usuario_id = req.session.user.id
  await crear_comentario(mensaje_id,usuario_id,comentario)
  res.redirect('/')
})

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;