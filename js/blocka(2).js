document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // IMÁGENES
    // =====================================================

    // Cambiá estas rutas por las 8 imágenes que quieras usar.
    const imagenesBlocka = [
        "../img/Simpsons/simpson-uno.png",
        "../img/Simpsons/simpson-dos.png",
        "../img/Simpsons/simpson-tres.png",
        "../img/Simpsons/simpson-cuatro.png",
        "../img/Simpsons/simpson-cinco.png",
        "../img/Simpsons/simpson-seis.png",
        "../img/Simpsons/simpson-siete.png",
        "../img/Simpsons/simpson-ocho.png"
    ];


    // =====================================================
    // ELEMENTOS DEL HTML
    // =====================================================

    const pantallaInicio = document.querySelector("#blocka-inicio");
    const btnJugar = document.querySelector("#blocka-jugar");
    const pantallaNiveles = document.querySelector("#blocka-niveles");
    const pantallaPiezas = document.querySelector("#blocka-piezas");
    const pantallaGaleria = document.querySelector("#blocka-galeria");
    const pantallaJuego = document.querySelector("#blocka-juego");
    const pantallaCompletado = document.querySelector("#blocka-completado");

    const btnMenu = document.querySelector("#blocka-menu");
    const btnVolverNiveles = document.querySelector("#blocka-volver-niveles");
    const btnComenzar = document.querySelector("#blocka-comenzar");
    const btnVolverPiezas = document.querySelector("#blocka-volver-piezas");
    const btnAzar = document.querySelector("#blocka-azar");

    const btnSalir = document.querySelector("#blocka-salir");
    const btnPausar = document.querySelector("#boton-pausar");
    const btnContinuar = document.querySelector("#blocka-continuar");
    const btnAyuda = document.querySelector("#blocka-ayuda");

    const btnSiguiente = document.querySelector("#blocka-siguiente");
    const btnSeleccionarNivel = document.querySelector("#blocka-seleccionar");
    const btnMenuPrincipal = document.querySelector("#blocka-menu-final");

    const canvas = document.querySelector("#canvas-blocka");
    const ctx = canvas.getContext("2d");

    const cronometro = document.querySelector("#cronometro");
    const tiempoFinal = document.querySelector("#blocka-tiempo-final");

    const nivelElegidoLabel =
        document.querySelector("#blocka-nivel-label");

    const filtroElegidoLabel =
        document.querySelector("#blocka-filtro-label");

    const juegoNivel =
        document.querySelector("#blocka-juego-nivel");

    const juegoInstruccion =
        document.querySelector("#blocka-juego-piezas");

    const galeria =
        document.querySelector("#blocka-galeria-lista");

    const pausaOverlay =
        document.querySelector("#blocka-pausa");


    // =====================================================
    // CONFIGURACIÓN DE NIVELES
    // =====================================================

    const niveles = {
        1: {
            nombre: "Escala de grises",
            filtro: "grayscale(100%)"
        },

        2: {
            nombre: "Brillo al 30%",
            filtro: "brightness(130%)"
        },

        3: {
            nombre: "Filtro negativo",
            filtro: "invert(100%)"
        },

        4: {
            nombre: "Imagen borrosa",
            filtro: "blur(5px)"
        }
    };


    // =====================================================
    // VARIABLES DEL JUEGO
    // =====================================================

    let nivelActual = 1;

    let columnas = 2;
    let filas = 2;

    let imagenActual = 0;

    let imagen = null;

    let piezas = [];

    let segundos = 0;

    let intervalo = null;

    let pausado = false;

    let ayudaUsada = false;

    let juegoActivo = false;


    // =====================================================
    // CAMBIAR DE PANTALLA
    // =====================================================

    function mostrarPantalla(pantalla) {

        pantallaInicio.hidden = true;
        pantallaNiveles.hidden = true;
        pantallaPiezas.hidden = true;
        pantallaGaleria.hidden = true;
        pantallaJuego.hidden = true;
        pantallaCompletado.hidden = true;

        pantalla.hidden = false;
    }


    // =====================================================
    // BOTÓN JUGAR
    // =====================================================

    btnJugar.addEventListener("click", () => {

        mostrarPantalla(pantallaNiveles);

    });


    // =====================================================
    // VOLVER AL MENÚ
    // =====================================================

    btnMenu.addEventListener("click", () => {

        mostrarPantalla(pantallaInicio);

    });


    // =====================================================
    // SELECCIÓN DE NIVEL
    // =====================================================

    document.querySelectorAll(".blocka-nivel").forEach(boton => {

        boton.addEventListener("click", () => {

            nivelActual = Number(boton.dataset.nivel);

            nivelElegidoLabel.textContent =
                "NIVEL " + nivelActual;

            filtroElegidoLabel.textContent =
                niveles[nivelActual].nombre;

            mostrarPantalla(pantallaPiezas);

        });

    });


    // =====================================================
    // SELECCIÓN DE CANTIDAD DE PIEZAS
    // =====================================================

    document.querySelectorAll(".blocka__tamanio").forEach(boton => {

        boton.addEventListener("click", () => {

            document
                .querySelectorAll(".blocka__tamanio")
                .forEach(opcion => {
                    opcion.classList.remove("blocka__tamanio--activo");
                });

            boton.classList.add("blocka__tamanio--activo");

            columnas = Number(boton.dataset.columnas);
            filas = Number(boton.dataset.filas);

        });

    });


    // =====================================================
    // VOLVER A NIVELES
    // =====================================================

    btnVolverNiveles.addEventListener("click", () => {

        mostrarPantalla(pantallaNiveles);

    });


    // =====================================================
    // COMENZAR
    // =====================================================

    btnComenzar.addEventListener("click", () => {

        imagenActual = Math.floor(Math.random() * imagenesBlocka.length);

        mostrarPantalla(pantallaJuego);

        iniciarJuego();

    });

    btnVolverPiezas.addEventListener("click", () => {

        mostrarPantalla(pantallaPiezas);

    });

    btnAzar.addEventListener("click", () => {

        seleccionarImagen(
            Math.floor(Math.random() * imagenesBlocka.length)
        );

    });


    // =====================================================
    // GALERÍA DE IMÁGENES
    // =====================================================

    function prepararGaleria() {

        galeria.innerHTML = "";

        imagenesBlocka.forEach((ruta, indice) => {

            const tarjeta = document.createElement("button");

            tarjeta.type = "button";

            tarjeta.className = "galeria-card";

            tarjeta.innerHTML = `
                <span class="galeria-card__numero">
                    ${indice + 1}
                </span>

                <img
                    src="${ruta}"
                    alt="Imagen ${indice + 1}"
                >
            `;

            tarjeta.addEventListener("click", () => {

                seleccionarImagen(indice);

            });

            galeria.appendChild(tarjeta);

        });


        // Elegimos una imagen al azar.

        const indiceAzar =
            Math.floor(Math.random() * imagenesBlocka.length);

        setTimeout(() => {

            seleccionarImagen(indiceAzar);

        }, 800);

    }


    // =====================================================
    // SELECCIONAR IMAGEN
    // =====================================================

    function seleccionarImagen(indice) {

        imagenActual = indice;

        document
            .querySelectorAll(".galeria-card")
            .forEach(card => {

                card.classList.remove(
                    "galeria-card--seleccionada"
                );

            });

        const tarjetas =
            document.querySelectorAll(".galeria-card");

        if (tarjetas[indice]) {

            tarjetas[indice]
                .classList
                .add("galeria-card--seleccionada");

        }


        setTimeout(() => {

            iniciarJuego();

        }, 400);

    }


    // =====================================================
    // INICIAR JUEGO
    // =====================================================

    function iniciarJuego() {

        detenerCronometro();

        segundos = 0;

        pausado = false;

        ayudaUsada = false;

        juegoActivo = true;

        cronometro.textContent = "00:00";

        juegoNivel.textContent =
            "Nivel " + nivelActual;

        juegoInstruccion.textContent =
            columnas * filas +
            " piezas · " +
            niveles[nivelActual].nombre;

        btnAyuda.disabled = false;

        pausaOverlay.hidden = true;

        btnPausar.innerHTML =
            '<i class="fa-solid fa-pause"></i><span>Pausar</span>';

        cargarImagen();

    }


    // =====================================================
    // CARGAR IMAGEN
    // =====================================================

    function cargarImagen() {

        imagen = new Image();

        imagen.onload = () => {

            crearPiezas();

            dibujarTablero();

            iniciarCronometro();

        };

        imagen.src = imagenesBlocka[imagenActual];

    }


    // =====================================================
    // CREAR PIEZAS
    // =====================================================

    function crearPiezas() {

        piezas = [];

        for (let fila = 0; fila < filas; fila++) {

            for (let columna = 0; columna < columnas; columna++) {

                // La pieza empieza rotada.
                const rotacionInicial =
                    Math.floor(Math.random() * 3) + 1;

                piezas.push({

                    fila: fila,

                    columna: columna,

                    rotacion: rotacionInicial,

                    bloqueada: false

                });

            }

        }

    }


    // =====================================================
    // DIBUJAR TABLERO
    // =====================================================

    function dibujarTablero() {

        if (!imagen) {
            return;
        }

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const anchoPieza =
            canvas.width / columnas;

        const altoPieza =
            canvas.height / filas;


        const anchoImagen =
            imagen.width / columnas;

        const altoImagen =
            imagen.height / filas;


        piezas.forEach(pieza => {

            const sx =
                pieza.columna * anchoImagen;

            const sy =
                pieza.fila * altoImagen;

            const x =
                pieza.columna * anchoPieza;

            const y =
                pieza.fila * altoPieza;


            ctx.save();


            // Aplicamos el filtro del nivel.

            ctx.filter =
                niveles[nivelActual].filtro;


            // Rotamos alrededor del centro.

            ctx.translate(
                x + anchoPieza / 2,
                y + altoPieza / 2
            );

            ctx.rotate(
                pieza.rotacion * Math.PI / 2
            );


            ctx.drawImage(
                imagen,

                sx,
                sy,

                anchoImagen,
                altoImagen,

                -anchoPieza / 2,
                -altoPieza / 2,

                anchoPieza,
                altoPieza
            );


            ctx.restore();


            // Bordes.

            ctx.strokeStyle = "#102d49";

            ctx.lineWidth = 3;

            ctx.strokeRect(
                x,
                y,
                anchoPieza,
                altoPieza
            );


            // Marcamos la pieza colocada
            // mediante ayuda.

            if (pieza.bloqueada) {

                ctx.strokeStyle = "#65c56b";

                ctx.lineWidth = 5;

                ctx.strokeRect(
                    x + 3,
                    y + 3,
                    anchoPieza - 6,
                    altoPieza - 6
                );

            }

        });

    }


    // =====================================================
    // CLICK IZQUIERDO
    // =====================================================

    canvas.addEventListener("click", event => {

        if (!juegoActivo || pausado) {
            return;
        }

        const pieza =
            obtenerPieza(event);

        if (!pieza || pieza.bloqueada) {
            return;
        }


        // Izquierda = gira hacia la izquierda.

        pieza.rotacion =
            (pieza.rotacion + 3) % 4;


        dibujarTablero();

        comprobarVictoria();

    });


    // =====================================================
    // CLICK DERECHO
    // =====================================================

    canvas.addEventListener("contextmenu", event => {

        event.preventDefault();

        if (!juegoActivo || pausado) {
            return;
        }

        const pieza =
            obtenerPieza(event);

        if (!pieza || pieza.bloqueada) {
            return;
        }


        // Derecha = gira hacia la derecha.

        pieza.rotacion =
            (pieza.rotacion + 1) % 4;


        dibujarTablero();

        comprobarVictoria();

    });


    // =====================================================
    // OBTENER PIEZA CLICKEADA
    // =====================================================

    function obtenerPieza(event) {

        const rect =
            canvas.getBoundingClientRect();


        const escalaX =
            canvas.width / rect.width;

        const escalaY =
            canvas.height / rect.height;


        const x =
            (event.clientX - rect.left) *
            escalaX;

        const y =
            (event.clientY - rect.top) *
            escalaY;


        const anchoPieza =
            canvas.width / columnas;

        const altoPieza =
            canvas.height / filas;


        const columna =
            Math.floor(x / anchoPieza);

        const fila =
            Math.floor(y / altoPieza);


        return piezas.find(pieza =>

            pieza.columna === columna &&
            pieza.fila === fila

        );

    }


    // =====================================================
    // AYUDA
    // =====================================================

    btnAyuda.addEventListener("click", () => {

        if (
            ayudaUsada ||
            pausado ||
            !juegoActivo
        ) {
            return;
        }


        const piezasIncorrectas =
            piezas.filter(pieza =>

                pieza.rotacion !== 0 &&
                !pieza.bloqueada

            );


        if (piezasIncorrectas.length === 0) {
            return;
        }


        const pieza =
            piezasIncorrectas[
                Math.floor(
                    Math.random() *
                    piezasIncorrectas.length
                )
            ];


        // La acomodamos.

        pieza.rotacion = 0;

        pieza.bloqueada = true;


        // La ayuda suma 5 segundos.

        segundos += 5;

        actualizarCronometro();


        ayudaUsada = true;

        btnAyuda.disabled = true;


        dibujarTablero();

        comprobarVictoria();

    });


    // =====================================================
    // CRONÓMETRO
    // =====================================================

    function iniciarCronometro() {

        detenerCronometro();

        intervalo = setInterval(() => {

            if (!pausado) {

                segundos++;

                actualizarCronometro();

            }

        }, 1000);

    }


    function detenerCronometro() {

        if (intervalo) {

            clearInterval(intervalo);

            intervalo = null;

        }

    }


    function actualizarCronometro() {

        const minutos =
            Math.floor(segundos / 60);

        const segundosRestantes =
            segundos % 60;


        cronometro.textContent =

            String(minutos).padStart(2, "0") +
            ":" +
            String(segundosRestantes).padStart(2, "0");

    }


    // =====================================================
    // PAUSAR
    // =====================================================

    btnPausar.addEventListener("click", () => {

        pausado = !pausado;

        pausaOverlay.hidden = !pausado;


        if (pausado) {

            btnPausar.innerHTML =
                '<i class="fa-solid fa-play"></i><span>Continuar</span>';

        } else {

            btnPausar.innerHTML =
                '<i class="fa-solid fa-pause"></i><span>Pausar</span>';

        }

    });


    btnContinuar.addEventListener("click", () => {

        pausado = false;

        pausaOverlay.hidden = true;

        btnPausar.innerHTML =
            '<i class="fa-solid fa-pause"></i><span>Pausar</span>';

    });


    // =====================================================
    // SALIR
    // =====================================================

    btnSalir.addEventListener("click", () => {

        detenerCronometro();

        juegoActivo = false;

        mostrarPantalla(
            pantallaInicio
        );

    });


    // =====================================================
    // COMPROBAR SI GANÓ
    // =====================================================

    function comprobarVictoria() {

        const completo =
            piezas.length > 0 &&
            piezas.every(pieza =>
                pieza.rotacion === 0
            );


        if (!completo) {
            return;
        }


        juegoActivo = false;

        detenerCronometro();


        // Primero mostramos la imagen
        // completamente armada y sin filtro.

        dibujarImagenOriginal();


        tiempoFinal.textContent =
            cronometro.textContent;


        setTimeout(() => {

            mostrarPantalla(
                pantallaCompletado
            );

        }, 1000);

    }


    // =====================================================
    // IMAGEN FINAL SIN FILTRO
    // =====================================================

    function dibujarImagenOriginal() {

        if (!imagen) {
            return;
        }


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Sacamos el filtro.

        ctx.filter = "none";


        ctx.drawImage(
            imagen,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Borde verde.

        ctx.strokeStyle = "#65c56b";

        ctx.lineWidth = 8;

        ctx.strokeRect(
            4,
            4,
            canvas.width - 8,
            canvas.height - 8
        );

    }


    // =====================================================
    // SIGUIENTE NIVEL
    // =====================================================

    btnSiguiente.addEventListener("click", () => {

        if (nivelActual < 4) {

            nivelActual++;

            nivelElegidoLabel.textContent =
                "NIVEL " + nivelActual;

            filtroElegidoLabel.textContent =
                niveles[nivelActual].nombre;

            mostrarPantalla(pantallaPiezas);

        } else {

            // Si terminó el nivel 4,
            // vuelve a selección de niveles.

            mostrarPantalla(pantallaNiveles);

        }

    });


    // =====================================================
    // SELECCIONAR NIVEL
    // =====================================================

    btnSeleccionarNivel.addEventListener("click", () => {

        detenerCronometro();

        mostrarPantalla(pantallaNiveles);

    });


    // =====================================================
    // MENÚ PRINCIPAL
    // =====================================================

    btnMenuPrincipal.addEventListener("click", () => {

        detenerCronometro();

        mostrarPantalla(
            pantallaInicio
        );

    });

});
