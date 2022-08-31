const express = require('express');
const session = require('express-session');
const nunjucks = require('nunjucks')
const path = require('path')
const flash = require('connect-flash')
const pool = require('./db/conexion.js')
const pgSession = require('connect-pg-simple')(session)

const app = express()

//configurar uso de sesiones para que dure mas tiempo y no tener que loguearse a cada rato que modificamos el programa
app.use(session({
  store: new pgSession({
    pool: pool
  }),
  secret: 'hmit',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}))


// se configura uso de sesiones
// app.use(session({secret: 'hmit'}))

// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('./public'))

// se configura nunjucks
nunjucks.configure(path.resolve(__dirname, "templates"), {
  express: app,
  autoscape: true,
  noCache: true,
  watch: true,
});

// se configura uso de formularios
app.use(express.urlencoded({extended: true}))

// se configura uso de mensajes flash
app.use(flash())

// se traen las rutas
app.use(require('./routes/auth'))
app.use(require('./routes/routes'))


app.listen(3000, () => {
  console.log(`Servidor en puerto http://localhost:3000/`);
})





