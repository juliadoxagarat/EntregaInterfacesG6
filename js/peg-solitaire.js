
"use strict";

/*
 * PEG SOLITAIRE - PRACTICAS TEMA 4
 *
 * POO, Canvas 2D, arreglo de figuras
 * y eventos del mouse.
 *
 * Coordenadas de las fichas:
 * x = 81 + columna * 73
 * y = 81 + fila * 73
 */

// =========================================
// CONSTANTES
// =========================================

const MEDIDAS = {
    ANCHO: 600,
    CENTRO: 300,
    RADIO_TABLERO: 294,
    PRIMER_CENTRO: 81,
    DISTANCIA: 73,
    RADIO_HUECO: 25,
    TAM_FICHA: 49,
    TIEMPO_LIMITE: 300
};

// Colores utilizados para generar las
// imagenes SVG de los fantasmas.

const COLORES_FANTASMAS = [
    ["#ffb4aa", "#ff566c", "#b92252"],
    ["#fff1fa", "#fc8bcf", "#c93c9c"],
    ["#d5ffff", "#5cdbfa", "#198dbb"],
    ["#fff2be", "#ffb557", "#e87542"]
];


/*
 * Crea una imagen SVG de un fantasma.
 * Devuelve un objeto Image que puede
 * utilizarse con ctx.drawImage().
 */
