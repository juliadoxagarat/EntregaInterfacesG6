document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // IMÁGENES SEGÚN NIVEL
    // =====================================================

    const imagenesPorNivel = {

        1: [
            "../img/Simpsons/simpson-uno.png",
            "../img/Simpsons/simpson-dos.png",
            "../img/Simpsons/simpson-tres.png",
            "../img/Simpsons/simpson-cuatro.jpg",
            "../img/Simpsons/simpson-cinco.png",
            "../img/Simpsons/simpson-seis.png",
            "../img/Simpsons/simpson-siete.png",
            "../img/Simpsons/simpson-ocho.png"
        ],

        2: [
            "../img/Futurama/futurama1.png",
            "../img/Futurama/futurama2.jpg",
            "../img/Futurama/futurama3.jpg",
            "../img/Futurama/futurama4.png",
            "../img/Futurama/futurama5.jpg",
            "../img/Futurama/futurama6.jpg",
            "../img/Futurama/futurama7.jpg",
            "../img/Futurama/futurama8.jpg"
        ],

        3: [
            "../img/RickYMorty/rickYmorty-uno.png",
            "../img/RickYMorty/rickYmorty-dos.png",
            "../img/RickYMorty/rickYmorty-tres.jpg",
            "../img/RickYMorty/rickYmorty-cuatro.png",
            "../img/RickYMorty/rickYmorty-cinco.png",
            "../img/RickYMorty/rickYmorty-seis.png",
            "../img/RickYMorty/rickYmorty-siete.jpg",
            "../img/RickYMorty/rickYmorty-ocho.png"
        ],

        4: [
            "../img/Desencanto/des1.png",
            "../img/Desencanto/des2.png",
            "../img/Desencanto/des3.png",
            "../img/Desencanto/des4.png",
            "../img/Desencanto/des5.png",
            "../img/Desencanto/des6.png",
            "../img/Desencanto/des7.png",
            "../img/Desencanto/des8.png"
        ]
    };


    let imagenesBlocka = imagenesPorNivel[1];


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

                imagenesBlocka =
                    imagenesPorNivel[nivelActual];

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
                //ya esta elegida la primer opcion por defecto en el html
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

                //agrega la tarjeta q creamos
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

        const indiceFinal = //esto se le suma a la cant de pasos para q sea siempre una pos distinta
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
            indiceFinal; //aca lo de random


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

                const progreso = //q proporcion del recorrido esta hecho, de 0 a 1
                    pasoActual /
                    cantidadPasos;


                /*
                    Empieza rápido y termina
                    más lentamente.
                */

                const velocidad = //cuando progreso es chico, va rapido y desp cada vez mas lento
                    70 +
                    Math.floor(
                        progreso * 180
                    );


                setTimeout(
                    avanzar,
                    velocidad
                ); //programa la prox iteracion de avanzar porq aca no llego al final si entro a este if


                return; //termina esta iteracion pero ya habia programado la prox 
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


        avanzar(); //primer llamada q inicia toda la animacion, porq avanzar() esta detro de seleccionAleatoria()

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
                //dibuja igual la img asignada pero sin el filtro
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


        imagen.src = rutaImagen; //efectivamente le asigna la ruta a Imagen()
    }



    function aplicarFiltro() {

        /*
            El canvas auxiliar tiene el mismo
            tamaño que la imagen original.
        */

        canvasFiltrado.width = imagen.naturalWidth;
        canvasFiltrado.height = imagen.naturalHeight;


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
            NIVEL 4: DESENFOQUE
    
            El blur necesita consultar los píxeles
            vecinos, por eso tiene su propia función.
        */

        if (nivelActual === 4) {

            aplicarBlur2();

            return;
        }


        /*
            Obtenemos los píxeles de la imagen.
        */

        const imageData = ctxFiltrado.getImageData(
            0,
            0,
            canvasFiltrado.width,
            canvasFiltrado.height
        );

        const data = imageData.data; //crea un array q tiene los valores de cada pixel (RGBA)

        const width = canvasFiltrado.width;
        const height = canvasFiltrado.height;


        /*
            Recorremos todos los píxeles.
    
            Cada píxel ocupa 4 posiciones:
            R, G, B y A.
        */

        for (let y = 0; y < height; y++) { //recorro y del canvas

            for (let x = 0; x < width; x++) { //recorro x del canvas

                const i = (x + y * width) * 4; //q numero de pixel esta recorriendo

                const r = data[i]; //valor del canal rojo
                const g = data[i + 1]; //valor del canal verde
                const b = data[i + 2]; //valor del canal azul


                // NIVEL 1: ESCALA DE GRISES

                if (nivelActual === 1) {

                    const gris =
                        0.299 * r +
                        0.587 * g +       //formula q convierte a gris
                        0.114 * b;

                    data[i] = gris;
                    data[i + 1] = gris;            //le asigno ese gris q calcule; cuando rgb tienen el mismo valor, el color es gris
                    data[i + 2] = gris;

                }


                // NIVEL 2: BRILLO +30%

                else if (nivelActual === 2) {

                    data[i] = r * 1.3;
                    data[i + 1] = g * 1.3;  //multiplico cada valor por 1.3 para q sea 30% mas brillante
                    data[i + 2] = b * 1.3;

                }


                // NIVEL 3: COLORES INVERTIDOS

                else if (nivelActual === 3) {

                    data[i] = 255 - r;
                    data[i + 1] = 255 - g;   //le resto a 255 para q sea el color invertido
                    data[i + 2] = 255 - b;

                }

            }
        }


        /*
            Escribimos los píxeles modificados
            nuevamente en el canvas.
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

    function aplicarBlur2() {  //reemplazo el valor de cada pixel por el promedio de sus vecinos, para q se vea borroso


        //la img actual ya la dibujamos en el canvas aux en aplicarFiltro()
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

                let mayorValor = -1;

                let n = 0; //para ver cuantos vecinos existen realmente, porq si el pixel esta en un borde, no tiene 25 vecinos, sino menos (sirve para calcular desp el promedio)


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
                            continue;  //salta el resto de la iteración actual del bucle y pasa a la siguiente iteracion
                        }




                        const j =
                            (nx + ny * width) * 4; //Obtenemos los colores del vecino, misma formula q en aplicarFiltro() para obtener el indice del pixel en el array de pixeles


                        const valor = src[j] + src[j + 1] + src[j + 2];

                        if (
                            valor > mayorValor
                        ) {
                            mayorValor = valor;
                            r = src[j];
                            g = src[j + 1];
                            b = src[j + 2];
                        }


                        r += src[j];

                        g +=  src[j + 1];                      //Acumulamos los valores RGB del vecino (j es la pos del vecino)
                            

                        b += src[j + 2];


                        /*
                            Sumamos 1 al contador de vecinos válidos.
                            Si estamos en el centro de una imagen suficientemente grande, al terminar los bucles tendremos n = 25.
                            Si estamos en una esquina, tendremos menos vecinos porque algunos quedarían fuera de la imagen (por el continue anterior)
                        */

                        n++;

                    }

                }


                /*
                    Posición del píxel actual
                    en el arreglo destino.
                */

                const i =
                    (x + y * width) * 4;  //PIXEL NUEVO q estamos calculando


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
            ponemos la img nueva en el canvas aux, que luego la pasara al tablero con las piezas con la img ya con el filtro aplicado
        */

        ctxFiltrado.putImageData(
            destino,
            0,
            0
        );

    }

    function aplicarBlur() {  //reemplazo el valor de cada pixel por el promedio de sus vecinos, para q se vea borroso


        //la img actual ya la dibujamos en el canvas aux en aplicarFiltro()
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

                let n = 0; //para ver cuantos vecinos existen realmente, porq si el pixel esta en un borde, no tiene 25 vecinos, sino menos (sirve para calcular desp el promedio)


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
                            continue;  //salta el resto de la iteración actual del bucle y pasa a la siguiente iteracion
                        }


                        const j =
                            (nx + ny * width) * 4; //Obtenemos los colores del vecino, misma formula q en aplicarFiltro() para obtener el indice del pixel en el array de pixeles


                        r +=
                            src[j];

                        g +=                        //Acumulamos los valores RGB del vecino (j es la pos del vecino)
                            src[j + 1];

                        b +=
                            src[j + 2];


                        /*
                            Sumamos 1 al contador de vecinos válidos.
                            Si estamos en el centro de una imagen suficientemente grande, al terminar los bucles tendremos n = 25.
                            Si estamos en una esquina, tendremos menos vecinos porque algunos quedarían fuera de la imagen (por el continue anterior)
                        */

                        n++;

                    }

                }


                /*
                    Posición del píxel actual
                    en el arreglo destino.
                */

                const i =
                    (x + y * width) * 4;  //PIXEL NUEVO q estamos calculando


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
            ponemos la img nueva en el canvas aux, que luego la pasara al tablero con las piezas con la img ya con el filtro aplicado
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

    //no corta ni dibuja la imagen; crea los objetos que representan cada pieza del rompecabezas

    function crearPiezas() {

        piezas = [];

        //recorro cada pieza del tablero q se definio mas arriba 
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
                    La pieza empieza girada. (0 serian 0 grados q es la pos correcta)

                    1 = 90°
                    2 = 180°
                    3 = 270°
                */

                const rotacionInicial =
                    Math.floor(
                        Math.random() * 3
                    ) + 1;

                //creo el objeto q representa la pieza y lo agrego al array de piezas
                piezas.push({

                    fila: fila,

                    columna: columna,

                    rotacion:
                        rotacionInicial, //esto no rota la pieza visualmente, es el valor q se usa para dibujar la pieza con la rotacion correspondiente

                    bloqueada:
                        false  //para la ayuda

                });

            }

        }

    }


    // =====================================================
    // DIBUJAR TABLERO
    // =====================================================

    //toma las porciones de la imagen filtrada que tenemos en el canvas auxiliar, 
    //las gira y las dibuja en el tablero principal

    function dibujarTablero() {

        if (!imagen) {
            return;
        }


        /*
            Limpiamos el canvas principal
        */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
            Tamaño que ocupa cada pieza
            dentro del canvas del juego, segun la cantidad de piezas elegida
        */

        const anchoPieza =
            canvas.width /
            columnas;

        const altoPieza =
            canvas.height /
            filas;


        /*
            Tamaño de cada fragmento
            dentro de la imagen original (en el canvas auxiliar, que tiene el filtro aplicado)
        */

        const anchoImagen =
            canvasFiltrado.width /
            columnas;

        const altoImagen =
            canvasFiltrado.height /
            filas;


        piezas.forEach(pieza => {

            /*
                coordenadas donde comienza el fragmento que 
                queremos extraer dentro del canvas auxiliar
            */

            const sx =
                pieza.columna *
                anchoImagen;

            const sy =
                pieza.fila *
                altoImagen;


            /*
                dónde se va a dibujar la pieza 
                dentro del canvas principal
            */

            const x =
                pieza.columna *
                anchoPieza;

            const y =
                pieza.fila *
                altoPieza;

            /*
                sx y sy indican de dónde sacamos el fragmento.
                x e y indican dónde lo colocamos.
            */

            /*
                Guardamos el estado actual
                del contexto.
            */

            ctx.save();


            /*
                Movemos el origen de coordenadas al centro
                de la pieza para poder girarla
                alrededor de su centro (por def. esta en 0, 0 q es la esquina superior izquierda)
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
                pieza.rotacion * //la rotacion la habiamos elegido al azar al crear la pieza; aca se rota efectivamente la pieza visualmente
                Math.PI / 2 //porq js usa radianes y no grados
            );


            /*
            usa 9 parámetros, porq necesitamos seleccionar una región específica de la imagen y dibujarla en otro lugar.

                Dibujamos el fragmento.

                ahora usamos canvasFiltrado
                como origen de la imagen.

                Los píxeles ya fueron modificados
                manualmente por nosotros.
            */

            ctx.drawImage(
                canvasFiltrado, //Imagen de origen, ya filtrada

                sx, //Coordenadas donde empieza el fragmento de origen
                sy,

                anchoImagen, //Tamaño del fragmento que queremos tomar
                altoImagen,

                -anchoPieza / 2, //Posición donde empezamos a dibujarlo respecto del nuevo origen
                -altoPieza / 2, //son negativos porq habiamos cambiado el origen de coordenadas al centro de la pieza

                anchoPieza, //Tamaño con el que se dibuja la pieza en el tablero
                altoPieza
            );


            /*
                para poder calcular el centro de la prox pieza despues
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
                (pieza.rotacion + 3) % 4; //para q si retrocede de 0 vuelva a 3, en vez de ir a -1


            dibujarTablero(); //limpia el canvas y vuelve a dibujar todas las piezas con sus rotaciones actualizadas

            comprobarVictoria();

        }
    );


    // =====================================================
    // CLICK DERECHO
    // =====================================================

    canvas.addEventListener(
        "contextmenu", //el menu q se abre normalmente al hacer click derecho
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
                (pieza.rotacion + 1) % 4; //para q si avanza de 3 vuelva a 0, en vez de ir a 4

            dibujarTablero(); //limpia el canvas y vuelve a dibujar todas las piezas con sus rotaciones actualizadas

            comprobarVictoria();

        }
    );


    // =====================================================
    // OBTENER PIEZA CLICKEADA
    // =====================================================

    function obtenerPieza(event) {

        const rect =
            canvas.getBoundingClientRect(); //devuelve un objeto con información sobre la posición y el tamaño de un elemento HTML en la pantalla.
        //porq event click nos dice donde hicimos click con respecto al navegador, no al canvas


        /*
            El canvas puede verse a un tamaño
            distinto al tamaño real de sus píxeles

            Por eso calculamos la escala
        */

        const escalaX =
            canvas.width /  //superficie de dibujo
            rect.width;     //lo q ocupa en pantalla el canvas visualmente

        const escalaY =
            canvas.height /
            rect.height;


        /*
            Coordenadas del click
            dentro del canvas
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
            el click, segun la cantidad de piezas elegida y el tamaño del canvas
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
            correspondiente
        */

        return piezas.find( //find encuentra el primer elemento del array que cumpla la condicion:
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
                piezas.filter( //nuevo array q cumpla las condiciones:
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
                incorrecta al azar
            */

            const pieza =
                piezasIncorrectas[
                Math.floor(
                    Math.random() *
                    piezasIncorrectas.length
                )
                ];


            /*
                La colocamos correctamente
            */

            pieza.rotacion =
                0;

            pieza.bloqueada =
                true;


            /*
                Usar ayuda suma
                5 segundos
            */

            segundos +=
                5;

            actualizarCronometro();


            /*
                La ayuda solo puede
                usarse una vez
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

    //convierte la cantidad total de segundos al formato MM:SS
    function actualizarCronometro() {

        const minutos =
            Math.floor(
                segundos / 60
            );


        const segundosRestantes =
            segundos % 60;


        cronometro.textContent =

            String(minutos)
                .padStart( //completa una cadena por la izquierda hasta que tenga una longitud mínima determinada (2), con "0"
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

                imagenesBlocka =
                    imagenesPorNivel[nivelActual];


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


/* ==========================================
   CARRUSEL DE INSTRUCCIONES - ESCRITORIO
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const carrusel = document.querySelector(".instrucciones-carrusel");

    if (!carrusel) return;

    const lista = carrusel.querySelector(".imagenes-grid");
    const tarjetas = carrusel.querySelectorAll(".imagen-instruccion");

    const anterior = document.querySelector("#instrucciones-anterior");
    const siguiente = document.querySelector("#instrucciones-siguiente");

    let indice = 0;

    function actualizarCarrusel() {

        // En mobile dejamos la disposición original
        if (window.innerWidth < 600) {
            lista.style.transform = "";
            anterior.hidden = true;
            siguiente.hidden = true;
            return;
        }

        // Desplazamos una tarjeta completa
        lista.style.transform = `translateX(-${indice * 100}%)`;

        // Ocultar las flechas en los extremos
        anterior.hidden = indice === 0;
        siguiente.hidden = indice === tarjetas.length - 1;
    }

    // Siguiente tarjeta
    siguiente.addEventListener("click", () => {

        if (indice < tarjetas.length - 1) {
            indice++;
            actualizarCarrusel();
        }

    });

    // Tarjeta anterior
    anterior.addEventListener("click", () => {

        if (indice > 0) {
            indice--;
            actualizarCarrusel();
        }

    });

    window.addEventListener("resize", actualizarCarrusel);

    actualizarCarrusel();

});
