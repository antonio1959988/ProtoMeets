const Categorias = require('../../models/Categorias')
const Eventos = require('../../models/Eventos')
const Grupos = require('../../models/Grupos')
const Usuarios = require('../../models/Usuarios')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const Comentarios = require('../../models/Comentarios')

exports.mostrarEvento = async (req, res, next) => {
    const evento = await Eventos.findOne({ 
            where: {
                slug: req.params.slug
            },
            //JOINS
            include: [
                {
                    model: Grupos,
                },
                {
                    model: Usuarios,
                    attributes: ['id', 'nombre', 'imagen']
                }
            ]
        })

    // Si no existe
    if(!evento){
        res.redirect('/')
    }

    // Consultar por eventos cercanos 
    const ubicacion = Sequelize.literal(`ST_GeomFromText( 'POINT( ${evento.ubicacion.coordinates[0]} ${evento.ubicacion.coordinates[1]} )' )`)

    // ST_DISTANCE_Sphere = Retorna una linea en metros
    const distancia = Sequelize.fn('ST_DistanceSphere', Sequelize.col('ubicacion'), ubicacion)

    // Encontrar eventos cercanos
    const cercanos = await Eventos.findAll({
        order: distancia,
        where: {
            id: { [Op.ne]: evento.id }, // Excluir el evento visualizado
            [Op.and]: Sequelize.where(distancia, { [Op.lte]: 2000 })
        },
        limit: 3,
        include: [
            { model: Grupos },
            { model: Usuarios, attributes: ['id', 'nombre', 'imagen'] }
        ]
    });

    // Consultar despues de verificar que existe el evento
    const comentarios = await Comentarios.findAll({
        where: { eventoId: evento.id },
        include: [
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    // Pasar el resultado hacia la vista
    res.render('mostrar-evento', {
        nombrePagina: evento.titulo,
        evento,
        moment,
        comentarios,
        cercanos
    })
}

// Confirma o cancela si el usuario asistira al evento
exports.confirmarAsistencia = async (req, res) => {

    console.log(req.body)

    const { accion } = req.body

    if(accion === 'confirmar') {
        // Agregar el usuario solo si no está presente en el array de interesados
        Eventos.update({
            'interesados': Sequelize.fn('array_distinct', Sequelize.fn('array_append', Sequelize.col('interesados'), req.user.id))
        }, {
            'where': { 'slug': req.params.slug }
        });

         // Mensaje 
        res.send('Has confirmado tu asistencia')
    
    } else {
        // Cancelar la asistencia
        Eventos.update({
            'interesados': Sequelize.fn('array_remove', Sequelize.col('interesados'), req.user.id)},
            {'where': {'slug': req.params.slug}}
        )

         // Mensaje 
    res.send('Has cancelado tu asistencia')
    }

    return
}

// Muestra el listado de asistentes
exports.mostrarAsistentes = async (req, res) => {
    const evento = await Eventos.findOne({
        where: { slug: req.params.slug },
        attributes: ['interesados']
    })

    // Extraer interesados
    const { interesados } = evento
    const asistentes = await Usuarios.findAll({
        attributes: ['nombre', 'imagen'],
        where: { id: interesados }
    })

    // Crear la vista y pasar datos
    res.render('asistentes-evento', {
        nombrePagina: 'Listado de asistentes al evento',
        asistentes
    })
}

// Muestra los eventos agrupados por categoria
exports.mostrarCategoria = async(req, res, next) => {
    const categoria = await Categorias.findOne({
        attributes: ['id', 'nombre'],
        where: { slug: req.params.categoria } }      
        )

    const eventos = await Eventos.findAll({
        order: [
            ['fecha', 'ASC'],
            ['hora', 'ASC']
        ],
        include: [
            {
                model: Grupos,
                where: { categoriaId : categoria.id }
            },
            {
                model: Usuarios
            }
        ]
    });

    res.render('categoria', {
        nombrePagina: `Categoria: ${categoria.nombre}`,
        eventos,
        moment
    })
}