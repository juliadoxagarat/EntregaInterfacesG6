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



    // calcula cuanto tiene q avanzar
    function obtenerDesplazamiento() {

        // mobile: avanza una sola card
        if (window.innerWidth < 600) {

            const tarjeta = lista.querySelector(".tarjeta-juego");


            // obtiene el gap q tiene la lista en css
            const estilosLista = getComputedStyle(lista);

            const gap = parseFloat(estilosLista.gap) || 0;


            return tarjeta.offsetWidth + gap;
        }


        // tablet y escritorio:
        // avanza una pagina completa como antes
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


        lista.style.transform =
            `translateX(-${desplazamiento}px)`;


        // muestra o oculta las flechas segun la posicion
        botonAnterior.hidden =
            desplazamiento <= 0;


        botonSiguiente.hidden =
            desplazamiento >= maximoDesplazamiento;

    }



    // flecha siguiente
    botonSiguiente.addEventListener("click", () => {

        const movimiento = obtenerDesplazamiento();


        const maximoDesplazamiento =
            lista.scrollWidth - ventana.clientWidth;


        desplazamiento += movimiento;


        if (desplazamiento > maximoDesplazamiento) {

            desplazamiento = maximoDesplazamiento;

        }


        actualizarCarrusel();

    });



    // flecha anterior
    botonAnterior.addEventListener("click", () => {

        const movimiento = obtenerDesplazamiento();


        desplazamiento -= movimiento;


        if (desplazamiento < 0) {

            desplazamiento = 0;

        }


        actualizarCarrusel();

    });



    // recalcula si cambia el tam de la pantalla
    window.addEventListener("resize", () => {

        desplazamiento = 0;

        actualizarCarrusel();

    });



    actualizarCarrusel();

});