const { Router } = require('express')
const router = Router()
const { crear_mensaje } = require ('../db/mensaje.js')
const { crear_comentario } = require('../db/comentario.js')



router.get('/', (req, res) => {
  res.render('index.html', {user: req.session.user})
})

router.get('/dos', (req, res) => {
  res.render('dos.html', {user: req.session.user})
})

router.get('/tres', (req, res) => {
  res.render('tres.html', {user: req.session.user})
})

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;