function crearImagenFantasma(colores, alCargar) {

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 96 96">

            <defs>
                <linearGradient id="piel"
                                x1="0" y1="0"
                                x2="1" y2="1">

                    <stop stop-color="${colores[0]}"/>

                    <stop offset=".45"
                          stop-color="${colores[1]}"/>

                    <stop offset="1"
                          stop-color="${colores[2]}"/>
                </linearGradient>
            </defs>

            <path
                d="M12 84 V42 C12 19 27 8 48 8
                   S84 19 84 42 V84
                   L72 76 L60 85 L48 77
                   L36 85 L24 76 Z"

                fill="url(#piel)"
                stroke="#f5f8ff"
                stroke-width="2"
            />

            <path
                d="M27 32 Q34 17 49 19"
                fill="none"
                stroke="white"
                stroke-opacity=".40"
                stroke-width="6"
                stroke-linecap="round"
            />

            <ellipse cx="37" cy="48"
                     rx="12" ry="16"
                     fill="white"/>

            <ellipse cx="61" cy="48"
                     rx="12" ry="16"
                     fill="white"/>

            <ellipse cx="41" cy="51"
                     rx="5" ry="7"
                     fill="#17234a"/>

            <ellipse cx="65" cy="51"
                     rx="5" ry="7"
                     fill="#17234a"/>

            <circle cx="39" cy="48"
                    r="2" fill="white"/>

            <circle cx="63" cy="48"
                    r="2" fill="white"/>

        </svg>
    `;

    const imagen = new Image();

    imagen.onload = alCargar;

    imagen.src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svg);

    return imagen;
}


// =========================================
// CLASE FICHA
// =========================================

/*
 * Representa una ficha del juego.
 *
 * Propiedades:
 * fila, columna, imagen, posX, posY.
 *
 * Metodos:
 * volverAlCentro(), contienePunto(),
 * dibujar().
 */

class Ficha {

    /*
     * Constructor de una ficha.
     * Guarda su posicion logica y su imagen.
     */
    constructor(fila, columna, imagen) {

        this.fila = fila;
        this.columna = columna;
        this.imagen = imagen;

        this.volverAlCentro();
    }

    /*
     * Calcula las coordenadas exactas
     * del centro de la casilla.
     */
    volverAlCentro() {

        this.posX =
            MEDIDAS.PRIMER_CENTRO +
            this.columna * MEDIDAS.DISTANCIA;

        this.posY =
            MEDIDAS.PRIMER_CENTRO +
            this.fila * MEDIDAS.DISTANCIA;
    }

    /*
     * Comprueba si el mouse se encuentra
     * sobre esta ficha.
     */
    contienePunto(x, y) {

        const distancia = Math.hypot(
            this.posX - x,
            this.posY - y
        );

        return distancia <= MEDIDAS.TAM_FICHA / 2;
    }

    /*
     * Dibuja la imagen del fantasma
     * sobre el canvas.
     *
     * Si esta siendo arrastrada,
     * aumenta ligeramente su tamaño.
     */
    dibujar(ctx, arrastrando = false) {

        const tam =
            MEDIDAS.TAM_FICHA *
            (arrastrando ? 1.15 : 1);

        ctx.save();

        ctx.shadowColor = "rgba(0,0,0,.55)";
        ctx.shadowBlur = arrastrando ? 13 : 7;
        ctx.shadowOffsetY = 4;

        if (
            this.imagen.complete &&
            this.imagen.naturalWidth > 0
        ) {

            ctx.drawImage(
                this.imagen,
                this.posX - tam / 2,
                this.posY - tam / 2,
                tam,
                tam
            );
        }

        ctx.restore();
    }
}


// =========================================
// CLASE TABLERO
// =========================================

/*
 * Administra las casillas, las fichas
 * y las reglas del Peg Solitaire.
 */

class Tablero {

    /*
     * Constructor del tablero.
     * Crea los 37 huecos y las 36 fichas.
     */
    constructor(imagenes) {

        this.imagenes = imagenes;

        this.casillas = [];
        this.fichas = [];

        this.fondo = null;

        this.crearCasillas();
        this.reiniciar();
    }

    /*
     * Crea las posiciones del tablero.
     *
     * Distribucion por filas:
     * 3 - 5 - 7 - 7 - 7 - 5 - 3.
     *
     * Cada casilla tiene fila, columna,
     * coordenada X y coordenada Y.
     */
    crearCasillas() {

        const cantidades = [3, 5, 7, 7, 7, 5, 3];

        for (
            let fila = 0;
            fila < cantidades.length;
            fila++
        ) {

            const primeraColumna =
                (7 - cantidades[fila]) / 2;

            for (
                let i = 0;
                i < cantidades[fila];
                i++
            ) {

                const columna = primeraColumna + i;

                this.casillas.push({

                    fila: fila,
                    columna: columna,

                    x: MEDIDAS.PRIMER_CENTRO +
                       columna * MEDIDAS.DISTANCIA,

                    y: MEDIDAS.PRIMER_CENTRO +
                       fila * MEDIDAS.DISTANCIA
                });
            }
        }
    }

    /*
     * Reinicia las fichas.
     *
     * Todos los huecos se llenan,
     * excepto fila 2, columna 3.
     */
    reiniciar() {

        this.fichas = [];

        let numero = 0;

        for (const casilla of this.casillas) {

            if (
                casilla.fila === 3 &&
                casilla.columna === 3
            ) {
                continue;
            }

            const imagen =
                this.imagenes[
                    numero % this.imagenes.length
                ];

            const ficha = new Ficha(
                casilla.fila,
                casilla.columna,
                imagen
            );

            this.fichas.push(ficha);

            numero++;
        }
    }

    /*
     * Busca una casilla mediante
     * su fila y columna.
     */
    buscarCasilla(fila, columna) {

        return this.casillas.find(
            c =>
                c.fila === fila &&
                c.columna === columna
        ) || null;
    }

    /*
     * Busca una casilla segun las
     * coordenadas del mouse.
     */
    buscarCasillaEn(x, y) {

        return this.casillas.find(
            c => Math.hypot(
                c.x - x,
                c.y - y
            ) <= 29
        ) || null;
    }

    /*
     * Busca una ficha dentro del arreglo
     * usando fila y columna.
     */
    buscarFicha(fila, columna) {

        return this.fichas.find(
            f =>
                f.fila === fila &&
                f.columna === columna
        ) || null;
    }

    /*
     * Busca sobre que ficha hizo clic
     * el jugador.
     */
    buscarFichaEn(x, y) {

        for (
            let i = this.fichas.length - 1;
            i >= 0;
            i--
        ) {

            if (this.fichas[i].contienePunto(x, y)) {
                return this.fichas[i];
            }
        }

        return null;
    }

    /*
     * Verifica si un movimiento es valido.
     *
     * Debe avanzar dos casillas en linea
     * recta y saltar sobre otra ficha.
     *
     * El destino debe estar vacio.
     */
    esMovimientoValido(ficha, destino) {

        if (
            !ficha ||
            !destino ||
            this.buscarFicha(
                destino.fila,
                destino.columna
            )
        ) {
            return false;
        }

        const diferenciaFila =
            destino.fila - ficha.fila;

        const diferenciaColumna =
            destino.columna - ficha.columna;

        const saltoVertical =
            Math.abs(diferenciaFila) === 2 &&
            diferenciaColumna === 0;

        const saltoHorizontal =
            Math.abs(diferenciaColumna) === 2 &&
            diferenciaFila === 0;

        if (!saltoVertical && !saltoHorizontal) {
            return false;
        }

        const filaMedio =
            (ficha.fila + destino.fila) / 2;

        const columnaMedio =
            (ficha.columna + destino.columna) / 2;

        return this.buscarFicha(
            filaMedio,
            columnaMedio
        ) !== null;
    }

    /*
     * Devuelve todas las casillas donde
     * puede caer una ficha.
     */
    destinosValidos(ficha) {

        const direcciones = [
            [-2, 0],
            [2, 0],
            [0, -2],
            [0, 2]
        ];

        const destinos = [];

        for (const [df, dc] of direcciones) {

            const destino = this.buscarCasilla(
                ficha.fila + df,
                ficha.columna + dc
            );

            if (this.esMovimientoValido(ficha, destino)) {
                destinos.push(destino);
            }
        }

        return destinos;
    }

    /*
     * Realiza el movimiento.
     *
     * Elimina la ficha del medio
     * y actualiza la ficha que se movio.
     */
    moverFicha(ficha, destino) {

        if (!this.esMovimientoValido(ficha, destino)) {
            return false;
        }

        const filaMedio =
            (ficha.fila + destino.fila) / 2;

        const columnaMedio =
            (ficha.columna + destino.columna) / 2;

        const comida = this.buscarFicha(
            filaMedio,
            columnaMedio
        );

        this.fichas.splice(
            this.fichas.indexOf(comida),
            1
        );

        ficha.fila = destino.fila;
        ficha.columna = destino.columna;

        ficha.volverAlCentro();

        return true;
    }

    /*
     * Verifica si queda al menos
     * un movimiento disponible.
     *
     * Se ejecuta despues de cada salto.
     */
    quedanMovimientos() {

        return this.fichas.some(
            ficha =>
                this.destinosValidos(ficha).length > 0
        );
    }

    /*
     * Dibuja el fondo circular del tablero.
     *
     * Si hay una imagen, la utiliza.
     * Si no, genera una textura provisoria.
     */
    dibujarBase(ctx) {

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            300, 300,
            MEDIDAS.RADIO_TABLERO,
            0,
            Math.PI * 2
        );

        ctx.clip();

        if (
            this.fondo &&
            this.fondo.complete &&
            this.fondo.naturalWidth > 0
        ) {

            ctx.drawImage(
                this.fondo,
                6, 6, 588, 588
            );

        } else {

            const madera = ctx.createRadialGradient(
                185, 150, 15,
                300, 300, 420
            );

            madera.addColorStop(0, "#a96b37");
            madera.addColorStop(.60, "#774027");
            madera.addColorStop(1, "#2c1b2c");

            ctx.fillStyle = madera;

            ctx.fillRect(0, 0, 600, 600);

            ctx.strokeStyle = "rgba(28,9,15,.12)";

            for (let x = 10; x < 600; x += 15) {

                ctx.beginPath();
                ctx.moveTo(x, 0);

                ctx.bezierCurveTo(
                    x - 24, 180,
                    x + 18, 400,
                    x, 600
                );

                ctx.stroke();
            }
        }

        ctx.restore();

        // Aro exterior.

        ctx.beginPath();

        ctx.arc(
            300, 300, 290,
            0, Math.PI * 2
        );

        ctx.strokeStyle = "#281326";
        ctx.lineWidth = 12;
        ctx.stroke();

        // Aro interior.

        ctx.beginPath();

        ctx.arc(
            300, 300, 277,
            0, Math.PI * 2
        );

        ctx.strokeStyle = "#e9b269";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    /*
     * Dibuja cada uno de los 37 huecos.
     */
    dibujarHuecos(ctx) {

        for (const casilla of this.casillas) {

            ctx.beginPath();

            ctx.arc(
                casilla.x,
                casilla.y,
                MEDIDAS.RADIO_HUECO,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#151024";
            ctx.fill();

            ctx.strokeStyle = "#bd885e";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}


// =========================================
// CLASE JUEGO PEG
// =========================================

/*
 * Controla los eventos del mouse,
 * el redibujado del canvas,
 * el cronometro y el fin de partida.
 */

class JuegoPeg {

    /*
     * Inicializa el juego y los elementos
     * del documento HTML.
     */
    constructor() {

        this.canvas =
            document.querySelector("#peg-canvas");

        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = MEDIDAS.ANCHO;
        this.canvas.height = MEDIDAS.ANCHO;

        this.textoTiempo =
            document.querySelector("#peg-tiempo");

        this.textoFichas =
            document.querySelector("#peg-fichas");

        this.textoMovimientos =
            document.querySelector("#peg-movimientos");

        this.textoEstado =
            document.querySelector("#peg-estado");

        this.botonAyudas =
            document.querySelector("#peg-ayudas");

        this.modal =
            document.querySelector("#peg-modal");

        // Crear las imagenes de los fantasmas.

        this.imagenes = COLORES_FANTASMAS.map(
            colores =>
                crearImagenFantasma(
                    colores,
                    () => this.dibujar()
                )
        );

        // Crear el tablero.

        this.tablero = new Tablero(this.imagenes);

        // ACA PODES COLOCAR TU IMAGEN DE FONDO.

        const RUTA_FONDO = "";

        // Ejemplo:
        // const RUTA_FONDO =
        //     "../img/peg-solitaire/tablero.png";

        if (RUTA_FONDO) {

            const imagenFondo = new Image();

            imagenFondo.onload = () => this.dibujar();

            imagenFondo.src = RUTA_FONDO;

            this.tablero.fondo = imagenFondo;
        }

        // Estado del arrastre.

        this.fichaSeleccionada = null;

        this.diferenciaX = 0;
        this.diferenciaY = 0;

        // Estado de la partida.

        this.ayudasActivas = true;
        this.terminado = false;

        this.tiempo = MEDIDAS.TIEMPO_LIMITE;
        this.movimientos = 0;

        this.intervalo = null;
        this.fechaLimite = null;

        this.agregarEventos();

// Ajustar el canvas al iniciar.
this.ajustarCanvas();

// Recalcular el tamaño si cambia la ventana.
window.addEventListener(
    "resize",
    () => this.ajustarCanvas()
);

// Ajustar nuevamente al cargar la pagina.
window.addEventListener(
    "load",
    () => this.ajustarCanvas()
);

this.actualizarPantalla();
this.animar();
    }

    /*
     * Transforma las coordenadas del mouse
     * en coordenadas internas del canvas.
     *
     * Usa clientX/clientY, como se ve
     * en la practica de eventos.
     */
    coordenadasMouse(evento) {

        const rect =
            this.canvas.getBoundingClientRect();

        return {

            x: (evento.clientX - rect.left) *
                this.canvas.width / rect.width,

            y: (evento.clientY - rect.top) *
                this.canvas.height / rect.height
        };
    }

    /*
     * Registra los EventListeners.
     *
     * Se separa la interaccion en:
     * mousedown, mousemove y mouseup.
     */
    agregarEventos() {

        this.canvas.addEventListener(
            "mousedown",
            e => this.mouseDown(e)
        );

        window.addEventListener(
            "mousemove",
            e => this.mouseMove(e)
        );

        window.addEventListener(
            "mouseup",
            e => this.mouseUp(e)
        );

        window.addEventListener(
            "blur",
            () => this.cancelarArrastre()
        );

        this.canvas.addEventListener(
            "dragstart",
            e => e.preventDefault()
        );

        document.querySelector("#peg-reiniciar")
            .addEventListener(
                "click",
                () => this.reiniciar()
            );

        document.querySelector("#peg-modal-reiniciar")
            .addEventListener(
                "click",
                () => this.reiniciar()
            );

        this.botonAyudas.addEventListener(
            "click",
            () => this.cambiarAyudas()
        );

        document.querySelector("#peg-ver-victoria")
            .addEventListener(
                "click",
                () => this.previsualizarVictoria()
            );
    }

    /*
     * MOUSEDOWN.
     *
     * Busca la ficha sobre la cual el
     * usuario presiono el mouse.
     *
     * La guarda como fichaSeleccionada.
     */
    mouseDown(evento) {

        if (
            evento.button !== 0 ||
            this.terminado
        ) {
            return;
        }

        const { x, y } =
            this.coordenadasMouse(evento);

        const ficha =
            this.tablero.buscarFichaEn(x, y);

        if (!ficha) {
            return;
        }

        this.fichaSeleccionada = ficha;

        // Mantener la posicion relativa del clic.

        this.diferenciaX = ficha.posX - x;
        this.diferenciaY = ficha.posY - y;

        this.canvas.style.cursor = "grabbing";

        evento.preventDefault();
    }

    /*
     * MOUSEMOVE.
     *
     * Si hay una ficha seleccionada,
     * actualiza su posicion siguiendo
     * las coordenadas del mouse.
     */
    mouseMove(evento) {

        if (!this.fichaSeleccionada) {
            return;
        }

        // Comprobar que sigue presionado
        // el boton izquierdo.

        if ((evento.buttons & 1) === 0) {

            this.cancelarArrastre();
            return;
        }

        const { x, y } =
            this.coordenadasMouse(evento);

        this.fichaSeleccionada.posX =
            x + this.diferenciaX;

        this.fichaSeleccionada.posY =
            y + this.diferenciaY;
    }

    /*
     * MOUSEUP.
     *
     * Cuando se suelta el mouse, busca
     * la casilla de destino.
     *
     * Si el movimiento es valido,
     * actualiza el tablero.
     *
     * Si no lo es, devuelve la ficha
     * al lugar del que salio.
     */
    mouseUp(evento) {

        if (!this.fichaSeleccionada) {
            return;
        }

        const ficha = this.fichaSeleccionada;

        const { x, y } =
            this.coordenadasMouse(evento);

        const destino =
            this.tablero.buscarCasillaEn(x, y);

        this.fichaSeleccionada = null;

        this.canvas.style.cursor = "grab";

        // Comprobar si se agoto el tiempo.

        if (
            this.fechaLimite !== null &&
            Date.now() >= this.fechaLimite
        ) {

            ficha.volverAlCentro();

            this.terminar("tiempo");
            return;
        }

        // Intentar realizar el salto.

        if (this.tablero.moverFicha(ficha, destino)) {

            this.movimientos++;

            // El timer arranca con el primer salto.

            if (this.fechaLimite === null) {
                this.iniciarTimer();
            }

            this.textoEstado.textContent =
                "¡Buen salto! Se elimino una ficha.";

            this.actualizarPantalla();

            // Verificar fin de partida despues
            // de CADA movimiento valido.

            if (!this.tablero.quedanMovimientos()) {

                this.terminar("sinMovimientos");
            }

        } else {

            ficha.volverAlCentro();

            this.textoEstado.textContent =
                "Movimiento invalido: salta sobre " +
                "una ficha hasta un hueco vacio.";
        }
    }

    /*
     * Cancela el arrastre y vuelve a
     * ubicar la ficha en su casilla.
     */
    cancelarArrastre() {

        if (this.fichaSeleccionada) {

            this.fichaSeleccionada.volverAlCentro();
        }

        this.fichaSeleccionada = null;

        this.canvas.style.cursor = "grab";
    }

    /*
     * Dibuja las ayudas animadas.
     *
     * Sin ficha seleccionada:
     * resalta los origenes posibles.
     *
     * Con ficha seleccionada:
     * muestra flechas en sus destinos.
     */
    dibujarAyudas(tiempo) {

        const pulso =
            (Math.sin(tiempo / 220) + 1) / 2;

        if (!this.fichaSeleccionada) {

            for (const ficha of this.tablero.fichas) {

                if (
                    this.tablero.destinosValidos(ficha)
                        .length === 0
                ) {
                    continue;
                }

                this.ctx.beginPath();

                this.ctx.arc(
                    ficha.posX,
                    ficha.posY,
                    27 + pulso * 4,
                    0,
                    Math.PI * 2
                );

                this.ctx.lineWidth = 3;

                this.ctx.strokeStyle =
                    `rgba(79,246,255,${.18 + pulso * .67})`;

                this.ctx.stroke();
            }

        } else {

            const destinos =
                this.tablero.destinosValidos(
                    this.fichaSeleccionada
                );

            for (const destino of destinos) {

                this.ctx.save();

                // Aro animado sobre el destino.

                this.ctx.beginPath();

                this.ctx.arc(
                    destino.x,
                    destino.y,
                    29 + pulso * 3,
                    0,
                    Math.PI * 2
                );

                this.ctx.lineWidth = 3;
                this.ctx.strokeStyle = "#59faff";

                this.ctx.shadowColor = "#00e5ff";
                this.ctx.shadowBlur = 10;

                this.ctx.stroke();

                this.ctx.shadowBlur = 0;

                // Flecha animada.

                const y =
                    destino.y - 34 + pulso * 6;

                this.ctx.beginPath();

                this.ctx.moveTo(
                    destino.x - 8,
                    y - 8
                );

                this.ctx.lineTo(
                    destino.x,
                    y
                );

                this.ctx.lineTo(
                    destino.x + 8,
                    y - 8
                );

                this.ctx.strokeStyle = "white";
                this.ctx.lineCap = "round";
                this.ctx.lineJoin = "round";

                this.ctx.stroke();

                this.ctx.restore();
            }
        }
    }

    /*
     * Redibuja el contenido del canvas.
     *
     * Primero limpia y dibuja el tablero.
     * Luego los huecos, ayudas y fichas.
     *
     * La ficha seleccionada se dibuja
     * al final para quedar por encima.
     */
    dibujar(tiempo = performance.now()) {

        if (!this.tablero) {
            return;
        }

        this.ctx.clearRect(
            0, 0,
            this.canvas.width,
            this.canvas.height
        );

        this.tablero.dibujarBase(this.ctx);

        this.tablero.dibujarHuecos(this.ctx);

        if (
            this.ayudasActivas &&
            !this.terminado
        ) {

            this.dibujarAyudas(tiempo);
        }

        // Recorrer el arreglo de fichas.

        for (const ficha of this.tablero.fichas) {

            if (ficha !== this.fichaSeleccionada) {

                ficha.dibujar(this.ctx);
            }
        }

        // Dibujar la ficha que se arrastra.

        if (this.fichaSeleccionada) {

            this.fichaSeleccionada.dibujar(
                this.ctx,
                true
            );
        }
    }

    /*
     * Repite el dibujo en cada frame
     * para animar las flechas y los aros.
     */
    animar() {

        this.dibujar();

        requestAnimationFrame(
            () => this.animar()
        );
    }

    /*
     * Inicia el cronometro al realizar
     * el primer movimiento valido.
     */
    iniciarTimer() {

        this.fechaLimite =
            Date.now() +
            MEDIDAS.TIEMPO_LIMITE * 1000;

        this.intervalo = setInterval(() => {

            this.tiempo = Math.max(
                0,
                Math.ceil(
                    (this.fechaLimite - Date.now()) / 1000
                )
            );

            this.actualizarPantalla();

            if (this.tiempo === 0) {

                this.terminar("tiempo");
            }

        }, 200);
    }

    /*
     * Actualiza los contadores visibles.
     * Convierte segundos al formato mm:ss.
     */
    actualizarPantalla() {

        const minutos =
            Math.floor(this.tiempo / 60);

        const segundos =
            this.tiempo % 60;

        this.textoTiempo.textContent =
            String(minutos).padStart(2, "0") +
            ":" +
            String(segundos).padStart(2, "0");

        this.textoTiempo.classList.toggle(
            "peg__tiempo--urgente",
            this.tiempo <= 30
        );

        this.textoFichas.textContent =
            this.tablero.fichas.length;

        this.textoMovimientos.textContent =
            this.movimientos;
    }

    /*
     * Activa o desactiva las ayudas
     * visuales del tablero.
     */
    cambiarAyudas() {

        this.ayudasActivas = !this.ayudasActivas;

        this.botonAyudas.textContent =
            this.ayudasActivas
                ? "Ayudas: activadas"
                : "Ayudas: desactivadas";

        this.botonAyudas.setAttribute(
            "aria-pressed",
            String(this.ayudasActivas)
        );
    }

    /*
     * Finaliza la partida por falta de
     * movimientos o por tiempo agotado.
     */
    previsualizarVictoria() {

        this.cancelarArrastre();
        this.tablero.fichas = [
            new Ficha(3, 3, this.imagenes[0])
        ];
        this.movimientos = this.tablero.casillas.length - 2;
        this.terminado = false;
        this.actualizarPantalla();
        this.terminar("sinMovimientos");
    }

    terminar(motivo) {

        if (this.terminado) {
            return;
        }

        this.terminado = true;

        clearInterval(this.intervalo);

        this.intervalo = null;

        this.cancelarArrastre();

        const quedan =
            this.tablero.fichas.length;

        document.querySelector(
            "#peg-modal-titulo"
        ).textContent =

            motivo === "tiempo"
                ? "¡Se termino el tiempo!"
                : quedan === 1
                    ? "¡Ganaste!"
                    : "¡Fin del juego!";

        document.querySelector(
            "#peg-modal-texto"
        ).textContent =

            motivo === "tiempo"
                ? `Quedaron ${quedan} fantasmitas.`
                : `No quedan saltos posibles. ` +
                  `Terminaste con ${quedan} fantasmita/s.`;

        this.modal.hidden = false;

        this.textoEstado.textContent =
            "Partida terminada. " +
            "Podes reiniciar para volver a jugar.";
    }

    /*
     * Restaura las fichas, cronometro,
     * contadores y estado de la partida.
     */
    reiniciar() {

        clearInterval(this.intervalo);

        this.intervalo = null;

        this.cancelarArrastre();

        this.tablero.reiniciar();

        this.tiempo = MEDIDAS.TIEMPO_LIMITE;

        this.fechaLimite = null;

        this.movimientos = 0;

        this.terminado = false;

        this.modal.hidden = true;

        this.textoEstado.textContent =
            "Arrastra una ficha por encima " +
            "de otra hasta un hueco vacio.";

        this.actualizarPantalla();
    }

    
/*
 * Ajusta el tamaño visual del canvas
 * para que entre completo en la pantalla.
 *
 * El canvas sigue teniendo 600x600 pixeles
 * internos, pero se muestra mas pequeño
 * cuando la altura disponible es menor.
 */
ajustarCanvas() {

    const escenario =
        document.querySelector(".peg__escenario");

    const seccion =
        document.querySelector(".peg");

    const rectEscenario =
        escenario.getBoundingClientRect();

    const rectSeccion =
        seccion.getBoundingClientRect();

    // Espacio ocupado debajo del canvas.
    const espacioInferior =
        rectSeccion.bottom - rectEscenario.bottom;

    // Posicion del canvas en la pagina.
    const inicioEscenario =
        rectEscenario.top + window.scrollY;

    // Altura disponible para mostrar el juego.
    const altoDisponible =
        window.innerHeight -
        inicioEscenario -
        espacioInferior -
        12;

    // Ancho disponible dentro del contenedor.
    const anchoDisponible =
        seccion.clientWidth - 28;

    // Mantener la proporcion cuadrada.
    const lado = Math.max(
        200,
        Math.min(
            MEDIDAS.ANCHO,
            anchoDisponible,
            altoDisponible
        )
    );

    escenario.style.width = lado + "px";
}

}


// =========================================
// INICIALIZACION DEL JUEGO
// =========================================

/*
 * Evento de pagina.
 *
 * Espera a que el documento HTML
 * este cargado antes de crear el juego.
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (document.querySelector("#peg-canvas")) {

            new JuegoPeg();
        }
    }
);
