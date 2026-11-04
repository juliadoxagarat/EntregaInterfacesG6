

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

const COLORES_FANTASMAS = [
    ["#ffb4aa", "#ff566c", "#b92252"],
    ["#fff1fa", "#fc8bcf", "#c93c9c"],
    ["#d5ffff", "#5cdbfa", "#198dbb"],
    ["#fff2be", "#ffb557", "#e87542"]
];

/**
 * Genera una imagen de fantasma para utilizarla como ficha.
 *
 * 1. Construye un SVG con los colores recibidos.
 * 2. Aplica un degradado al cuerpo del fantasma.
 * 3. Crea un objeto Image.
 * 4. Asocia la funcion alCargar al evento onload.
 * 5. Convierte el SVG en una URL de datos y la asigna a src.
 *
 * @param colores Arreglo con los tres colores del fantasma.
 * @param alCargar Funcion ejecutada cuando termina de cargar.
 * @returns Imagen que puede dibujarse en el canvas.
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
 * Representa una ficha del Peg Solitaire.
 *
 * Cada ficha conoce su fila, columna,
 * imagen y posicion visual en el canvas.
 */

class Ficha {

    /**
     * Construye una nueva ficha.
     *
     * Guarda la fila, columna e imagen recibidas.
     * Luego llama a volverAlCentro() para calcular
     * las coordenadas donde debe aparecer.
     *
     * @param fila Fila inicial de la ficha.
     * @param columna Columna inicial.
     * @param imagen Imagen que representa la ficha.
     */
    constructor(fila, columna, imagen) {

        this.fila = fila;
        this.columna = columna;
        this.imagen = imagen;

        this.volverAlCentro();
    }

    /**
     * Coloca visualmente la ficha en el centro de su casilla.
     *
     * Calcula posX y posY multiplicando la fila y columna
     * por la distancia entre los huecos.
     *
     * Se utiliza al crear fichas, completar un movimiento
     * valido o cancelar un arrastre incorrecto.
     */
    volverAlCentro() {

        this.posX =
            MEDIDAS.PRIMER_CENTRO +
            this.columna * MEDIDAS.DISTANCIA;

        this.posY =
            MEDIDAS.PRIMER_CENTRO +
            this.fila * MEDIDAS.DISTANCIA;
    }

    /**
     * Comprueba si el mouse esta sobre la ficha.
     *
     * Calcula la distancia entre las coordenadas del mouse
     * y el centro de la ficha usando Math.hypot().
     * Si esa distancia es menor o igual al radio,
     * significa que el usuario selecciono la ficha.
     *
     * @param x Coordenada horizontal del mouse.
     * @param y Coordenada vertical del mouse.
     * @returns true si el punto pertenece a la ficha.
     */
    contienePunto(x, y) {

        const distancia = Math.hypot(
            this.posX - x,
            this.posY - y
        );

        return distancia <= MEDIDAS.TAM_FICHA / 2;
    }

    /**
     * Dibuja la ficha sobre el canvas.
     *
     * Calcula su tamaño y lo aumenta cuando esta siendo
     * arrastrada. Configura una sombra y utiliza drawImage()
     * cuando la imagen ya termino de cargar.
     *
     * save() y restore() impiden que los estilos de la ficha
     * afecten a otros elementos del canvas.
     *
     * @param ctx Contexto 2D del canvas.
     * @param arrastrando Indica si la ficha esta en movimiento.
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

    /**
     * Inicializa el tablero del juego.
     *
     * Guarda las imagenes, crea los arreglos vacios
     * de casillas y fichas e inicializa el fondo.
     * Luego llama a crearCasillas() para generar los
     * 37 huecos y a reiniciar() para colocar las 36 fichas.
     *
     * @param imagenes Arreglo de imagenes de fantasmas.
     */
    constructor(imagenes) {

        this.imagenes = imagenes;

        this.casillas = [];
        this.fichas = [];

        this.fondo = null;

        this.crearCasillas();
        this.reiniciar();
    }

