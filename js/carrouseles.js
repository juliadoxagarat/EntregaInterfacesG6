function iniciarCarruseles() {

    const carruseles = document.querySelectorAll("[data-carrusel]");

    carruseles.forEach((carrusel) => {

        const ventana = carrusel.querySelector(".carrusel-juegos__ventana");
        const lista = carrusel.querySelector(".carrusel-juegos__lista");
        const flechaIzquierda = carrusel.querySelector('[data-direccion="anterior"]');
        const flechaDerecha = carrusel.querySelector('[data-direccion="siguiente"]');

        if (!ventana || !lista || !flechaIzquierda || !flechaDerecha) {
            return;
        }

        let desplazamiento = 0;
        let animando = false;

        function obtenerDesplazamiento() {
            const anchoVentana = ventana.getBoundingClientRect().width;
            const esMobile = window.innerWidth < 600;

            if (esMobile) {
                // En mobile el avance es exactamente 1 ancho completo de la ventana
                return anchoVentana;
            } else {
                const tarjeta = lista.querySelector(".tarjeta-juego");
                if (!tarjeta) return anchoVentana;
                const estiloLista = window.getComputedStyle(lista);
                const gap = parseFloat(estiloLista.gap) || 0;
                return tarjeta.getBoundingClientRect().width + gap;
            }
        }

        function actualizarCarrusel() {
            const maximoDesplazamiento = lista.scrollWidth - ventana.clientWidth;

            if (desplazamiento > maximoDesplazamiento) {
                desplazamiento = maximoDesplazamiento;
            }

            if (desplazamiento < 0) {
                desplazamiento = 0;
            }

            lista.style.transform = `translateX(-${desplazamiento}px)`;

            flechaIzquierda.hidden = desplazamiento <= 0;
            flechaDerecha.hidden = desplazamiento >= maximoDesplazamiento - 2;
        }

        function mover(delta) {
            const maximoDesplazamiento = lista.scrollWidth - ventana.clientWidth;

            if (maximoDesplazamiento <= 0) return;

            if ((delta > 0 && desplazamiento >= maximoDesplazamiento) ||
                (delta < 0 && desplazamiento <= 0)) {
                return;
            }

            const movimiento = obtenerDesplazamiento();
            desplazamiento += delta > 0 ? movimiento : -movimiento;

            actualizarCarrusel();

            if (!animando) {
                animando = true;
                lista.classList.add("animando");

                setTimeout(() => {
                    lista.classList.remove("animando");
                    animando = false;
                }, 550);
            }
        }

        flechaDerecha.addEventListener("click", () => mover(1));
        flechaIzquierda.addEventListener("click", () => mover(-1));

        window.addEventListener("resize", () => {
            desplazamiento = 0;
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