const Comentarios = require('../../models/Comentarios')
const Eventos = require('../../models/Eventos')

exports.agregarComentario = async(req, res, next)=> {
    // Obtener el comentario
    const { comentario } = req.body

    // Crear comentario en la BD
    await Comentarios.create({
        mensaje: comentario,
        usuarioId: req.user.id,
        eventoId: req.params.id
    })

    // Redireccionar a la misma pagina
    req.flash('exito', 'Comentario agregado')
    res.redirect('back')
    next()
}

// Elimina un comentario de la bd
exports.eliminarComentario = async (req, res, next) => {
    // Tomar el id del comentario
    const { comentarioId } = req.body

    // Consultar el comentario
    const comentario = await Comentarios.findOne({
        where: { id: comentarioId }
    })

    // Verificar si existe el comentario
    if(!comentario){
        res.status(404).send('Acción no valida')
        return next()
    }

    // Consultar el evento del comentario
    const evento = await Eventos.findOne({ where: { id: comentarioId } })

    // Verificar que quien lo borre sea el creador
    if(comentario.usuarioId === req.user.id || evento.usuarioId === req.user.id ){
        await Comentarios.destroy({ where: {
            id: comentario.id
        } })
        res.status(200).send('Eliminado Correctamente')
        return next()
    } else {
        res.status(403).send('Acción no válida')
        return next()
    }
}