    /**
     * Crea las posiciones del tablero.
     *
     * 1. Define cuantas casillas tiene cada fila.
     * 2. Recorre las siete filas mediante un for.
     * 3. Calcula donde comienza cada fila para centrarla.
     * 4. Crea cada casilla con fila, columna, x e y.
     * 5. Guarda las casillas en el arreglo.
     *
     * El resultado son 37 huecos distribuidos en
     * filas de 3, 5, 7, 7, 7, 5 y 3 posiciones.
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

    /**
     * Restablece la distribucion inicial de fichas.
     *
     * 1. Vacia el arreglo de fichas.
     * 2. Recorre todas las casillas existentes.
     * 3. Deja vacia la casilla central (fila 3, columna 3).
     * 4. Crea una ficha en cada una de las restantes.
     * 5. Alterna las imagenes utilizando el operador modulo.
     *
     * Asi el juego comienza con 36 fichas y un hueco libre.
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

    /**
     * Busca una casilla por fila y columna.
     *
     * Recorre el arreglo de casillas utilizando find().
     * Compara las coordenadas logicas de cada casilla
     * con las recibidas como parametros.
     *
     * @param fila Fila buscada.
     * @param columna Columna buscada.
     * @returns La casilla encontrada o null.
     */
    buscarCasilla(fila, columna) {

        return this.casillas.find(
            c =>
                c.fila === fila &&
                c.columna === columna
        ) || null;
    }

    /**
     * Busca una casilla utilizando coordenadas del mouse.
     *
     * Recorre las casillas y calcula la distancia desde
     * el punto recibido hasta el centro de cada hueco.
     * Si esta a 29 pixeles o menos, considera que el
     * jugador solto la ficha sobre esa casilla.
     *
     * @param x Coordenada horizontal del mouse.
     * @param y Coordenada vertical del mouse.
     * @returns La casilla encontrada o null.
     */
    buscarCasillaEn(x, y) {

        return this.casillas.find(
            c => Math.hypot(
                c.x - x,
                c.y - y
            ) <= 29
        ) || null;
    }

    /**
     * Busca una ficha utilizando su fila y columna.
     *
     * Recorre el arreglo de fichas mediante find().
     * Sirve para determinar si una casilla esta ocupada
     * o para identificar la ficha que sera eliminada
     * durante un salto.
     *
     * @param fila Fila de la ficha.
     * @param columna Columna de la ficha.
     * @returns La ficha encontrada o null.
     */
    buscarFicha(fila, columna) {

        return this.fichas.find(
            f =>
                f.fila === fila &&
                f.columna === columna
        ) || null;
    }

    /**
     * Identifica la ficha sobre la que hizo clic el jugador.
     *
     * Recorre el arreglo de fichas desde el final.
     * Para cada ficha llama a contienePunto(),
     * que determina si el mouse esta dentro de ella.
     *
     * @param x Coordenada horizontal del clic.
     * @param y Coordenada vertical del clic.
     * @returns La ficha seleccionada o null.
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

    /**
     * Comprueba si un salto cumple las reglas del juego.
     *
     * 1. Verifica que existan la ficha y el destino.
     * 2. Comprueba que la casilla de destino este vacia.
     * 3. Calcula la diferencia de filas y columnas.
     * 4. Exige avanzar dos casillas horizontal o verticalmente.
     * 5. Calcula la posicion intermedia del salto.
     * 6. Comprueba que exista una ficha en esa posicion.
     *
     * No se permiten movimientos diagonales, ni saltos
     * sobre huecos vacios, ni destinos ocupados.
     *
     * @param ficha Ficha que intenta moverse.
     * @param destino Casilla a la que quiere llegar.
     * @returns true si el salto es valido.
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

    /**
     * Obtiene los destinos validos para una ficha.
     *
     * Define las cuatro direcciones posibles:
     * arriba, abajo, izquierda y derecha.
     *
     * Para cada direccion busca la casilla ubicada
     * dos posiciones mas adelante. Luego llama a
     * esMovimientoValido() y guarda solamente
     * los destinos permitidos.
     *
     * @param ficha Ficha que se quiere analizar.
     * @returns Arreglo de casillas validas.
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

    /**
     * Realiza un movimiento y actualiza el tablero.
     *
     * 1. Comprueba que el movimiento sea valido.
     * 2. Calcula donde esta la ficha intermedia.
     * 3. Busca la ficha que sera eliminada.
     * 4. La elimina del arreglo usando splice().
     * 5. Actualiza fila y columna de la ficha que salto.
     * 6. La centra visualmente en su nuevo destino.
     *
     * @param ficha Ficha que realiza el salto.
     * @param destino Casilla de destino.
     * @returns true si el movimiento se realizo.
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

    /**
     * Determina si quedan movimientos posibles.
     *
     * Recorre el arreglo de fichas mediante some().
     * Para cada ficha obtiene sus destinos validos.
     * Si encuentra al menos una que puede saltar,
     * devuelve true.
     *
     * Si ninguna ficha puede moverse, devuelve false
     * y el juego puede finalizar.
     *
     * @returns true si existe al menos un salto posible.
     */
    quedanMovimientos() {

        return this.fichas.some(
            ficha =>
                this.destinosValidos(ficha).length > 0
        );
    }

