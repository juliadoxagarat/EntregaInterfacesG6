// =========================================================
// CARRUSELES
// Un solo script para todos los carruseles de la pagina.
// Deslizamiento suave (translateX con transicion CSS) +
// animacion de "pulso" en las cards.
// Mobile: avanza de a una card. Tablet/desktop: una pagina.
// =========================================================

function iniciarCarruseles() {

    const carruseles = document.querySelectorAll("[data-carrusel]");

    carruseles.forEach((carrusel) => {

        const ventana = carrusel.querySelector(".carrusel-juegos__ventana");

        const lista = carrusel.querySelector(".carrusel-juegos__lista");

        const flechaIzquierda = carrusel.querySelector(
            '[data-direccion="anterior"]'
        );

        const flechaDerecha = carrusel.querySelector(
            '[data-direccion="siguiente"]'
        );

        // si al carrusel le falta algo, no lo toca
        if (!ventana || !lista || !flechaIzquierda || !flechaDerecha) {
            return;
        }


        // guarda cuanto se desplazo el carrusel (en px, positivo)
        let desplazamiento = 0;

        // evita que la animacion se corte si hacen click muy rapido
        let animando = false;


        // calcula cuanto tiene q avanzar en cada click
        function obtenerDesplazamiento() {

            // mobile: avanza una sola card
            if (window.innerWidth < 600) {

                const tarjeta = lista.querySelector(".tarjeta-juego");

                if (!tarjeta) {
                    return ventana.clientWidth;
                }

                // obtiene el gap q tiene la lista en css
                const estilosLista = getComputedStyle(lista);

                const gap = parseFloat(estilosLista.gap) || 0;

                return tarjeta.offsetWidth + gap;
            }


            // tablet y escritorio: avanza una pagina completa
            return ventana.clientWidth;
        }


        function actualizarCarrusel() {

            // limite max al q puede moverse
            const maximoDesplazamiento =
                lista.scrollWidth - ventana.clientWidth;

            if (desplazamiento > maximoDesplazamiento) {
                desplazamiento = maximoDesplazamiento;
            }

            if (desplazamiento < 0) {
                desplazamiento = 0;
            }


            // el translateX se anima solo gracias a la
            // transition del CSS (.carrusel-juegos__lista)
            lista.style.transform =
                `translateX(-${desplazamiento}px)`;


            // muestra o oculta las flechas segun la pos
            flechaIzquierda.hidden = desplazamiento <= 0;

            flechaDerecha.hidden =
                desplazamiento >= maximoDesplazamiento;
        }


        function mover(delta) {

            const maximoDesplazamiento =
                lista.scrollWidth - ventana.clientWidth;

            // si ya esta en el limite no hace nada
            if (maximoDesplazamiento <= 0) {
                return;
            }

            if ((delta > 0 && desplazamiento >= maximoDesplazamiento) ||
                (delta < 0 && desplazamiento <= 0)) {
                return;
            }


            // avanza o vuelve
            const movimiento = obtenerDesplazamiento();

            desplazamiento += delta > 0 ? movimiento : -movimiento;

            actualizarCarrusel();


            // animacion de pulso en las cards
            if (!animando) {

                animando = true;
                lista.classList.add("animando");

                // debe coincidir con la duracion de la
                // animation del CSS (0.55s)
                setTimeout(() => {
                    lista.classList.remove("animando");
                    animando = false;
                }, 550);
            }
        }


        flechaDerecha.addEventListener("click", () => {
            mover(1);
        });


        flechaIzquierda.addEventListener("click", () => {
            mover(-1);
        });


        // recalcula si cambia el tam de la pantalla
        window.addEventListener("resize", () => {
            actualizarCarrusel();
        });


        actualizarCarrusel();

    });

}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarCarruseles);
} else {
    iniciarCarruseles();
}
