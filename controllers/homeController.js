const Categorias = require('../models/Categorias')
const Eventos = require('../models/Eventos')
const Grupos = require('../models/Grupos')
const Usuarios = require('../models/Usuarios')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.home = async(req, res) => {

    // Promise para consultas en el home
    const consultas = []
    consultas.push( Categorias.findAll({}) )
    consultas.push( Eventos.findAll({
            attributes: ['slug', 'titulo', 'fecha', 'hora'], // campos especificos
            where: {
                fecha: { [Op.gte] : moment(new Date()).format("YYYY-MM-DD")} // Mostrar mas recientes
            },
            limit: 3,
            order: [
                ['fecha', 'ASC']
            ],
            // Join
            include: [
                {
                    model: Grupos,
                    attributes: ['imagen']
                },
                {
                    model: Usuarios,
                    attributes: ['nombre', 'imagen']
                }
            ]
    }) )

    // Extraer y pasar a la vista
    const [ categorias, eventos ] = await Promise.all(consultas)

    res.render('home', {
        nombrePagina: 'Inicio',
        categorias,
        eventos,
        moment
    })
}