    /**
     * Dibuja el fondo circular del tablero.
     *
     * 1. Guarda el estado del contexto con save().
     * 2. Crea un circulo y aplica clip() para recortar.
     * 3. Si existe una imagen de fondo, la dibuja.
     * 4. Si no existe, genera una textura de madera
     *    utilizando un degradado y curvas.
     * 5. Restaura el contexto con restore().
     * 6. Dibuja los aros exterior e interior.
     *
     * @param ctx Contexto 2D del canvas.
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

    /**
     * Dibuja los 37 huecos del tablero.
     *
     * Recorre las casillas y para cada una dibuja
     * un circulo utilizando sus coordenadas x e y.
     * Rellena el circulo y le agrega un borde.
     *
     * Este metodo solo dibuja: no modifica las fichas.
     *
     * @param ctx Contexto 2D del canvas.
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

    /**
     * Inicializa el juego completo.
     *
     * 1. Obtiene el canvas y su contexto de dibujo.
     * 2. Busca los contadores, botones y ventana modal.
     * 3. Crea las imagenes SVG de los fantasmas.
     * 4. Construye el tablero del juego.
     * 5. Configura el fondo opcional.
     * 6. Inicializa el estado del arrastre.
     * 7. Inicializa las ayudas, el tiempo y los movimientos.
     * 8. Registra los eventos del usuario.
     * 9. Ajusta el tamaño visual del canvas.
     * 10. Actualiza la pantalla e inicia la animacion.
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

        // Ruta opcional de imagen de fondo.
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

        // Adaptar el tablero cuando cambia la ventana.
        window.addEventListener(
            "resize",
            () => this.ajustarCanvas()
        );

        // Adaptar nuevamente al cargar toda la pagina.
        window.addEventListener(
            "load",
            () => this.ajustarCanvas()
        );

        this.actualizarPantalla();
        this.animar();
    }

    /**
     * Convierte las coordenadas del mouse a las del canvas.
     *
     * Obtiene el tamaño visible del canvas con
     * getBoundingClientRect().
     *
     * Resta la posicion del elemento respecto de la ventana
     * y aplica un factor de escala entre el tamaño visible
     * y su resolucion interna de 600x600.
     *
     * Esto permite que el mouse funcione correctamente
     * incluso cuando el tablero se muestra mas pequeño.
     *
     * @param evento Evento de mouse.
     * @returns Objeto con coordenadas x e y del canvas.
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

    /**
     * Registra todos los eventos del juego.
     *
     * Asocia mousedown con la seleccion de una ficha,
     * mousemove con el arrastre y mouseup con el intento
     * de realizar el salto.
     *
     * Tambien cancela arrastres si la ventana pierde el foco,
     * evita el arrastre nativo del navegador y conecta
     * los botones de reiniciar, ayudas y victoria.
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

    /**
     * Inicia el arrastre cuando se presiona una ficha.
     *
     * 1. Comprueba que se use el boton izquierdo.
     * 2. Verifica que la partida no haya terminado.
     * 3. Convierte las coordenadas del mouse.
     * 4. Busca la ficha sobre la que se hizo clic.
     * 5. Guarda esa ficha como seleccionada.
     * 6. Calcula la distancia entre el mouse y su centro.
     * 7. Cambia el cursor para indicar el arrastre.
     *
     * @param evento Evento mousedown.
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

    /**
     * Actualiza la posicion visual de la ficha arrastrada.
     *
     * Si no hay ficha seleccionada, termina inmediatamente.
     * Comprueba que el boton izquierdo siga presionado.
     *
     * Si el mouse sigue presionado, convierte sus coordenadas
     * y actualiza posX y posY de la ficha.
     *
     * Todavia no modifica su fila ni columna, porque
     * el movimiento se confirma recien al soltarla.
     *
     * @param evento Evento mousemove.
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

    /**
     * Procesa el movimiento al soltar el mouse.
     *
     * 1. Comprueba que exista una ficha seleccionada.
     * 2. Obtiene las coordenadas del mouse.
     * 3. Busca la casilla de destino.
     * 4. Comprueba que no se haya agotado el tiempo.
     * 5. Intenta mover la ficha mediante moverFicha().
     *
     * Si el salto es valido:
     * - Incrementa los movimientos.
     * - Inicia el cronometro si es el primer salto.
     * - Actualiza los contadores.
     * - Comprueba si quedan movimientos.
     *
     * Si el salto no es valido:
     * - Devuelve la ficha a su posicion original.
     * - Muestra un mensaje de error.
     *
     * @param evento Evento mouseup.
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

            // Verificar fin de partida.
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

    /**
     * Cancela el arrastre de la ficha seleccionada.
     *
     * Si hay una ficha en movimiento, llama a
     * volverAlCentro() para devolverla a su casilla.
     * Luego limpia la seleccion y restaura el cursor.
     *
     * No modifica el estado logico del tablero.
     */
    cancelarArrastre() {

        if (this.fichaSeleccionada) {

            this.fichaSeleccionada.volverAlCentro();
        }

        this.fichaSeleccionada = null;

        this.canvas.style.cursor = "grab";
    }

