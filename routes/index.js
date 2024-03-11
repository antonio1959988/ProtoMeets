const express = require('express')


const homeController = require('../controllers/homeController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const gruposController = require('../controllers/gruposController')
const eventosController = require('../controllers/eventosController')
const eventosControllerFE = require('../controllers/frontend/eventosControllerFE')
const usuariosControllerFE = require('../controllers/frontend/usuariosControllerFE')
const gruposControllerFE = require('../controllers/frontend/gruposControllerFE')
const comentariosControllerFE = require('../controllers/frontend/comentariosControllerFE')
const busquedaControllerFE = require('../controllers/frontend/busquedaControllerFE')

const router = express.Router()

module.exports = function() {

    /////////////// AREA PUBLICA (FRONT) ///////////////////////////////

    router.get('/', homeController.home)

    // Muestra un evento
    router.get('/evento/:slug', eventosControllerFE.mostrarEvento)

    // Confirma asistencia a evento
    router.post('/confirmar-asistencia/:slug', eventosControllerFE.confirmarAsistencia)

    // Muestra asistentes al evento
    router.get('/asistentes/:slug', eventosControllerFE.mostrarAsistentes)

    // agrega Comentarios del evento
    router.post('/evento/:id', comentariosControllerFE.agregarComentario)

    // Elimina comentarios del evento
    router.post('/eliminar-comentario', comentariosControllerFE.eliminarComentario)

    // Muestra perfiles en el front
    router.get('/usuarios/:id', usuariosControllerFE.mostrarUsuario)

    // Muestra los grupos en el front
    router.get('/grupos/:id', gruposControllerFE.mostrarGrupo)

    // Muestra eventos por categoria
    router.get('/categoria/:categoria',
    eventosControllerFE.mostrarCategoria)

    // Añade la busqueda
    router.get('/busqueda', busquedaControllerFE.resultadosBusqueda)

    // Crear y confirmar cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearNuevaCuenta)
    router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta)

    // Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    // Cerrar sesión
    router.get('/cerrar-sesion', authController.usuarioAutenticado, authController.cerrarSesion)




    /////////////// AREA PRIVADA (ADMIN) ///////////////////////////////

    // Panel de administracion
    router.get('/administracion',
        authController.usuarioAutenticado,  adminController.panelAdministracion )

        
    // Nuevos grupos
    router.get('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.formNuevoGrupo
    )
    router.post('/nuevo-grupo', 
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.crearGrupo)

    // Editar grupos
    router.get('/editar-grupo/:grupoId',         authController.usuarioAutenticado,
    gruposController.formEditarGrupo
    )
    router.post('/editar-grupo/:grupoId',         authController.usuarioAutenticado,
    gruposController.editarGrupo
    )

    // Editar la imagen del grupo
    router.get('/imagen-grupo/:grupoId',
    authController.usuarioAutenticado, gruposController.formEditarImagen)
    router.post('/imagen-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.editarImagen)

    // Eliminar grupos
    router.get('/eliminar-grupo/:grupoId', authController.usuarioAutenticado, gruposController.formEliminarGrupo)
    router.post('/eliminar-grupo/:grupoId', authController.usuarioAutenticado, gruposController.eliminarGrupo)

    // Nuevos eventos
    router.get('/nuevo-evento', authController.usuarioAutenticado, eventosController.formNuevoEvento)
    router.post('/nuevo-evento', authController.usuarioAutenticado, eventosController.sanitizarEvento, eventosController.crearEvento)

    // Editar Evento
    router.get('/editar-evento/:id', 
    authController.usuarioAutenticado,
    eventosController.formEditarEvento
    )
    router.post('/editar-evento/:id', 
    authController.usuarioAutenticado,
    eventosController.editarEvento
    )

    // Eliminar Evento
    router.get('/eliminar-evento/:id', 
    authController.usuarioAutenticado,
    eventosController.formEliminarEvento
    )
    router.post('/eliminar-evento/:id', 
    authController.usuarioAutenticado,
    eventosController.eliminarEvento
    )

    // Editar informacion de perfil
    router.get('/editar-perfil',
        authController.usuarioAutenticado,
        usuariosController.formEditarPerfil
    )
    router.post('/editar-perfil',
        authController.usuarioAutenticado,
        usuariosController.editarPerfil
    )

    // Modifica el password
    router.get('/cambiar-password',
        authController.usuarioAutenticado,
        usuariosController.formCambiarPassword
    )
    router.post('/cambiar-password',
        authController.usuarioAutenticado,
        usuariosController.cambiarPassword
    )

    // Imagenes de perfil
    router.get('/imagen-perfil', authController.usuarioAutenticado, usuariosController.formSubirImagenPerfil)
    router.post('/imagen-perfil', authController.usuarioAutenticado, usuariosController.subirImagen, usuariosController.guardarImagenPerfil)

    return router
}
