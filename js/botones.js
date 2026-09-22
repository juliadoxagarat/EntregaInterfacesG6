document.addEventListener('DOMContentLoaded', () => {
    const botonAgregar = document.querySelector('[data-boton-favorito]');

    if (botonAgregar) {
        botonAgregar.addEventListener('click', () => {
            // Alterna la clase CSS para cambiar el color a #9FC500
            botonAgregar.classList.toggle('agregado');

            // Alterna el texto según si tiene la clase o no
            if (botonAgregar.classList.contains('agregado')) {
                botonAgregar.textContent = 'Agregado';
            } else {
                botonAgregar.textContent = 'Agregar a mis juegos';
            }
        });
    }
});