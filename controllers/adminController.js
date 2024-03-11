const Grupos = require('../models/Grupos')
const Eventos = require('../models/Eventos')

const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.panelAdministracion = async (req, res) => {

    // Consultas
    const consultas = []
    consultas.push(Grupos.findAll({where: {usuarioId: req.user.id}}))
    consultas.push(Eventos.findAll({where: {usuarioId: req.user.id, fecha: {
        [Op.gte] : moment(new Date()).format("YYYY-MM-DD")
                        }},
        order: [
            ['fecha', 'ASC']
        ] 


})) 

    consultas.push(Eventos.findAll({where: {usuarioId: req.user.id, fecha: {
        [Op.lt] : moment(new Date()).format("YYYY-MM-DD")
    }},
    order: [
        ['fecha', 'DESC']
    ] 

}))
    
    // Array destructuring
    const [grupos, eventos, anteriores] = await Promise.all(consultas)


    res.render('administracion', {
        nombrePagina: 'Panel de Administracion',
        grupos,
        eventos,
        moment,
        anteriores
    })
}