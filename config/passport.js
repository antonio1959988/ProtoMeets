const passport = require('passport')
const LocalStrategy = require('passport-local')
const Usuarios = require('../models/Usuarios')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async(email, password, next) => {
    // Codigo se ejecuta al llenar el formulario
    const usuario = await Usuarios.findOne({
        where: {email, activo: 1}
    })

    // Revisar si existe o no 
    if(!usuario) return next(null, false, {
        message: 'Ese usuario no existe o no ha sido confirmado'
    })

    // El usuario existe, comparar su password
    const verificarPass = usuario.validarPassword(password)

    // Si el password es incorrecto
    if(!verificarPass) return next(null, false, {
        message: 'Password Incorrecto'
    })

    // Todo bien
    return next(null, usuario)
}


))

passport.serializeUser(function(usuario, cb) {
    cb(null, usuario)
})

passport.deserializeUser(function(usuario, cb) {
    cb(null, usuario)
})

module.exports = passport