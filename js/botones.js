document.addEventListener('DOMContentLoaded', () => {
    const botonAgregar = document.querySelector('[data-boton-favorito]');

    if (botonAgregar) {
        function actualizarBoton() {
            if (botonAgregar.classList.contains('agregado')) {
                botonAgregar.innerHTML = '<span class="corazon">❤️</span> Agregado <i class="fa-solid fa-check"></i>';
            } else {
                botonAgregar.innerHTML = '<span class="corazon">❤️</span> Agregar a mis juegos';
            }
        }

        actualizarBoton();

        botonAgregar.addEventListener('click', () => {
            // Removemos animaciones previas si el usuario hace clicks muy rápidos
            botonAgregar.classList.remove('estallido-verde', 'estallido-rosa');
            void botonAgregar.offsetWidth; // Forzar reflow de CSS para reiniciar la animación

            if (!botonAgregar.classList.contains('agregado')) {
                // Al pasar a "Agregado" -> destellos verdes
                botonAgregar.classList.add('agregado', 'estallido-verde');
            } else {
                // Al volver a "Agregar a mis juegos" -> destellos rosas
                botonAgregar.classList.remove('agregado');
                botonAgregar.classList.add('estallido-rosa');
            }

            actualizarBoton();
        });

        // Remueve las clases de animación cuando termina el efecto
        botonAgregar.addEventListener('animationend', (e) => {
            if (e.animationName === 'particulasOut') {
                botonAgregar.classList.remove('estallido-verde', 'estallido-rosa');
            }
        });
    }

    /* BOTON JUGAR */
    const btnJugar = document.getElementById('btn-jugar');
    if (btnJugar) {
            const textoOriginal = btnJugar.textContent;

            btnJugar.addEventListener('mouseenter', () => {
            btnJugar.innerHTML = '<a href= juego.html>⚔️</a>';
            const link = btnJugar.querySelector('a');
            link.style.textDecoration = "none";
            link.style.color = "inherit";
            btnJugar.classList.add('animar-espadas');

        });

        btnJugar.addEventListener('mouseleave', () => {
            btnJugar.textContent = textoOriginal;
            btnJugar.classList.remove('animar-espadas');
        });
    }
});
