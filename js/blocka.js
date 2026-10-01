const canvas = document.querySelector("#canvas-blocka");
const ctx = canvas.getContext("2d");

const botonesTamanio =
    document.querySelectorAll(".blocka__tamanio");

let tamanioTablero = 4;


// primero creo la imagen
const imagen = new Image();


// primero defino qué pasa cuando carga
imagen.onload = function () {

    console.log("imagen cargada");

    dibujarTablero();

};


// después recién le doy la ruta
imagen.src = "../img/blocka.png";



function dibujarTablero() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const anchoFicha =
        canvas.width / tamanioTablero;

    const altoFicha =
        canvas.height / tamanioTablero;


    const anchoImagen =
        imagen.width / tamanioTablero;

    const altoImagen =
        imagen.height / tamanioTablero;


    for (let fila = 0; fila < tamanioTablero; fila++) {

        for (
            let columna = 0;
            columna < tamanioTablero;
            columna++
        ) {

            const sx =
                columna * anchoImagen;

            const sy =
                fila * altoImagen;


            const x =
                columna * anchoFicha;

            const y =
                fila * altoFicha;


            ctx.drawImage(
                imagen,

                sx,
                sy,
                anchoImagen,
                altoImagen,

                x,
                y,
                anchoFicha,
                altoFicha
            );


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



botonesTamanio.forEach(function (boton) {

    boton.addEventListener("click", function () {

        tamanioTablero =
            Number(boton.dataset.tamanio);

        botonesTamanio.forEach(function (otroBoton) {

            otroBoton.classList.remove(
                "blocka__tamanio--activo"
            );

        });

        boton.classList.add(
            "blocka__tamanio--activo"
        );

        dibujarTablero();

    });

});