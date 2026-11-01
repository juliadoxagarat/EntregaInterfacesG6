
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
     * Oculta la pantalla inicial y
     * muestra el canvas del juego.
     */
    function iniciarJuego() {

        // Ocultar la portada.
        pantallaInicio.style.display = "none";

        // Mostrar el juego.
        pantallaJuego.classList.remove("peg--oculto");

        // Recalcular el tamaño del canvas
        // ahora que el juego es visible.
        window.dispatchEvent(new Event("resize"));

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
