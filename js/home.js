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