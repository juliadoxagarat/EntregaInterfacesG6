const paginaLogin = document.querySelector(".pagina-login");

const mostrarRegistro = document.getElementById("mostrar-registro");
const mostrarLogin = document.getElementById("volver-login");


mostrarRegistro.addEventListener("click", function () {

    paginaLogin.classList.add("registro-activo");

});


mostrarLogin.addEventListener("click", function () {

    paginaLogin.classList.remove("registro-activo");

});