document.addEventListener('DOMContentLoaded', () => {
    const formsEliminar = document.querySelectorAll('.eliminar-comentario')

    // Revisar que existan los formularios
    if (formsEliminar.length > 0) {
        formsEliminar.forEach(form => {
            form.addEventListener('submit', eliminarComentario)
        })
    }
})

function eliminarComentario(e) {
    e.preventDefault()

    Swal.fire({
        title: "¿Eliminar Comentario?",
        text: "Un comentario eliminado no se puede recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, ¡Borrar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {

        if (result.isConfirmed) {

            // Tomar el id del comentario
            const comentarioId = this.children[0].value

            // Crear el objeto
            const datos = {
                comentarioId
            }

            // Ejecutar axios y pasar los datos


            axios.post(this.action, datos)
                .then(respuesta => {
                    Swal.fire({
                        title: "!Eliminado!",
                        text: respuesta.data,
                        icon: "success"
                    });

                    // Eliminar del DOM
                    this.parentElement.parentElement.remove()
                })
                .catch(err =>{
                    if(err.response.status === 403 || err.response.status === 404){
                        Swal.fire({
                            title: "Error",
                            text: err.response.data,
                            icon: "error"
                        });
                    }
                })


        }
    });


}