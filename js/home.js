// =========================================================
// LOADING
// =========================================================

const loading = document.querySelector("#loading");

const loadingProgreso = document.querySelector("#loading-progreso");

const loadingPorcentaje = document.querySelector("#loading-porcentaje");


let porcentaje = 0;


// aumenta 1% cada 50 milisegundos
// 100 x 50ms = 5000ms = 5 segundos

const intervaloLoading = setInterval(() => {

    porcentaje++;


    // actualiza el numero
    loadingPorcentaje.textContent = porcentaje + "%";


    // actualiza el ancho de la barra
    loadingProgreso.style.width = porcentaje + "%";


    // cuando llega a 100 termina el loading
    if (porcentaje >= 100) {

        clearInterval(intervaloLoading);

        loading.hidden = true;

        document.body.classList.remove("cargando");

    }

}, 15); //aca cambias si queres un tiempo de carga distinto

//menu HAmburguesa
const botonMenu = document.querySelector("[data-boton-menu]");
const menuCategorias = document.querySelector("#menu-categorias");

botonMenu.addEventListener("click", () => {
    menuCategorias.hidden = !menuCategorias.hidden;
});


// menu usuario
const botonPerfil = document.querySelector("[data-boton-perfil]");
const menuUsuario = document.querySelector("#menu-usuario");

botonPerfil.addEventListener("click", () => {
    menuUsuario.hidden = !menuUsuario.hidden;
});