document.addEventListener("DOMContentLoaded", () => {

// =====================================================
// IMÁGENES SEGÚN CANTIDAD DE PIEZAS
// =====================================================

const imagenesPorPiezas = {

    4: [
        "../img/Simpsons/simpson-uno.png",
        "../img/Simpsons/simpson-dos.png",
        "../img/Simpsons/simpson-tres.png",
        "../img/Simpsons/simpson-cuatro.jpg",
        "../img/Simpsons/simpson-cinco.png",
        "../img/Simpsons/simpson-seis.png",
        "../img/Simpsons/simpson-siete.png",
        "../img/Simpsons/simpson-ocho.png"
    ],

    9: [
        "../img/Futurama/futurama1.png",
        "../img/Futurama/futurama2.jpg",
        "../img/Futurama/futurama3.jpg",
        "../img/Futurama/futurama4.avif",
        "../img/Futurama/futurama5.jpg",
        "../img/Futurama/futurama6.jpg",
        "../img/Futurama/futurama7.jpg",
        "../img/Futurama/futurama8.jpg"
    ],

    16: [
        "../img/RickYMorty/rickYmorty-uno.png",
        "../img/RickYMorty/rickYmorty-dos.png",
        "../img/RickYMorty/rickYmorty-tres.jpg",
        "../img/RickYMorty/rickYmorty-cuatro.png",
        "../img/RickYMorty/rickYmorty-cinco.png",
        "../img/RickYMorty/rickYmorty-seis.png",
        "../img/RickYMorty/rickYmorty-siete.jpg",
        "../img/RickYMorty/rickYmorty-ocho.png"
    ]
};


let imagenesBlocka = imagenesPorPiezas[4];


    // =====================================================
    // ELEMENTOS DEL HTML
    // =====================================================

    const pantallaInicio =
        document.querySelector("#blocka-inicio");

    const btnJugar =
        document.querySelector("#blocka-jugar");

    const pantallaNiveles =
        document.querySelector("#blocka-niveles");

    const pantallaPiezas =
        document.querySelector("#blocka-piezas");

    const pantallaGaleria =
        document.querySelector("#blocka-galeria");

    const pantallaJuego =
        document.querySelector("#blocka-juego");

    const pantallaCompletado =
        document.querySelector("#blocka-completado");


    const btnMenu =
        document.querySelector("#blocka-menu");

    const btnVolverNiveles =
        document.querySelector("#blocka-volver-niveles");

    const btnComenzar =
        document.querySelector("#blocka-comenzar");

    const btnSalir =
        document.querySelector("#blocka-salir");

    const btnPausar =
        document.querySelector("#boton-pausar");

    const btnContinuar =
        document.querySelector("#blocka-continuar");

    const btnAyuda =
        document.querySelector("#blocka-ayuda");


    const btnSiguiente =
        document.querySelector("#blocka-siguiente");

    const btnSeleccionarNivel =
        document.querySelector("#blocka-seleccionar");

    const btnMenuPrincipal =
        document.querySelector("#blocka-menu-final");


    const canvas =
        document.querySelector("#canvas-blocka");

    const ctx =
        canvas.getContext("2d");


    // Canvas auxiliar.
    // Acá guardamos la imagen después de aplicar
    // el filtro píxel por píxel.
    const canvasFiltrado =
        document.createElement("canvas");

    const ctxFiltrado =
        canvasFiltrado.getContext("2d");


    const cronometro =
        document.querySelector("#cronometro");

    const tiempoFinal =
        document.querySelector("#blocka-tiempo-final");


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

    pantallaGaleria
        .querySelector(".blocka-pantalla__titulo")
        .remove();

    const pausaOverlay =
        document.querySelector("#blocka-pausa");


    // =====================================================
    // CONFIGURACIÓN DE NIVELES
    // =====================================================

    /*
        Ya no guardamos filtros como:

        grayscale()
        brightness()
        invert()
        blur()

        porque ahora los filtros los hacemos nosotros
        modificando los píxeles de la imagen.
    */

    const niveles = {

        1: {
            nombre: "Escala de grises"
        },

        2: {
            nombre: "Brillo al 30%"
        },

        3: {
            nombre: "Filtro negativo"
        },

        4: {
            nombre: "Imagen borrosa"
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

    document
        .querySelectorAll(".blocka-nivel")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                nivelActual =
                    Number(boton.dataset.nivel);

                nivelElegidoLabel.textContent =
                    "NIVEL " + nivelActual;

                filtroElegidoLabel.textContent =
                    niveles[nivelActual].nombre;

                mostrarPantalla(
                    pantallaPiezas
                );

            });

        });


    // =====================================================
    // SELECCIÓN DE CANTIDAD DE PIEZAS
    // =====================================================

    document
        .querySelectorAll(".blocka__tamanio")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                document
                    .querySelectorAll(".blocka__tamanio")
                    .forEach(opcion => {

                        opcion.classList.remove(
                            "blocka__tamanio--activo"
                        );

                    });


                boton.classList.add(
                    "blocka__tamanio--activo"
                );


                columnas =
                    Number(
                        boton.dataset.columnas
                    );


                filas =
                    Number(
                        boton.dataset.filas
                    );

                const cantidadPiezas =
                    columnas * filas;

                imagenesBlocka =
                    imagenesPorPiezas[cantidadPiezas];


                /*
                    =========================================
                    SELECCIÓN AUTOMÁTICA DE IMAGEN
                    =========================================
    
                    El usuario ya eligió:
                    - nivel
                    - cantidad de piezas
    
                    Ahora automáticamente mostramos
                    las 8 imágenes y empieza la animación.
                */

            });

        });

    // =====================================================
    // VOLVER A NIVELES
    // =====================================================

    btnVolverNiveles.addEventListener("click", () => {

        mostrarPantalla(
            pantallaNiveles
        );

    });


    // =====================================================
    // COMENZAR
    // =====================================================

    btnComenzar.addEventListener("click", () => {

        /*
            Primero mostramos la galería para que el jugador
            pueda ver las 8 imágenes.
    
            La imagen todavía NO se elige acá.
            La elección se hace visualmente mediante
            la animación de selección.
        */

        mostrarPantalla(
            pantallaGaleria
        );

        prepararGaleria();

    });

    // =====================================================
    // GALERÍA DE IMÁGENES
    // =====================================================

    function prepararGaleria() {

        galeria.innerHTML = "";


        /*
            Creamos LAS 8 imágenes.
        */

        imagenesBlocka.forEach(
            (ruta, indice) => {

                const tarjeta =
                    document.createElement("div");


                tarjeta.className =
                    "galeria-card";


                tarjeta.innerHTML = `
                <span class="galeria-card__numero">
                    ${indice + 1}
                </span>

                <img
                    src="${ruta}"
                    alt="Imagen ${indice + 1}"
                >
            `;


                /*
                    Ya NO permitimos seleccionar
                    manualmente una imagen.
    
                    La elección es solamente aleatoria.
                */


                galeria.appendChild(
                    tarjeta
                );

            }
        );


        /*
            Esperamos un momento para que las
            8 imágenes sean visibles.
        */

        setTimeout(() => {

            iniciarSeleccionAleatoria();

        }, 500);

    }

    function iniciarSeleccionAleatoria() {

        const tarjetas =
            document.querySelectorAll(
                ".galeria-card"
            );


        /*
            Tenemos que tener las 8 imágenes.
        */

        if (
            tarjetas.length !==
            imagenesBlocka.length
        ) {

            console.error(
                "La galería no tiene las 8 imágenes."
            );

            return;
        }


        /*
            Elegimos ALEATORIAMENTE cuál será
            la imagen final.
        */

        const indiceFinal =
            Math.floor(
                Math.random() *
                imagenesBlocka.length
            );


        /*
            3 vueltas completas antes de detenerse.
        */

        const vueltas = 3;


        const cantidadPasos =
            vueltas *
            tarjetas.length +
            indiceFinal;


        let pasoActual = 0;


        function avanzar() {

            /*
                Sacamos el borde anterior.
            */

            tarjetas.forEach(
                tarjeta => {

                    tarjeta.classList.remove(
                        "galeria-card--recorriendo"
                    );

                }
            );


            /*
                Imagen que se está recorriendo.
            */

            const indiceActual =
                pasoActual %
                tarjetas.length;


            tarjetas[indiceActual]
                .classList.add(
                    "galeria-card--recorriendo"
                );


            pasoActual++;


            /*
                Todavía no terminó.
            */

            if (
                pasoActual <=
                cantidadPasos
            ) {

                const progreso =
                    pasoActual /
                    cantidadPasos;


                /*
                    Empieza rápido y termina
                    más lentamente.
                */

                const velocidad =
                    70 +
                    Math.floor(
                        progreso * 180
                    );


                setTimeout(
                    avanzar,
                    velocidad
                );


                return;
            }


            /*
                ======================================
                IMAGEN FINAL
                ======================================
            */

            tarjetas.forEach(
                tarjeta => {

                    tarjeta.classList.remove(
                        "galeria-card--recorriendo"
                    );

                }
            );


            /*
                Marcamos la imagen que salió.
            */

            tarjetas[indiceFinal]
                .classList.add(
                    "galeria-card--seleccionada"
                );


            /*
                Guardamos cuál fue la elegida.
            */

            imagenActual =
                indiceFinal;


            /*
                Esperamos MUY poquito para que
                se vea cuál salió.
    
                Después entra SOLO al juego.
            */

            setTimeout(() => {

                iniciarJuego();

            }, 700);

        }


        avanzar();

    }

    // =====================================================
    // SELECCIÓN ALEATORIA ANIMADA
    // =====================================================

    function iniciarSeleccionAleatoria() {

        const tarjetas =
            document.querySelectorAll(
                ".galeria-card"
            );


        /*
            Si por alguna razón no hay tarjetas,
            no hacemos nada.
        */

        if (tarjetas.length === 0) {
            return;
        }


        /*
            Limpiamos cualquier selección anterior.
        */

        tarjetas.forEach(
            tarjeta => {

                tarjeta.classList.remove(
                    "galeria-card--recorriendo"
                );

                tarjeta.classList.remove(
                    "galeria-card--seleccionada"
                );

            }
        );


        /*
            ESTA es la elección aleatoria real.
    
            Elegimos qué imagen va a terminar
            siendo el rompecabezas.
        */

        const indiceFinal =
            Math.floor(
                Math.random() *
                imagenesBlocka.length
            );


        /*
            Hacemos varias vueltas por las imágenes
            antes de llegar a la imagen final.
    
            3 vueltas completas + posición final.
        */

        const vueltas = 3;

        const cantidadPasos =
            vueltas *
            tarjetas.length +
            indiceFinal;


        let pasoActual = 0;


        function avanzarSeleccion() {

            /*
                Sacamos el borde de todas las tarjetas.
            */

            tarjetas.forEach(
                tarjeta => {

                    tarjeta.classList.remove(
                        "galeria-card--recorriendo"
                    );

                }
            );


            /*
                Calculamos qué imagen se está
                recorriendo en este momento.
            */

            const indiceActual =
                pasoActual %
                tarjetas.length;


            /*
                Le ponemos el borde animado.
            */

            tarjetas[indiceActual]
                .classList.add(
                    "galeria-card--recorriendo"
                );


            pasoActual++;


            /*
                Todavía no llegamos a la imagen final.
            */

            if (
                pasoActual <= cantidadPasos
            ) {

                /*
                    Al principio pasa rápido.
    
                    Cerca del final se vuelve
                    un poco más lento para dar
                    sensación de que está por parar.
                */

                const progreso =
                    pasoActual /
                    cantidadPasos;


                const velocidad =
                    80 +
                    Math.floor(
                        progreso * 180
                    );


                setTimeout(
                    avanzarSeleccion,
                    velocidad
                );


                return;
            }


            /*
                ==========================================
                IMAGEN GANADORA
                ==========================================
            */

            tarjetas.forEach(
                tarjeta => {

                    tarjeta.classList.remove(
                        "galeria-card--recorriendo"
                    );

                    tarjeta.classList.remove(
                        "galeria-card--seleccionada"
                    );

                }
            );


            /*
                Dejamos marcada la imagen que
                salió aleatoriamente.
            */

            tarjetas[indiceFinal]
                .classList.add(
                    "galeria-card--seleccionada"
                );


            /*
                Guardamos el resultado de la
                selección aleatoria.
            */

            imagenActual =
                indiceFinal;


            /*
                Dejamos la imagen ganadora
                visible un momento.
            */

            setTimeout(() => {

                iniciarJuego();

            }, 900);

        }


        /*
            Arrancamos la animación.
        */

        avanzarSeleccion();

    }

    // =====================================================
    // SELECCIONAR IMAGEN
    // =====================================================




    // =====================================================
    // INICIAR JUEGO
    // =====================================================

    function iniciarJuego() {

        detenerCronometro();

        segundos = 0;

        pausado = false;

        ayudaUsada = false;

        juegoActivo = true;


        cronometro.textContent =
            "00:00";


        juegoNivel.textContent =
            "Nivel " + nivelActual;


        juegoInstruccion.textContent =
            columnas * filas +
            " piezas · " +
            niveles[nivelActual].nombre;


        btnAyuda.disabled =
            false;


        pausaOverlay.hidden =
            true;


        btnPausar.innerHTML =
            '<i class="fa-solid fa-pause"></i><span>Pausar</span>';


        mostrarPantalla(
            pantallaJuego
        );

        cargarImagen();

    }


    // =====================================================
    // CARGAR IMAGEN
    // =====================================================

    /*
        La imagen se carga de manera asincrónica.

        Esperamos a que termine de cargar usando
        onload y recién ahí trabajamos con ella.
    */

    function cargarImagen() {

        const rutaImagen =
            imagenesBlocka[imagenActual];

        imagen = new Image();

        imagen.onload = function () {

            try {
                aplicarFiltro();
            } catch (error) {
                console.error("No se pudo aplicar el filtro:", error);

                canvasFiltrado.width = imagen.naturalWidth;
                canvasFiltrado.height = imagen.naturalHeight;

                ctxFiltrado.drawImage(
                    imagen,
                    0,
                    0
                );
            }

            crearPiezas();

            dibujarTablero();

            iniciarCronometro();
        };


        imagen.onerror = function () {

            console.error(
                "No se pudo cargar la imagen:",
                rutaImagen
            );

        };


        imagen.src = rutaImagen;
        //aca iria el if para cargar el arreglo de img segun el nivel
    }


    // =====================================================
    // APLICAR FILTRO A LA IMAGEN
    // =====================================================

    function aplicarFiltro() {

        /*
            El canvas auxiliar tiene el mismo
            tamaño que la imagen original.
        */

        canvasFiltrado.width =
            imagen.width;

        canvasFiltrado.height =
            imagen.height;

        const filtrosPorNivel = {
            1: "grayscale(100%)",
            2: "brightness(130%)",
            3: "invert(100%)",
            4: "blur(5px)"
        };

        ctxFiltrado.clearRect(
            0,
            0,
            canvasFiltrado.width,
            canvasFiltrado.height
        );

        ctxFiltrado.filter =
            filtrosPorNivel[nivelActual] || "none";

        ctxFiltrado.drawImage(
            imagen,
            0,
            0,
            canvasFiltrado.width,
            canvasFiltrado.height
        );

        ctxFiltrado.filter = "none";

        return;


        /*
            Primero dibujamos la imagen original
            en el canvas auxiliar.
        */

        ctxFiltrado.drawImage(
            imagen,
            0,
            0,
            canvasFiltrado.width,
            canvasFiltrado.height
        );


        /*
            El nivel 4 es distinto porque el blur
            necesita mirar los píxeles vecinos.

            Por eso tiene su propia función.
        */

        if (nivelActual === 4) {

            aplicarBlur();

            return;
        }


        /*
            Obtenemos todos los píxeles
            de la imagen.
        */

        const imageData =
            ctxFiltrado.getImageData(
                0,
                0,
                canvasFiltrado.width,
                canvasFiltrado.height
            );


        const data =
            imageData.data;


        const width =
            canvasFiltrado.width;

        const height =
            canvasFiltrado.height;


        /*
            Recorremos la imagen como una matriz.

            En memoria, en realidad, los píxeles
            están en un arreglo plano.

            Cada píxel ocupa 4 posiciones:

            R
            G
            B
            A
        */

        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {

                const i =
                    (x + y * width) * 4;


                const r =
                    data[i];

                const g =
                    data[i + 1];

                const b =
                    data[i + 2];


                // ==========================================
                // NIVEL 1
                // ESCALA DE GRISES
                // ==========================================

                if (nivelActual === 1) {

                    /*
                        Usamos la fórmula BT.601.

                        El ojo humano no percibe
                        R, G y B con la misma intensidad.

                        Por eso el verde tiene
                        un peso mayor.
                    */

                    const gris =
                        0.299 * r +
                        0.587 * g +
                        0.114 * b;


                    data[i] =
                        gris;

                    data[i + 1] =
                        gris;

                    data[i + 2] =
                        gris;

                }


                // ==========================================
                // NIVEL 2
                // BRILLO +30%
                // ==========================================

                else if (nivelActual === 2) {

                    /*
                        Aumentamos cada canal
                        un 30%.

                        imageData.data es un
                        Uint8ClampedArray.

                        Si nos pasamos de 255,
                        automáticamente queda en 255.
                    */

                    data[i] =
                        r * 1.3;

                    data[i + 1] =
                        g * 1.3;

                    data[i + 2] =
                        b * 1.3;

                }


                // ==========================================
                // NIVEL 3
                // NEGATIVO
                // ==========================================

                else if (nivelActual === 3) {

                    /*
                        Para invertir un canal:

                        nuevo valor = 255 - valor
                    */

                    data[i] =
                        255 - r;

                    data[i + 1] =
                        255 - g;

                    data[i + 2] =
                        255 - b;

                }

            }

        }


        /*
            Modificar imageData.data no cambia
            automáticamente el canvas.

            Hay que volver a escribir los datos.
        */

        ctxFiltrado.putImageData(
            imageData,
            0,
            0
        );

    }


    // =====================================================
    // NIVEL 4
    // FILTRO BORROSO
    // =====================================================

    function aplicarBlur() {

        const width =
            canvasFiltrado.width;

        const height =
            canvasFiltrado.height;


        /*
            origen:
            se usa solamente para LEER.

            destino:
            se usa solamente para ESCRIBIR.

            Así no mezclamos píxeles nuevos
            con los píxeles originales.
        */

        const origen =
            ctxFiltrado.getImageData(
                0,
                0,
                width,
                height
            );


        const destino =
            ctxFiltrado.createImageData(
                width,
                height
            );


        const src =
            origen.data;

        const dst =
            destino.data;


        /*
            K = 2

            Significa que miramos:

            2 píxeles arriba
            2 píxeles abajo
            2 a la izquierda
            2 a la derecha

            formando una ventana de 5 x 5.
        */

        const K = 2;


        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {


                let r = 0;
                let g = 0;
                let b = 0;

                let n = 0;


                /*
                    Recorremos los vecinos
                    del píxel actual.
                */

                for (
                    let dy = -K;
                    dy <= K;
                    dy++
                ) {

                    for (
                        let dx = -K;
                        dx <= K;
                        dx++
                    ) {

                        const nx =
                            x + dx;

                        const ny =
                            y + dy;


                        /*
                            Si el vecino queda
                            afuera de la imagen,
                            lo ignoramos.
                        */

                        if (
                            nx < 0 ||
                            ny < 0 ||
                            nx >= width ||
                            ny >= height
                        ) {
                            continue;
                        }


                        const j =
                            (nx + ny * width) * 4;


                        r +=
                            src[j];

                        g +=
                            src[j + 1];

                        b +=
                            src[j + 2];


                        /*
                            Contamos cuántos
                            vecinos existen realmente.
                        */

                        n++;

                    }

                }


                /*
                    Posición del píxel actual
                    en el arreglo destino.
                */

                const i =
                    (x + y * width) * 4;


                /*
                    El nuevo color es el promedio
                    de todos sus vecinos.
                */

                dst[i] =
                    r / n;

                dst[i + 1] =
                    g / n;

                dst[i + 2] =
                    b / n;


                /*
                    Conservamos el alfa original.
                */

                dst[i + 3] =
                    src[i + 3];

            }

        }


        /*
            Mostramos la imagen nueva.
        */

        ctxFiltrado.putImageData(
            destino,
            0,
            0
        );

    }


    // =====================================================
    // CREAR PIEZAS
    // =====================================================

    function crearPiezas() {

        piezas = [];


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

                /*
                    La pieza empieza girada.

                    1 = 90°
                    2 = 180°
                    3 = 270°
                */

                const rotacionInicial =
                    Math.floor(
                        Math.random() * 3
                    ) + 1;


                piezas.push({

                    fila: fila,

                    columna: columna,

                    rotacion:
                        rotacionInicial,

                    bloqueada:
                        false

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


        /*
            Limpiamos el canvas.
        */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
            Tamaño que ocupa cada pieza
            dentro del canvas del juego.
        */

        const anchoPieza =
            canvas.width /
            columnas;

        const altoPieza =
            canvas.height /
            filas;


        /*
            Tamaño de cada fragmento
            dentro de la imagen original.
        */

        const anchoImagen =
            canvasFiltrado.width /
            columnas;

        const altoImagen =
            canvasFiltrado.height /
            filas;


        piezas.forEach(pieza => {

            /*
                Posición del fragmento
                dentro de la imagen.
            */

            const sx =
                pieza.columna *
                anchoImagen;

            const sy =
                pieza.fila *
                altoImagen;


            /*
                Posición de la pieza
                dentro del tablero.
            */

            const x =
                pieza.columna *
                anchoPieza;

            const y =
                pieza.fila *
                altoPieza;


            /*
                Guardamos el estado actual
                del contexto.
            */

            ctx.save();


            /*
                Movemos el origen al centro
                de la pieza para poder girarla
                alrededor de su centro.
            */

            ctx.translate(
                x + anchoPieza / 2,
                y + altoPieza / 2
            );


            /*
                Giramos en múltiplos
                de 90 grados.
            */

            ctx.rotate(
                pieza.rotacion *
                Math.PI / 2
            );


            /*
                Dibujamos el fragmento.

                IMPORTANTE:

                ahora usamos canvasFiltrado
                como origen de la imagen.

                Los píxeles ya fueron modificados
                manualmente por nosotros.
            */

            ctx.drawImage(
                canvasFiltrado,

                sx,
                sy,

                anchoImagen,
                altoImagen,

                -anchoPieza / 2,
                -altoPieza / 2,

                anchoPieza,
                altoPieza
            );


            /*
                Recuperamos el estado
                anterior del contexto.
            */

            ctx.restore();


            // =============================================
            // BORDE DE CADA PIEZA
            // =============================================

            ctx.strokeStyle =
                "#102d49";

            ctx.lineWidth =
                3;

            ctx.strokeRect(
                x,
                y,
                anchoPieza,
                altoPieza
            );


            // =============================================
            // PIEZA COLOCADA POR AYUDA
            // =============================================

            if (pieza.bloqueada) {

                ctx.strokeStyle =
                    "#65c56b";

                ctx.lineWidth =
                    5;

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

    canvas.addEventListener(
        "click",
        event => {

            if (
                !juegoActivo ||
                pausado
            ) {
                return;
            }


            const pieza =
                obtenerPieza(
                    event
                );


            if (
                !pieza ||
                pieza.bloqueada
            ) {
                return;
            }


            /*
                Click izquierdo:

                gira 90 grados
                hacia la izquierda.
            */

            pieza.rotacion =
                (pieza.rotacion + 3) % 4;


            dibujarTablero();

            comprobarVictoria();

        }
    );


    // =====================================================
    // CLICK DERECHO
    // =====================================================

    canvas.addEventListener(
        "contextmenu",
        event => {

            /*
                Evitamos que aparezca
                el menú del navegador.
            */

            event.preventDefault();


            if (
                !juegoActivo ||
                pausado
            ) {
                return;
            }


            const pieza =
                obtenerPieza(
                    event
                );


            if (
                !pieza ||
                pieza.bloqueada
            ) {
                return;
            }


            /*
                Click derecho:

                gira 90 grados
                hacia la derecha.
            */

            pieza.rotacion =
                (pieza.rotacion + 1) % 4;


            dibujarTablero();

            comprobarVictoria();

        }
    );


    // =====================================================
    // OBTENER PIEZA CLICKEADA
    // =====================================================

    function obtenerPieza(event) {

        const rect =
            canvas.getBoundingClientRect();


        /*
            El canvas puede verse a un tamaño
            distinto al tamaño real de sus píxeles.

            Por eso calculamos la escala.
        */

        const escalaX =
            canvas.width /
            rect.width;

        const escalaY =
            canvas.height /
            rect.height;


        /*
            Coordenadas del click
            dentro del canvas.
        */

        const x =
            (
                event.clientX -
                rect.left
            ) * escalaX;


        const y =
            (
                event.clientY -
                rect.top
            ) * escalaY;


        const anchoPieza =
            canvas.width /
            columnas;

        const altoPieza =
            canvas.height /
            filas;


        /*
            Calculamos qué fila
            y qué columna recibió
            el click.
        */

        const columna =
            Math.floor(
                x / anchoPieza
            );


        const fila =
            Math.floor(
                y / altoPieza
            );


        /*
            Buscamos la pieza
            correspondiente.
        */

        return piezas.find(
            pieza =>

                pieza.columna ===
                columna &&

                pieza.fila ===
                fila

        );

    }


    // =====================================================
    // AYUDA
    // =====================================================

    btnAyuda.addEventListener(
        "click",
        () => {

            if (
                ayudaUsada ||
                pausado ||
                !juegoActivo
            ) {
                return;
            }


            /*
                Buscamos las piezas
                que todavía están mal.
            */

            const piezasIncorrectas =
                piezas.filter(
                    pieza =>

                        pieza.rotacion !== 0 &&
                        !pieza.bloqueada

                );


            if (
                piezasIncorrectas.length === 0
            ) {
                return;
            }


            /*
                Elegimos una pieza
                incorrecta al azar.
            */

            const pieza =
                piezasIncorrectas[
                Math.floor(
                    Math.random() *
                    piezasIncorrectas.length
                )
                ];


            /*
                La colocamos correctamente.
            */

            pieza.rotacion =
                0;

            pieza.bloqueada =
                true;


            /*
                Usar ayuda suma
                5 segundos.
            */

            segundos +=
                5;

            actualizarCronometro();


            /*
                La ayuda solo puede
                usarse una vez.
            */

            ayudaUsada =
                true;

            btnAyuda.disabled =
                true;


            dibujarTablero();

            comprobarVictoria();

        }
    );


    // =====================================================
    // CRONÓMETRO
    // =====================================================

    function iniciarCronometro() {

        detenerCronometro();


        intervalo =
            setInterval(() => {

                if (!pausado) {

                    segundos++;

                    actualizarCronometro();

                }

            }, 1000);

    }


    function detenerCronometro() {

        if (intervalo) {

            clearInterval(
                intervalo
            );

            intervalo =
                null;

        }

    }


    function actualizarCronometro() {

        const minutos =
            Math.floor(
                segundos / 60
            );


        const segundosRestantes =
            segundos % 60;


        cronometro.textContent =

            String(minutos)
                .padStart(
                    2,
                    "0"
                ) +

            ":" +

            String(segundosRestantes)
                .padStart(
                    2,
                    "0"
                );

    }


    // =====================================================
    // PAUSAR
    // =====================================================

    btnPausar.addEventListener(
        "click",
        () => {

            pausado =
                !pausado;


            pausaOverlay.hidden =
                !pausado;


            if (pausado) {

                btnPausar.innerHTML =
                    '<i class="fa-solid fa-play"></i><span>Continuar</span>';

            } else {

                btnPausar.innerHTML =
                    '<i class="fa-solid fa-pause"></i><span>Pausar</span>';

            }

        }
    );


    btnContinuar.addEventListener(
        "click",
        () => {

            pausado =
                false;

            pausaOverlay.hidden =
                true;

            btnPausar.innerHTML =
                '<i class="fa-solid fa-pause"></i><span>Pausar</span>';

        }
    );


    // =====================================================
    // SALIR
    // =====================================================

    btnSalir.addEventListener(
        "click",
        () => {

            detenerCronometro();

            juegoActivo =
                false;

            mostrarPantalla(
                pantallaInicio
            );

        }
    );


    // =====================================================
    // COMPROBAR SI GANÓ
    // =====================================================

    function comprobarVictoria() {

        const completo =

            piezas.length > 0 &&

            piezas.every(
                pieza =>
                    pieza.rotacion === 0
            );


        if (!completo) {
            return;
        }


        juegoActivo =
            false;


        detenerCronometro();


        /*
            Cuando termina el nivel
            mostramos la imagen ORIGINAL,
            sin el filtro.
        */

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


        /*
            Dibujamos directamente
            la imagen original.

            No usamos canvasFiltrado.
        */

        ctx.drawImage(
            imagen,
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
            Borde verde indicando
            que se completó correctamente.
        */

        ctx.strokeStyle =
            "#65c56b";

        ctx.lineWidth =
            8;

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

    btnSiguiente.addEventListener(
        "click",
        () => {

            if (
                nivelActual < 4
            ) {

                nivelActual++;


                nivelElegidoLabel.textContent =
                    "NIVEL " +
                    nivelActual;


                filtroElegidoLabel.textContent =
                    niveles[
                        nivelActual
                    ].nombre;


                mostrarPantalla(
                    pantallaPiezas
                );

            } else {

                /*
                    Si terminó el nivel 4,
                    vuelve a selección de niveles.
                */

                mostrarPantalla(
                    pantallaNiveles
                );

            }

        }
    );


    // =====================================================
    // SELECCIONAR NIVEL
    // =====================================================

    btnSeleccionarNivel.addEventListener(
        "click",
        () => {

            detenerCronometro();

            mostrarPantalla(
                pantallaNiveles
            );

        }
    );


    // =====================================================
    // MENÚ PRINCIPAL
    // =====================================================

    btnMenuPrincipal.addEventListener(
        "click",
        () => {

            detenerCronometro();

            mostrarPantalla(
                pantallaInicio
            );

        }
    );

});
