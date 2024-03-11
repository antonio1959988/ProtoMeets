const Sequalize = require('sequelize')
const db = require('../config/db')

const Categorias = db.define('categorias', {
    id: {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequalize.TEXT,
    slug: Sequalize.TEXT
}, {
    timestamps: false 
}) 

module.exports = Categorias