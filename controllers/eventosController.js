const Grupos = require('../models/Grupos')
const Eventos = require('../models/Eventos')
const { v4: uuidv4 } = require('uuid')

// Muestra el formulario para nuevos eventos
exports.formNuevoEvento = async(req, res) => {
    const grupos = await Grupos.findAll({where: {usuarioId: req.user.id}})

    res.render('nuevo-evento', {
        nombrePagina: 'Crear Nuevo Evento',
        grupos
    })
}

// Inserta nuevos eventos en la BD
exports.crearEvento = async(req, res) => {

    // Obtener los datps
    const evento = req.body

    // Asignar le usuario
    evento.usuarioId = req.user.id;

    // Almacena la ubicación con un oint
    const point = { type: 'Point', coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)] }

    evento.ubicacion = point
    //evento.id = 2
    const uuid = uuidv4();
    evento.id = uuid;

    // Cupo opcional
    if(req.body.cupo === ''){
        evento.cupo = 0
    }


    // Almacenar en la BD
    try {
        await Eventos.create(evento)
        req.flash('exito', 'Se ha creado el evento correctamente')
        res.redirect('/administracion')
    } catch (error) {
        // Extraer el mensaje de los errores
        const erroresSequelize = error.errors.map(err => err.message)
        console.log(error)
        req.flash('error', erroresSequelize)
        res.redirect('/nuevo-evento')
    }
}

// Sanitizar los eventos
exports.sanitizarEvento = (req, res, next) => {
    req.sanitizeBody('titulo');
    req.sanitizeBody('invitado')
    req.sanitizeBody('cupo')
    req.sanitizeBody('fecha')
    req.sanitizeBody('hora')
    req.sanitizeBody('direccion')
    req.sanitizeBody('ciudad')
    req.sanitizeBody('estado')
    req.sanitizeBody('pais')
    req.sanitizeBody('lat')
    req.sanitizeBody('lng')
    req.sanitizeBody('grupoId')

    next()
}

// Muestra un formulario para editar un evento
exports.formEditarEvento = async( req, res) => {
    const consultas = []
    consultas.push( Grupos.findAll({ where: { usuarioId: req.user.id } }) )
    consultas.push(Eventos.findByPk(req.params.id))

    // Return un promis
    const [ grupos, eventos ] = await Promise.all(consultas)

    if(!grupos || !eventos){
        req.flash('error', 'Operación no válida')
        res.redirect('/administracion')
        return next()
    }

    // Mostramos la vista
    res.render('editar-evento', {
        nombrePagina: `Editar Evento: ${eventos.titulo}`,
        grupos,
        eventos
    })
}

// Almacena los cambios en el avento
exports.editarEvento = async (req, res, next) => {
    const evento = await Eventos.findOne({ where: { id: req.params.id, usuarioId: req.user.id } })

    if(!evento){
        req.flash('error', 'Operación no valida')
        res.redirect('/administracion')
        return next()
    }

    // Asignar los valores
    const { grupoId, titulo, invitado, fecha, hora, cupo, descripcion, direccion, ciudad, estado, pais, lat, lng } = req.body

    evento.grupoId = grupoId
    evento.titulo = titulo
    evento.invitado = invitado
    evento.fecha = fecha
    evento.hora = hora
    evento.cupo = cupo
    evento.descripcion = descripcion
    evento.direccion = direccion
    evento.ciudad = ciudad
    evento.estado = estado
    evento.pais = pais

    // Asignar el point
    const point = {type: 'Point', coordinates: [parseFloat(lat), parseFloat(lng)]}

    evento.ubicacion = point

    // Almacenar en la BD
    await evento.save()
    req.flash('exito', 'Cambios guardados correctamente')
    res.redirect('/administracion')

}

// Muestra un formulario para eliminar eventos
exports.formEliminarEvento = async (req, res, next) => {
    const evento = await Eventos.findOne({ where : { id : req.params.id, usuarioId : req.user.id } })

    if(!evento){
        req.flash('error', 'Operación no válida')
        res.redirect('/administracion')
        return next()
    }

    // Mostrar la vista
    res.render('eliminar-evento', {
        nombrePagina: `Eliminar Evento: ${evento.titulo}`
    })
}

// Elimina el evento de la bd
exports.eliminarEvento = async (req, res) => {
    await Eventos.destroy({
        where: {
            id: req.params.id
        }
    })

    req.flash('exito', 'Evento Eliminado')
    res.redirect('/administracion')
}