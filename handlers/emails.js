const nodemailer = require('nodemailer')
const emailConfig = require('../config/emails')
const fs = require('fs')
const util = require('util')
const ejs = require('ejs')

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ba291f2139372c",
      pass: "a1aa031f530c83"
    }
  });

exports.enviarEmail = async(opciones) => {
    console.log(opciones)

    // Leer el archivo para el email
    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`

    // Compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo, 'utf8'))

    // Crear el html
    const html = compilado({url: opciones.url})

    // Configurar las opciones del email
    const opcionesEmail = {
        from: 'ProtoMeets <noreply@protomeets.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        html
    }

    // enviar el email
    const snedEmail = util.promisify(transport.sendMail, transport)

    return snedEmail.call(transport, opcionesEmail)
}