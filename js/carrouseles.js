
const carruseles = document.querySelectorAll("[data-carrusel]");

carruseles.forEach(carrusel => {

    const lista = carrusel.querySelector(".carrusel-juegos__lista");

    const flechaIzquierda = carrusel.querySelector(
        '[data-direccion="anterior"]'
    );

    const flechaDerecha = carrusel.querySelector(
        '[data-direccion="siguiente"]'
    );

    let posicion = 0;

    function moverCarrusel(direccion) {

        // Reinicia la animación (en las TARJETAS, no en la lista,
        // porque la animacion del transform de la lista pisaria
        // el translateX del deslizamiento)
        lista.classList.remove("animando");

        // Fuerza al navegador a reiniciar la animación
        void lista.offsetWidth;

        // Agrega la animación
        lista.classList.add("animando");

        // Calculamos cuánto mover
        const tarjeta = lista.querySelector(".tarjeta-juego");

        if (!tarjeta) return;

        const anchoTarjeta = tarjeta.offsetWidth;
        const gap = parseFloat(getComputedStyle(lista).gap);

        const movimiento = anchoTarjeta + gap;

        if (direccion === "siguiente") {
            posicion -= movimiento;
        } else {
            posicion += movimiento;
        }

        // limites: no pasarse del final ni del inicio
        const maximoDesplazamiento = lista.scrollWidth - lista.parentElement.clientWidth;

        if (posicion < -maximoDesplazamiento) {
            posicion = -maximoDesplazamiento;
        }

        if (posicion > 0) {
            posicion = 0;
        }

        lista.style.transform = `translateX(${posicion}px)`;

        // muestra u oculta las flechas segun la pos
        flechaIzquierda.hidden = posicion >= 0;

        flechaDerecha.hidden = posicion <= -maximoDesplazamiento;

        // Sacamos la clase cuando termina
        setTimeout(() => {
            lista.classList.remove("animando");
        }, 550);
    }

    flechaDerecha.addEventListener("click", () => {
        moverCarrusel("siguiente");
    });

    flechaIzquierda.addEventListener("click", () => {
        moverCarrusel("anterior");
    });

});