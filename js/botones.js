document.addEventListener('DOMContentLoaded', () => {
    const botonAgregar = document.querySelector('[data-boton-favorito]');

    if (botonAgregar) {
        botonAgregar.addEventListener('click', () => {
            // Alterna la clase CSS para cambiar el color a #9FC500
            botonAgregar.classList.toggle('agregado');

            // Alterna el texto según si tiene la clase o no
            if (botonAgregar.classList.contains('agregado')) {
                botonAgregar.textContent = 'Agregado';
                botonAgregar.innerHTML += ' <i class="fa-solid fa-check"></i>';
            } else {
                botonAgregar.textContent = 'Agregar a mis juegos';
            }
        });
    }
});


/* BOTON JUGAR */

const btnJugar = document.getElementById('btn-jugar');
const textoOriginal = btnJugar.textContent;

btnJugar.addEventListener('mouseenter', () => {
    btnJugar.textContent = '⚔️';
    btnJugar.classList.add('animar-espadas');
});

btnJugar.addEventListener('mouseleave', () => {
    btnJugar.textContent = textoOriginal;
    btnJugar.classList.remove('animar-espadas');
});