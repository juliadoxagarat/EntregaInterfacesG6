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

        const tarjetas = [...lista.querySelectorAll(".tarjeta-juego")];

        function obtenerDesplazamiento(delta) {
            const inicio = tarjetas[0].offsetLeft;
            const posiciones = tarjetas.map(tarjeta => tarjeta.offsetLeft - inicio);

            if (delta > 0) {
                return posiciones.find(posicion => posicion > desplazamiento + 1) ?? desplazamiento;
            }

            return posiciones.findLast(posicion => posicion < desplazamiento - 1) ?? 0;
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

            if (maximoDesplazamiento <= 0 || tarjetas.length === 0) return;

            if ((delta > 0 && desplazamiento >= maximoDesplazamiento) ||
                (delta < 0 && desplazamiento <= 0)) {
                return;
            }

            desplazamiento = obtenerDesplazamiento(delta);

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