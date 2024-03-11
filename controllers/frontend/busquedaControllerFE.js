const Eventos = require('../../models/Eventos')
const Grupos = require('../../models/Grupos')
const Usuarios = require('../../models/Usuarios')

const Sequalize = require('sequelize')
const Op = Sequalize.Op
const moment = require('moment')

exports.resultadosBusqueda = async (req, res) => {
    
    // Leer datos de la url
    const { categoria, titulo, ciudad, pais } = req.query

    // Si la categoria esta vacia
    let query;
    if(categoria === ''){
        query = ''
    } else{
        query = `where: {
            categoriaId: { [Op.eq] : ${categoria} }
        }`
    }

    // Filtrar los eventos por los terminos de la busqueda 
    const eventos = await Eventos.findAll({
        where: {
            titulo: { [Op.iLike]: '%'+ titulo +'%' },
            ciudad: { [Op.iLike]: '%'+ ciudad +'%' },
            pais: { [Op.iLike]: '%'+ pais +'%' }
        },
        include: [
            {
                model: Grupos,
                query
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    // Pasar los resultados a la vista
    res.render('busqueda', {
        nombrePagina: 'Resultados Búsqueda',
        eventos,
        moment
    })

}