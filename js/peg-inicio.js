

"use strict";

/*
 * PANTALLA DE INICIO DE PEG SOLITAIRE
 *
 * Permite pasar de la portada al juego
 * cuando el usuario presiona JUGAR.
 */

document.addEventListener("DOMContentLoaded", () => {

    // Obtener los elementos del HTML.

    const pantallaInicio =
        document.querySelector("#peg-inicio");

    const pantallaJuego =
        document.querySelector("#peg-juego");

    const botonJugar =
        document.querySelector("#btn-iniciar-peg");

    /*
     * Controla si ya se esta midiendo
     * la altura de la pantalla.
     */
    let midiendo = false;

    /**
     * Iguala la altura de la portada con la del juego.
     *
     * 1. Comprueba que existan las pantallas y que no
     *    haya otra medicion en proceso.
     * 2. Oculta temporalmente la portada.
     * 3. Muestra el juego de manera invisible para
     *    poder obtener su altura.
     * 4. Dispara un evento resize para ajustar el canvas.
     * 5. Mide la altura del juego y restaura las pantallas.
     * 6. Solo actualiza la portada si hay mas de 4 px
     *    de diferencia, evitando oscilaciones.
     */
    function igualarAlturas() {

        if (!pantallaInicio || !pantallaJuego ||
            pantallaInicio.hidden || midiendo) {
            return;
        }

        midiendo = true;

        pantallaInicio.style.display = "none";

        pantallaJuego.classList.remove("peg--oculto");
        pantallaJuego.style.visibility = "hidden";

        window.dispatchEvent(new Event("resize"));

        const altoJuego = pantallaJuego.offsetHeight;

        pantallaJuego.style.visibility = "";
        pantallaJuego.classList.add("peg--oculto");

        pantallaInicio.style.display = "";

        const altoActual = pantallaInicio.offsetHeight;

        if (altoJuego > 0 &&
            Math.abs(altoJuego - altoActual) > 4) {
            pantallaInicio.style.height = altoJuego + "px";
        }

        midiendo = false;
    }

    // Igualar alturas al cargar el documento.
    igualarAlturas();

    /*
     * Si cambia el tamaño de la ventana, se vuelve
     * a medir la altura.
     *
     * Se espera 150 ms desde el ultimo evento resize
     * para evitar recalcular continuamente (debounce).
     */
    let temporizadorMedicion = null;

    window.addEventListener("resize", () => {

        clearTimeout(temporizadorMedicion);

        temporizadorMedicion =
            setTimeout(igualarAlturas, 150);
    });

    /**
     * Inicia el juego al presionar el boton JUGAR.
     *
     * 1. Evita ejecutar la transicion dos veces.
     * 2. Agrega la clase CSS que anima la salida.
     * 3. Espera 320 ms para completar la animacion.
     * 4. Oculta la portada y muestra el tablero.
     * 5. Dispara resize para recalcular el canvas.
     * 6. Coloca el foco en el juego sin desplazar
     *    automaticamente la pagina.
     */
    function iniciarJuego() {

        if (pantallaInicio.classList.contains(
            "peg-inicio--saliendo"
        )) {
            return;
        }

        pantallaInicio.classList.add(
            "peg-inicio--saliendo"
        );

        window.setTimeout(() => {

            pantallaInicio.hidden = true;
            pantallaInicio.style.height = "";

            pantallaJuego.classList.remove("peg--oculto");

            window.dispatchEvent(new Event("resize"));

            pantallaJuego.setAttribute("tabindex", "-1");

            pantallaJuego.focus({
                preventScroll: true
            });

        }, 320);
    }

    // Asociar el boton JUGAR con iniciarJuego().
    botonJugar.addEventListener("click", iniciarJuego);

});
