
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
     * Iguala la altura de la portada a la del juego.
     *
     * El juego esta oculto con display:none, asi que primero
     * se lo muestra de forma invisible (visibility:hidden) para
     * poder medirlo, y despues se vuelve a ocultar.
     */
    let midiendo = false;

    function igualarAlturas() {

        // Solo mientras la portada esta visible y sin medicion en curso.
        if (!pantallaInicio || !pantallaJuego || pantallaInicio.hidden || midiendo) {
            return;
        }

        midiendo = true;

        /*
         * El tamanio del tablero depende de la posicion en pantalla
         * (ver ajustarCanvas en peg-solitaire.js). Para que la medida
         * coincida con el juego en accion, la portada se saca del flujo
         * (display:none) y el juego toma su lugar. Todo en el mismo
         * frame: no hay parpadeo.
         */
        pantallaInicio.style.display = "none";

        pantallaJuego.classList.remove("peg--oculto");
        pantallaJuego.style.visibility = "hidden";

        // peg-solitaire.js ajusta el tablero al escuchar resize.
        window.dispatchEvent(new Event("resize"));

        const altoJuego = pantallaJuego.offsetHeight;

        pantallaJuego.style.visibility = "";
        pantallaJuego.classList.add("peg--oculto");

        pantallaInicio.style.display = "";

        /*
         * Solo actualizar la altura si la diferencia es significativa:
         * variaciones de 1-2px (redondeo, scrollbar) no valen otra
         * pasada, que es justamente lo que generaba la oscilacion.
         */
        const altoActual = pantallaInicio.offsetHeight;

        if (altoJuego > 0 && Math.abs(altoJuego - altoActual) > 4) {
            pantallaInicio.style.height = altoJuego + "px";
        }

        midiendo = false;
    }

    igualarAlturas();

    /*
     * Re-medir cuando el usuario cambia el tamanio de la ventana.
     *
     * Se usa un debounce: el browser dispara varios resize seguidos
     * (incluida la aparicion/desaparicion de la scrollbar, que en
     * si misma cambia la altura disponible). Si se re-medira en cada
     * evento, la medicion de una vuelta alimenta la de la siguiente
     * y la portada oscila entre recargas/ajustes de ventana.
     */
    let temporizadorMedicion = null;

    window.addEventListener("resize", () => {

        clearTimeout(temporizadorMedicion);
        temporizadorMedicion = setTimeout(igualarAlturas, 150);
    });


    /*
     * Oculta la pantalla inicial y
     * muestra el canvas del juego.
     */
    function iniciarJuego() {

        if (pantallaInicio.classList.contains("peg-inicio--saliendo")) {
            return;
        }

        // Animar la salida de la portada.
        pantallaInicio.classList.add("peg-inicio--saliendo");

        window.setTimeout(() => {

            // Ocultar la portada y mostrar el juego.
            pantallaInicio.hidden = true;
            pantallaInicio.style.height = "";
            pantallaJuego.classList.remove("peg--oculto");

            // Recalcular el canvas ahora que es visible.
            window.dispatchEvent(new Event("resize"));

            pantallaJuego.setAttribute("tabindex", "-1");
            pantallaJuego.focus({ preventScroll: true });

        }, 320);

    }


    /*
     * Escucha el click del boton JUGAR
     * y llama a iniciarJuego().
     */
    botonJugar.addEventListener(
        "click",
        iniciarJuego
    );

});
