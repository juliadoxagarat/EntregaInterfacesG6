// -----------------------------
// CANVAS
// -----------------------------

const canvas = document.querySelector("#canvas-blocka");

const ctx = canvas.getContext("2d");



// -----------------------------
// BOTONES DE TAMAÑO
// -----------------------------

const botonesTamanio =
    document.querySelectorAll(".blocka__tamanio");



// -----------------------------
// TAMAÑO INICIAL DEL TABLERO
// -----------------------------

let columnas = 2;
let filas = 2;



// -----------------------------
// IMAGEN DEL PUZZLE
// -----------------------------

const imagen = new Image();


// primero definimos qué pasa
// cuando la imagen termina de cargar
imagen.onload = function () {

    console.log("Imagen cargada correctamente");

    dibujarTablero();

};


// por si hay un problema con la ruta
imagen.onerror = function () {

    console.log("No se pudo cargar la imagen");

};


// CAMBIÁ ESTA RUTA POR TU IMAGEN
imagen.src = "../img/Blocka.png";



// -----------------------------
// DIBUJAR TABLERO
// -----------------------------

function dibujarTablero() {

    // limpiamos el canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // -------------------------
    // TAMAÑO DE CADA FICHA
    // DENTRO DEL CANVAS
    // -------------------------

    const anchoFicha =
        canvas.width / columnas;

    const altoFicha =
        canvas.height / filas;


    // -------------------------
    // TAMAÑO DE CADA FRAGMENTO
    // DE LA IMAGEN ORIGINAL
    // -------------------------

    const anchoImagen =
        imagen.width / columnas;

    const altoImagen =
        imagen.height / filas;


    // -------------------------
    // RECORREMOS TODO EL TABLERO
    // -------------------------

    for (
        let fila = 0;
        fila < filas;
        fila++
    ) {

        for (
            let columna = 0;
            columna < columnas;
            columna++
        ) {

            // -------------------------
            // POSICIÓN EN LA IMAGEN
            // ORIGINAL
            // -------------------------

            const sx =
                columna * anchoImagen;

            const sy =
                fila * altoImagen;


            // -------------------------
            // POSICIÓN EN EL CANVAS
            // -------------------------

            const x =
                columna * anchoFicha;

            const y =
                fila * altoFicha;


            // -------------------------
            // DIBUJAMOS EL FRAGMENTO
            // -------------------------

            ctx.drawImage(

                imagen,

                // parte de la imagen original
                sx,
                sy,
                anchoImagen,
                altoImagen,

                // posición dentro del canvas
                x,
                y,
                anchoFicha,
                altoFicha

            );


            // -------------------------
            // BORDE DE CADA FICHA
            // -------------------------

            ctx.strokeStyle = "#102d49";

            ctx.lineWidth = 2;


            ctx.strokeRect(
                x,
                y,
                anchoFicha,
                altoFicha
            );

        }

    }

}



// -----------------------------
// CAMBIAR TAMAÑO DEL TABLERO
// -----------------------------

botonesTamanio.forEach(function (boton) {

    boton.addEventListener(
        "click",
        function () {

            // obtenemos las columnas
            // desde data-columnas
            columnas =
                Number(
                    boton.dataset.columnas
                );


            // obtenemos las filas
            // desde data-filas
            filas =
                Number(
                    boton.dataset.filas
                );


            // -------------------------
            // SACAMOS EL ACTIVO
            // DE TODOS LOS BOTONES
            // -------------------------

            botonesTamanio.forEach(
                function (otroBoton) {

                    otroBoton.classList.remove(
                        "blocka__tamanio--activo"
                    );

                }
            );


            // -------------------------
            // MARCAMOS EL SELECCIONADO
            // -------------------------

            boton.classList.add(
                "blocka__tamanio--activo"
            );


            // -------------------------
            // VOLVEMOS A DIBUJAR
            // -------------------------

            dibujarTablero();

        }
    );

});

// -----------------------------
// CRONÓMETRO
// -----------------------------

const cronometro =
    document.querySelector("#cronometro");

const botonPausar =
    document.querySelector("#boton-pausar");


let segundos = 0;

let intervalo;

let pausado = false;



function actualizarCronometro() {

    segundos++;


    const minutos =
        Math.floor(segundos / 60);

    const segundosRestantes =
        segundos % 60;


    const minutosTexto =
        String(minutos).padStart(2, "0");

    const segundosTexto =
        String(segundosRestantes).padStart(2, "0");


    cronometro.textContent =
        `${minutosTexto}:${segundosTexto}`;

}



function iniciarCronometro() {

    intervalo =
        setInterval(
            actualizarCronometro,
            1000
        );

}



botonPausar.addEventListener("click", function () {

    if (!pausado) {

        clearInterval(intervalo);

        pausado = true;

        botonPausar.textContent = "Continuar";

    } else {

        iniciarCronometro();

        pausado = false;

        botonPausar.textContent = "Pausar";

    }

});



iniciarCronometro();