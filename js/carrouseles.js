const carruseles = document.querySelectorAll("[data-carrusel]");

carruseles.forEach((carrusel) => {

    const ventana = carrusel.querySelector(".carrusel-juegos__ventana");
    const lista = carrusel.querySelector(".carrusel-juegos__lista");

    const botonAnterior = carrusel.querySelector(
        '[data-direccion="anterior"]'
    );

    const botonSiguiente = carrusel.querySelector(
        '[data-direccion="siguiente"]'
    );


    // guarda cuanto se desplazo el carrusel
    let desplazamiento = 0;


    function actualizarCarrusel() {

        // limite max al q puede moverse
        const maximoDesplazamiento =
            lista.scrollWidth - ventana.clientWidth;


        if (desplazamiento > maximoDesplazamiento) {
            desplazamiento = maximoDesplazamiento;
        }


        lista.style.transform =
            `translateX(-${desplazamiento}px)`;


        // muestra o oculta las flechas segun la pos
        botonAnterior.hidden = desplazamiento <= 0;

        botonSiguiente.hidden =
            desplazamiento >= maximoDesplazamiento;
    }


    botonSiguiente.addEventListener("click", () => {

        // avanza una pagina visible
        const anchoPagina = ventana.clientWidth;

        const maximoDesplazamiento =
            lista.scrollWidth - ventana.clientWidth;


        desplazamiento += anchoPagina;


        if (desplazamiento > maximoDesplazamiento) {
            desplazamiento = maximoDesplazamiento;
        }


        actualizarCarrusel();
    });


    botonAnterior.addEventListener("click", () => {

        // vuelve una pagina visible
        const anchoPagina = ventana.clientWidth;

        desplazamiento -= anchoPagina;


        if (desplazamiento < 0) {
            desplazamiento = 0;
        }


        actualizarCarrusel();
    });


    // recalcula si cambia el tam de la pantalla
    window.addEventListener("resize", () => {
        actualizarCarrusel();
    });


    actualizarCarrusel();

});