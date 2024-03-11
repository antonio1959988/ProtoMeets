const Sequelize = require('sequelize')
const db = require('../config/db')
const Usuarios = require('./Usuarios')
const Eventos = require('./Eventos')

const Comentarios = db.define('comentario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mensaje: Sequelize.TEXT
}, {
    timestamps: false
}) 

// Relacion uno a uno entre comentario y usuario
Comentarios.belongsTo(Usuarios)
Comentarios.belongsTo(Eventos)

module.exports = Comentarios