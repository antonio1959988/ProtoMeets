const Sequalize = require('sequelize')
const db = require('../config/db')
const uuid = require('uuid/v4')
const Categorias = require('./Categorias')
const Usuarios = require('./Usuarios')

const Grupos = db.define('grupos', {
    id: {
        type: Sequalize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid()
    },
    nombre: {
        type: Sequalize.TEXT(200),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El grupo debe tener un nombre'
            }
        }
    },
    descripcion: {
        type: Sequalize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una descripción'
            }
        }
    },
    url: Sequalize.TEXT,
    imagen: Sequalize.TEXT
})

// Relaciones uno a uno
Grupos.belongsTo(Categorias)
Grupos.belongsTo(Usuarios)

module.exports = Grupos