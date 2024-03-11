const passport = require('passport')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

// revisa si el usuario esta autenticado o no 
exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next()
    }

    // si no esta autenticado
    return res.redirect('/iniciar-sesion')
}

// Cerrar sesion
exports.cerrarSesion = (req, res, next) => {
    // Desloguear al usuario (metodo que provee passport)
    req.logout(req.user, err => {
        if (err) return next(err)

        // Redireccionar
        req.flash('exito', 'Cerraste sesión correctamente')
        res.redirect('/iniciar-sesion')
        next()
    })
}