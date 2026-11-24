(() => {
    const escenario = document.querySelector('#fg-escenario');
    const marco = escenario.parentElement;
    const fantasma = document.querySelector('#fg-fantasma');
    const obstaculos = document.querySelector('#fg-obstaculos');
    const portada = document.querySelector('#fg-portada');
    const listo = document.querySelector('#fg-listo');
    const fin = document.querySelector('#fg-fin');
    const hud = document.querySelector('.fg-hud');
    const contador = document.querySelector('#fg-puntos');
    const vidas = document.querySelector('#fg-vidas');
    const bonus = document.querySelector('#fg-bonus');
    const cronometro = document.querySelector('#fg-tiempo');
    const aviso = document.querySelector('#fg-aviso');
    const jugar = document.querySelector('#fg-jugar');
    const reiniciar = document.querySelector('#fg-reiniciar');
    const capas = [...escenario.querySelectorAll('[data-parallax]')].map(capa => ({
        elemento: capa,
        factor: Number(capa.dataset.parallax),
        mosaico: Number(capa.dataset.mosaico)
    }));
    const escritorio = window.matchMedia('(min-width: 761px) and (any-hover: hover) and (any-pointer: fine)');

    // Las medidas usan el escenario original. El CSS escala toda la escena junta.
    const ANCHO = 1160;
    const ALTO = 540;
    const PISO = 498;
    const X_FANTASMA = 214;
    const TAM_FANTASMA = 56;
    const SEMIANCHO_FANTASMA = 19;
    const SEMIALTO_FANTASMA = 21;
    const ANCHO_TUBO = 88;
    const TAM_PACMAN = 44;
    const TAM_MONEDA = 32;
    const GRAVEDAD = 1000;
    const IMPULSO = -350;
    const INVULNERABILIDAD = 2;
    const TIEMPO_PARA_ACELERAR = 14;
    const VELOCIDAD_INICIAL = 152;
    const VELOCIDAD_MAXIMA = 264;
    const PASO = 1 / 120;
    const META_TUBOS = 25;
    const LIMITE_TIEMPO = 2 * 60; // Segundos. Funciona aunque el cronómetro esté oculto en HTML.

    let estado = 'portada';
    let resultadoActual = 'derrota';
    let ultimoSegundoMostrado = -1;
    let y = 242;
    let velocidadY = 0;
    let mediasVidas = 6;
    let puntos = 0;
    let tiempo = 0;
    let distancia = 0;
    let invulnerableHasta = 0;
    let impulsoHasta = 0;
    let avisoHasta = 0;
    let tubos = [];
    let ultimoTubo = null;
    let fotograma = 0;
    let instanteAnterior = null;
    let acumulado = 0;
    let puedeReiniciarEn = 0;
    let anchoDelMarco = 0;

    const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor));
    const aleatorio = (minimo, maximo) => minimo + Math.random() * (maximo - minimo);

    function cambiarEstado(nuevoEstado) {
        estado = nuevoEstado;
        escenario.dataset.estado = nuevoEstado;
        portada.hidden = nuevoEstado !== 'portada';
        listo.hidden = nuevoEstado !== 'listo';
        fin.hidden = nuevoEstado !== 'fin';
        hud.hidden = nuevoEstado === 'portada';
    }

    function escalar() {
        // El contenedor tiene 4px de padding a cada lado.
        const anchoDisponible = marco.clientWidth - 8;
        if (anchoDisponible <= 0 || anchoDisponible === anchoDelMarco) return;
        anchoDelMarco = anchoDisponible;
        const escala = anchoDisponible / ANCHO;
        escenario.style.setProperty('--fg-escala', escala);
        marco.style.height = `${ALTO * escala + 10}px`;
    }

    function actualizarHud() {
        vidas.textContent = String(mediasVidas / 2).replace('.', ',');
        contador.textContent = puntos;
        const restantes = 5 - puntos % 5;
        bonus.textContent = `en ${restantes} ${restantes === 1 ? 'tubo' : 'tubos'}`;
    }

    function actualizarCronometro() {
        const segundosTranscurridos = Math.min(Math.floor(tiempo), LIMITE_TIEMPO);
        if (segundosTranscurridos === ultimoSegundoMostrado) return;
        ultimoSegundoMostrado = segundosTranscurridos;
        const minutos = Math.floor(segundosTranscurridos / 60).toString().padStart(2, '0');
        const segundos = (segundosTranscurridos % 60).toString().padStart(2, '0');
        cronometro.textContent = `${minutos}:${segundos}`;
    }

    function mostrarAviso(texto, tipo) {
        aviso.dataset.tipo = tipo;
        aviso.textContent = texto;
        avisoHasta = tiempo + 1.4;
    }

    function nuevoTubo() {
        const numero = ultimoTubo ? ultimoTubo.numero + 1 : 1;
        const posicion = ultimoTubo ? ultimoTubo.x + aleatorio(232, 327) : 485;
        const abertura = Math.max(172, 236 - puntos * 3);
        const centroAnterior = ultimoTubo ? ultimoTubo.centro : 249;
        // modificamos la altura anterior en un rango de 55 pixeles arriba o abajo
        const centro = limitar(centroAnterior + aleatorio(-55, 55), abertura / 2 + 55, PISO - abertura / 2 - 63);
        const techo = Math.round(centro - abertura / 2);
        const base = Math.round(centro + abertura / 2);

        const elemento = document.createElement('div');
        elemento.className = 'fg-tubos';
        elemento.style.setProperty('--fg-tope', `${techo}px`);
        elemento.style.setProperty('--fg-base', `${base}px`);
        elemento.innerHTML = '<div class="fg-tubo fg-tubo--superior"></div><div class="fg-tubo fg-tubo--inferior"></div>';

        let pacman = null;
        let moneda = null;
        if (numero >= 4 && (numero - 4) % 4 === 0) {
            elemento.classList.add('fg-tubos--amenaza');
            pacman = document.createElement('div');
            pacman.className = 'fg-pacman';
            elemento.append(pacman);
        } else if (numero % 2 === 1) {
            moneda = document.createElement('div');
            moneda.className = 'fg-moneda';
            elemento.append(moneda);
        }

        ultimoTubo = { numero, x: posicion, centro, techo, base, elemento, moneda, pacman, contado: false };
        tubos.push(ultimoTubo);
        obstaculos.append(elemento);
    }

    function preparar() {
        cancelarBucle();
        obstaculos.replaceChildren();
        tubos = [];
        ultimoTubo = null;
        y = 242;
        velocidadY = 0;
        mediasVidas = 6;
        puntos = 0;
        tiempo = 0;
        ultimoSegundoMostrado = -1;
        resultadoActual = 'derrota';
        distancia = 0;
        invulnerableHasta = 0;
        impulsoHasta = 0;
        avisoHasta = 0;
        aviso.textContent = '';
        actualizarHud();
        actualizarCronometro();
        cambiarEstado('listo');
        dibujar();
        escenario.focus({ preventScroll: true });
    }

    function saltar() {
        // hace que se mueva en y para arriba
        // la gravedad sigue actuando, entonces se frena, alcanza una altura maxima y despues vuelve a caer
        velocidadY = IMPULSO;
        impulsoHasta = tiempo + .27;
        fantasma.classList.remove('impulso');
        // Reinicia el spritesheet si llega otro clic antes del último cuadro.
        void fantasma.offsetWidth;
        fantasma.classList.add('impulso');
    }

    function actuar() {
        if (!escritorio.matches) return;

        if (estado === 'fin') {
            if (performance.now() >= puedeReiniciarEn) preparar();
            return;
        }

        if (estado === 'listo') {
            cambiarEstado('jugando');
            nuevoTubo();
            while (ultimoTubo.x < ANCHO + ANCHO_TUBO) nuevoTubo();
            dibujar();
            fotograma = requestAnimationFrame(animar);
        }

        if (estado === 'jugando') saltar();
    }

    function terminar(motivo, resultado = 'derrota') {
        // Un único panel de finalización para victoria, derrota por tiempo o derrota por daño.
        resultadoActual = resultado;
        fin.dataset.resultado = resultado;
        document.querySelector('#fg-motivo').textContent = motivo;
        document.querySelector('#fg-titulo-fin').textContent = resultado === 'victoria' ? '¡Victoria!' : 'Perdiste';
        document.querySelector('#fg-resultado').textContent = puntos;
        puedeReiniciarEn = performance.now() + 380;
        aviso.textContent = '';
        cambiarEstado('fin');
        reiniciar.focus({ preventScroll: true });
    }

    function recibirDano(fuente) {
        // chequeo q no este en el periodo de invunerabilidad
        if (tiempo < invulnerableHasta) return;
        mediasVidas--;
        invulnerableHasta = tiempo + INVULNERABILIDAD;
        actualizarHud();

        if (mediasVidas === 0) {
            terminar('Te quedaste sin vidas');
        } else {
            mostrarAviso(`${fuente} · −½ vida`, 'dano');
        }
    }

    function sumarVidas(cantidad, texto) {
        mediasVidas += cantidad;
        actualizarHud();
        mostrarAviso(texto, 'bonus');
    }

    function yPacman(tubo) {
        const separacion = tubo.x + ANCHO_TUBO / 2 - X_FANTASMA;
        // Anticipa la mordida y se esconde cuando el fantasma ya pasó.
        const salida = limitar((203 - separacion) / 117, 0, 1);
        const regreso = limitar((separacion + 128) / 79, 0, 1);
        return tubo.techo - TAM_PACMAN / 2 + 48 * Math.min(salida, regreso);
    }

    function yMoneda(tubo) {
        return tubo.centro + 13 * Math.sin(tiempo * 3.6 + tubo.numero);
    }

    // calcula la distancia del fantasma con el objeto a ver si colisiona
    function tocaCirculo(xCirculo, yCirculo, radio) {
        const xCercana = limitar(xCirculo, X_FANTASMA - SEMIANCHO_FANTASMA, X_FANTASMA + SEMIANCHO_FANTASMA);
        const yCercana = limitar(yCirculo, y - SEMIALTO_FANTASMA, y + SEMIALTO_FANTASMA);
        return (xCirculo - xCercana) ** 2 + (yCirculo - yCercana) ** 2 < radio ** 2;
    }

    function actualizarTubo(tubo, avance) {
        tubo.x -= avance;
        const derecha = tubo.x + ANCHO_TUBO;
        const centroX = tubo.x + ANCHO_TUBO / 2;
        const juntoAlTubo = X_FANTASMA + SEMIANCHO_FANTASMA > tubo.x && X_FANTASMA - SEMIANCHO_FANTASMA < derecha;

        if (juntoAlTubo && (y - SEMIALTO_FANTASMA < tubo.techo || y + SEMIALTO_FANTASMA > tubo.base)) {
            recibirDano('Choque con un tubo');
        }

        if (estado === 'jugando' && tubo.pacman && y + SEMIALTO_FANTASMA > tubo.techo) {
            const centroPacman = yPacman(tubo);
            if (centroPacman + 18 > tubo.techo && tocaCirculo(centroX, centroPacman, 18)) {
                recibirDano('Mordida de Pac-Man');
            }
        }
        if (estado !== 'jugando') return;

        if (tubo.moneda && tocaCirculo(centroX, yMoneda(tubo), 14)) {
            tubo.moneda.remove();
            tubo.moneda = null;
            sumarVidas(1, 'Moneda · +½ vida');
        }

        if (!tubo.contado && derecha < X_FANTASMA - SEMIANCHO_FANTASMA) {
            tubo.contado = true;
            puntos++;
            if (puntos >= META_TUBOS) {
                actualizarHud();
                terminar(`¡Superaste los ${META_TUBOS} tubos!`, 'victoria');
                return;
            }
            if (puntos % 5 === 0) {
                sumarVidas(2, `${puntos} tubos · +1 vida`);
            } else {
                actualizarHud();
            }
        }
    }

    function actualizar(paso) {
        tiempo += paso;
        actualizarCronometro();
        if (tiempo >= LIMITE_TIEMPO) {
            terminar('Se terminaron los 2 minutos');
            return;
        }
        velocidadY = Math.min(420, velocidadY + GRAVEDAD * paso);
        y += velocidadY * paso;

        if (y < TAM_FANTASMA / 2) {
            y = TAM_FANTASMA / 2;
            velocidadY = 0;
        }
        if (y + TAM_FANTASMA / 2 >= PISO) {
            y = PISO - TAM_FANTASMA / 2;
            terminar('Tocaste el piso');
            return;
        }

        const velocidad = Math.min(VELOCIDAD_MAXIMA, VELOCIDAD_INICIAL + Math.max(0, tiempo - TIEMPO_PARA_ACELERAR) * 3.1);
        const avance = velocidad * paso;
        distancia += avance;
        for (const tubo of tubos) {
            actualizarTubo(tubo, avance);
            if (estado !== 'jugando') return;
        }

        if (tubos[0].x + ANCHO_TUBO < 0) tubos.shift().elemento.remove();
        if (ultimoTubo.x < ANCHO + ANCHO_TUBO) nuevoTubo();
        if (tiempo >= avisoHasta && aviso.textContent) aviso.textContent = '';
    }

    function dibujar() {
        for (const capa of capas) {
            const desplazamiento = (distancia * capa.factor) % capa.mosaico;
            capa.elemento.style.backgroundPositionX = `${-desplazamiento}px`;
        }

        const giro = limitar(velocidadY / 18, -11, 20);
        fantasma.style.transform = `translate(${X_FANTASMA - TAM_FANTASMA / 2}px, ${y - TAM_FANTASMA / 2}px) rotate(${giro}deg)`;
        fantasma.classList.toggle('danado', estado === 'jugando' && tiempo < invulnerableHasta);
        fantasma.classList.toggle('caido', estado === 'fin' && resultadoActual !== 'victoria');
        if (tiempo >= impulsoHasta || estado !== 'jugando') fantasma.classList.remove('impulso');

        for (const tubo of tubos) {
            tubo.elemento.style.transform = `translateX(${tubo.x}px)`;
            if (tubo.pacman) {
                const centro = yPacman(tubo);
                tubo.pacman.style.top = `${centro - TAM_PACMAN / 2}px`;
                tubo.pacman.style.clipPath = `inset(${limitar(tubo.techo - centro + TAM_PACMAN / 2, 0, TAM_PACMAN)}px 0 0)`;
            }
            if (tubo.moneda) tubo.moneda.style.top = `${yMoneda(tubo) - TAM_MONEDA / 2}px`;
        }
    }

    function animar(instante) {
        // Limita el salto temporal al volver de una pestaña inactiva.
        if (instanteAnterior !== null) acumulado += Math.min((instante - instanteAnterior) / 1000, .05);
        instanteAnterior = instante;

        while (acumulado >= PASO && estado === 'jugando') {
            actualizar(PASO);
            acumulado -= PASO;
        }
        dibujar();

        if (estado === 'jugando') {
            fotograma = requestAnimationFrame(animar);
        } else {
            cancelarBucle();
        }
    }

    function cancelarBucle() {
        cancelAnimationFrame(fotograma);
        instanteAnterior = null;
        acumulado = 0;
    }

    jugar.addEventListener('click', () => {
        if (escritorio.matches) preparar();
    });
    escenario.addEventListener('click', evento => {
        if (evento.target !== jugar && !jugar.contains(evento.target)) actuar();
    });
    document.addEventListener('keydown', evento => {
        if (evento.code !== 'Space' || evento.altKey || evento.ctrlKey || evento.metaKey) return;
        if (evento.target.closest('input, textarea, select, a, [contenteditable]')) return;
        if (!escritorio.matches || estado === 'portada') return;
        evento.preventDefault();
        if (!evento.repeat) actuar();
    });

    function actualizarDispositivo() {
        marco.classList.toggle('fg-marco--movil', !escritorio.matches);
        if (!escritorio.matches) {
            cancelarBucle();
            cambiarEstado('portada');
        }
    }

    escritorio.addEventListener('change', actualizarDispositivo);
    new ResizeObserver(escalar).observe(marco);
    actualizarDispositivo();
    escalar();
    dibujar();
})();
