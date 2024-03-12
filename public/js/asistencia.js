document.addEventListener('DOMContentLoaded', () => {
    const asistencias = document.querySelectorAll('.confirm-asist');
    asistencias.forEach(asistencia => {
        asistencia.addEventListener('submit', confirmarAsistencia);
    });
});

function confirmarAsistencia(e) {
    e.preventDefault();

    const btn = this.querySelector('input[type="submit"]');
    let accion = this.querySelector('input[type="hidden"]').value;
    const mensaje = this.querySelector('#mensaje');

    // Limpia la respuesta previa
    while (mensaje.firstChild) {
        mensaje.removeChild(mensaje.firstChild);
    }

    // Obtiene el valor confirmar o cancelar en el hidden
    const datos = {
        accion
    };

    axios.post(this.action, datos)
        .then(respuesta => {
            console.log(respuesta);
            if (accion === 'confirmar') {
                // Modifica los elementos del boton
                this.querySelector('input[type="hidden"]').value = 'cancelar';
                btn.value = 'Cancelar';
                btn.classList.remove('btn-azul');
                btn.classList.add('btn-rojo');
            } else {
                // Modifica los elementos del boton
                this.querySelector('input[type="hidden"]').value = 'confirmar';
                btn.value = 'Si';
                btn.classList.remove('btn-rojo');
                btn.classList.add('btn-azul');
            }
            // Mostrar un mensaje
            mensaje.appendChild(document.createTextNode(respuesta.data));
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