    /**
     * Dibuja las ayudas visuales del juego.
     *
     * Calcula un pulso animado mediante Math.sin().
     *
     * Si no hay ficha seleccionada, recorre las fichas
     * y resalta las que tienen al menos un salto posible.
     *
     * Si hay una ficha seleccionada, obtiene sus destinos
     * validos y dibuja un aro y una flecha sobre cada uno.
     *
     * @param tiempo Tiempo utilizado para animar las ayudas.
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

    /**
     * Redibuja todos los elementos del canvas.
     *
     * Primero limpia el contenido anterior.
     * Luego dibuja el fondo y los huecos del tablero.
     * Si las ayudas estan activadas, tambien las dibuja.
     *
     * Recorre el arreglo de fichas para dibujarlas,
     * excepto la que se encuentra seleccionada.
     *
     * Finalmente dibuja la ficha seleccionada por encima
     * de las demas para destacar el arrastre.
     *
     * @param tiempo Instante utilizado para la animacion.
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

    /**
     * Mantiene el ciclo continuo de dibujo del juego.
     *
     * Llama a dibujar() para actualizar el canvas
     * y utiliza requestAnimationFrame() para programar
     * el siguiente dibujo.
     *
     * Esto permite animar las ayudas y el movimiento
     * de las fichas mientras se arrastran.
     */
    animar() {

        this.dibujar();

        requestAnimationFrame(
            () => this.animar()
        );
    }

