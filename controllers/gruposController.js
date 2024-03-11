const Categorias = require('../models/Categorias')
const Grupos = require('../models/Grupos')
const { v4: uuidv4 } = require('uuid')

const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')


const configuracionMulter = {
    limits: { fileSize: 600000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/grupos/')
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1]
            next(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, next) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // El formato es valido
            next(null, true)
        } else {
            // El formato no es valido
            next(new Error('Formato no válido'), false)
        }
    }
}

const upload = multer(configuracionMulter).single('imagen')

// Sube imagen en el servidor
exports.subirImagen = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande')
                } else {
                    req.flash('error', error.message)
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message)
            }
            res.redirect('back')
            return
        } else {
            next()
        }
    })
}

exports.formNuevoGrupo = async (req, res) => {

    const categorias = await Categorias.findAll()
    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    })
}

// Almacena los grupos en la base de datos
exports.crearGrupo = async (req, res) => {

    // Sanitizar
    req.sanitizeBody('nombre')
    req.sanitizeBody('url')

    console.log(req.body)

    const grupo = req.body

    // Almacena el usuario autenticado como el creador del grupo
    grupo.usuarioId = req.user.id
    grupo.categoriaId = req.body.categoria

    // Leer la imagen
    if (req.file) {
        grupo.imagen = req.file.filename;
    } else {
        grupo.imagen = 'group.jpeg';
    }

    const uuid = uuidv4();
    grupo.id = uuid;

    console.log(grupo)

    try {
        // Almacenar en las base de datos
        await Grupos.create(grupo)
        req.flash('exito', 'Se ha creado el grupo correctamente')
        res.redirect('/administracion')
    } catch (error) {
        // Extraer el mensaje de los errores
        const erroresSequalize = error.errors.map(err => err.message)
        req.flash('error', erroresSequalize)
        res.redirect('/nuevo-grupo')
    }
}

exports.formEditarGrupo = async (req, res) => {
    // Ejecutar ambas tareas al mismo tiempo
    const consultas = []
    consultas.push(Grupos.findByPk(req.params.grupoId))
    consultas.push(Categorias.findAll())

    // Promise con await
    const [grupo, categorias] = await Promise.all(consultas)

    res.render('editar-grupo', {
        nombrePagina: `Editar Grupo: ${grupo.nombre}`,
        grupo,
        categorias
    })
}

// Guardar los cambios en la bd
exports.editarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })

    // Si no existe ese grupo o no es el dueño
    if (!grupo) {
        req.flash('error', 'Operación no válida')
        res.redirect
    }

    // Todo bien, leer los valores
    const { nombre, descripcion, categoria, url } = req.body

    // Asignar los valores
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoria;
    grupo.url = url

    // Guardar en la base de datos
    await grupo.save()
    req.flash('exito', 'Cambios Almacenados Correctamente')
    res.redirect('/administracion')
}

// Muestra el formulario para editar una imagen de grupo
exports.formEditarImagen = async (req, res) => {
    const grupo = await Grupos.findByPk(req.params.grupoId)

    res.render('imagen-grupo', {
        nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
        grupo
    })
}

// Modifica la imagen en la BD y elimina la anterior
exports.editarImagen = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })

    // El grupo existe y es valido
    if (!grupo) {
        req.flash('error', 'Operación no válida')
        res.redirect('/iniciar-sesion')
        return next()
    }

    // Verificar que el archivo sea nuevo 
    // if(req.file) {
    //     console.log(req.file.filename)
    // }

    // // Revisar que exista un archivo anterior
    // if(grupo.imagen){
    //     console.log(grupo.imagen)
    // }

    // Si hay imagen anterior y nueva, significa que vamos a borrar la anterior
    if (req.file && grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;

        // Eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if (error) {
                console.log(error)
            }
            return;
        })
    }

    // Si hay una imagen nuevam la guardamos
    if (req.file) {
        grupo.imagen = req.file.filename
    }

    // Guardar en la BD
    await grupo.save()
    req.flash('exito', 'Cambios almacenados correctamente')
    res.redirect('/administracion')
}

// Muestra el formulario para eliminar un grupo
exports.formEliminarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })

    if (!grupo) {
        req.flash('error', 'Operación no valida')
        res.redirect('/administracion')
        return next()
    }

    // Todo bien, ejecutar la vista
    res.render('eliminar-grupo', {
        nombrePagina: `Eliminar Grupo: ${grupo.nombre}`
    })
}

// Elimina el grupo e imagen
exports.eliminarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })

    if (!grupo) {
        req.flash('error', 'Operación no valida')
        res.redirect('/administracion')
        return next()
    }

    // Si hay una imagen, eliminarla
    if (grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;

        // Eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if (error) {
                console.log(error)
            }
            return;
        })
    }

    // Eliminar el grupo
    await Grupos.destroy({
        where: {
            id: req.params.grupoId
        }
    })

    // Redireccionar al usuario
    req.flash('exito', 'Grupo Eliminado')
    res.redirect('/administracion')


}