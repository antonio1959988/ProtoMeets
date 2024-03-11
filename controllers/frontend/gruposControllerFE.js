const Grupos = require('../../models/Grupos')
const Eventos = require('../../models/Eventos')
const moment = require('moment')

exports.mostrarGrupo = async(req, res, next) => {
    const consultas = []

    consultas.push( Grupos.findOne({
        where: {
            id: req.params.id
        }
    }) )

    consultas.push( Eventos.findAll({
        where: {
            grupoId: req.params.id
        },
        order: [
            ['fecha', 'ASC']
        ]
    }) )

    const [ grupo, eventos ] = await Promise.all(consultas)

    // Si no hay grupo
    if(!grupo){
        res.redirect('/')
        return next()
    }

    // Mostrar la vista
    res.render('mostrar-grupo', {
        nombrePagina: `Información Grupo: ${grupo.nombre}`,
        grupo,
        eventos,
        moment
    })
}