const carruseles = document.querySelectorAll("[data-carrusel]");


carruseles.forEach((carrusel) => {

    // parte q se ve del carrusel
    const ventana = carrusel.querySelector(".carrusel-juegos__ventana");
    const botonAnterior = carrusel.querySelector(
        '[data-direccion="anterior"]'
    );


    const botonSiguiente = carrusel.querySelector(
        '[data-direccion="siguiente"]'
    );


    // al principio la flecha izquierdano se ve
    botonAnterior.hidden = true;


    // flecha der
    botonSiguiente.addEventListener("click", () => {

        // llevo el carrusel hasta el final
        ventana.scrollTo({
            left: ventana.scrollWidth,
            behavior: "smooth"
        });


        botonAnterior.hidden = false;
        botonSiguiente.hidden = true;

    });



    // flecha izqu
    botonAnterior.addEventListener("click", () => {

        // vuelvo el carrusel al principio
        ventana.scrollTo({
            left: 0,
            behavior: "smooth"
        });
        botonAnterior.hidden = true;


        botonSiguiente.hidden = false;

    });

});