    /**
     * Inicia el cronometro luego del primer salto valido.
     *
     * Calcula una fecha limite sumando cinco minutos
     * a la hora actual obtenida mediante Date.now().
     *
     * Cada 200 milisegundos calcula cuantos segundos quedan.
     * Utiliza Math.ceil() para redondear hacia arriba
     * y Math.max() para evitar tiempos negativos.
     *
     * Actualiza la pantalla y, si llega a cero,
     * finaliza la partida por tiempo agotado.
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

    /**
     * Actualiza los contadores visibles del juego.
     *
     * Calcula los minutos con Math.floor() y los
     * segundos restantes con el operador modulo.
     *
     * Utiliza padStart() para mostrarlos como mm:ss.
     * Cuando quedan 30 segundos o menos, activa
     * una clase CSS para destacar el tiempo.
     *
     * Tambien actualiza las cantidades de fichas
     * y movimientos realizados.
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

    /**
     * Activa o desactiva las ayudas visuales.
     *
     * Invierte el valor booleano de ayudasActivas.
     * Luego actualiza el texto del boton y su
     * atributo aria-pressed.
     *
     * El metodo dibujar() consulta este valor
     * para decidir si debe mostrar las ayudas.
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

    /**
     * Simula una victoria para probar la pantalla final.
     *
     * Cancela cualquier arrastre y reemplaza el arreglo
     * de fichas por una sola ficha ubicada en el centro.
     *
     * Configura el contador de movimientos en 35,
     * actualiza la pantalla y llama a terminar().
     *
     * Es una previsualizacion: no resuelve realmente
     * todos los movimientos del tablero.
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

    /**
     * Finaliza la partida y muestra el resultado.
     *
     * 1. Comprueba que la partida no haya terminado.
     * 2. Marca el juego como finalizado.
     * 3. Detiene el cronometro con clearInterval().
     * 4. Cancela cualquier arrastre.
     * 5. Obtiene la cantidad de fichas restantes.
     * 6. Determina si hubo victoria, falta de movimientos
     *    o tiempo agotado.
     * 7. Actualiza el texto y muestra la ventana modal.
     *
     * @param motivo Causa de finalizacion de la partida.
     */
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

    /**
     * Reinicia completamente la partida.
     *
     * Detiene el cronometro y cancela el arrastre.
     * Luego llama a tablero.reiniciar() para volver
     * a colocar todas las fichas en sus posiciones.
     *
     * Restaura los cinco minutos, pone los movimientos
     * en cero y vuelve a habilitar la partida.
     *
     * Finalmente oculta la ventana modal y actualiza
     * los contadores y el mensaje de instrucciones.
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

    /**
     * Ajusta el tamaño visible del tablero a la pantalla.
     *
     * 1. Busca el contenedor del escenario y la seccion.
     * 2. Comprueba que el juego este visible.
     * 3. Mide la posicion y el espacio ocupado por los
     *    elementos que se encuentran debajo del tablero.
     * 4. Obtiene la altura disponible en el navegador.
     * 5. Calcula el ancho disponible descontando paddings.
     * 6. Elige un tamaño entre 150 y 600 pixeles.
     * 7. Aplica ese tamaño al escenario.
     *
     * La resolucion interna del canvas permanece en 600x600,
     * de modo que el tablero mantiene sus proporciones.
     */
    ajustarCanvas() {

        const escenario =
            document.querySelector(".peg__escenario");

        const seccion =
            document.querySelector("#peg-juego");

        // No calcular mientras el juego este oculto.
        if (
            !escenario ||
            !seccion ||
            seccion.classList.contains("peg--oculto")
        ) {
            return;
        }

        const rectEscenario =
            escenario.getBoundingClientRect();

        const rectSeccion =
            seccion.getBoundingClientRect();

        // Espacio ocupado debajo del tablero.
        const espacioInferior = Math.max(
            0,
            rectSeccion.bottom - rectEscenario.bottom
        );

        // Altura visible del navegador.
        const altoPantalla =
            window.visualViewport?.height ??
            window.innerHeight;

        // Altura disponible para el tablero.
        const altoDisponible =
            altoPantalla -
            rectEscenario.top -
            espacioInferior -
            12;

        // Ancho interior del contenedor.
        const estilos = getComputedStyle(seccion);

        const anchoDisponible =
            seccion.clientWidth -
            parseFloat(estilos.paddingLeft) -
            parseFloat(estilos.paddingRight);

        // Adaptar el tablero manteniendo sus proporciones.
        const lado = Math.max(
            150,
            Math.min(
                600,
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
 * Espera a que el documento HTML termine de cargarse.
 * Comprueba que exista el canvas del Peg Solitaire.
 * Si existe, crea una instancia de JuegoPeg,
 * que inicializa todos los elementos del juego.
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (document.querySelector("#peg-canvas")) {

            new JuegoPeg();
        }
    }
);
