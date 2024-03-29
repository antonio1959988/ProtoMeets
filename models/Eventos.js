const Sequelize = require('sequelize')
const db = require('../config/db')
const uuid = require('uuid/v4')
const slug = require('slug')
const shortid = require('shortid')
const Usuarios = require('../models/Usuarios')
const Grupos = require('../models/Grupos')

const Evento = db.define('eventos', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid()
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un título'
            }
        }
    },
    slug: {
        type: Sequelize.STRING
    },
    invitado: Sequelize.STRING,
    cupo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una descripción'
            }
        }
    },
    fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una fecha para el evento'
            }
        }
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una hora para el evento'
            }
        }
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una dirección'
            }
        }
    },
    ciudad: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una Ciudad'
            }
        }
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un Estado'
            }
        }
    },
    pais: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un País'
            }
        }
    },
    ubicacion: {
        type: Sequelize.GEOMETRY('POINT'),
    },
    interesados: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    }
}, {
    hooks: {
        async beforeCreate(evento) {
            const url = slug(evento.titulo).toLowerCase()
            evento.slug = `${url}-${shortid.generate()}`
        }
    }
})

Evento.belongsTo(Usuarios)
Evento.belongsTo(Grupos)

module.exports = Evento