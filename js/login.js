// pagina completa de login/registro
const paginaLogin = document.querySelector(".pagina-login");


// botones para cambiar entre login y registro
const mostrarRegistro = document.getElementById("mostrar-registro");
const mostrarLogin = document.getElementById("volver-login");


// elementos del registro y login
const formRegistro = document.querySelector(".formulario-registro");
const encabezadoRegistro = document.querySelector(".registro__encabezado");
const inicioSesionRegistro = document.querySelector(".registro__inicio-sesion");
const registroExitoso = document.querySelector("#registro-exitoso");

const formLogin = document.querySelector(".formulario-login");
const encabezadoLogin = document.querySelector(".login__encabezado");
const inicioSesionText = document.querySelector(".login__descripcion");
const loginExitoso = document.querySelector("#login-exitoso");
const enlaceRegistroLogin = document.querySelector(".login__registro");


// MOSTRAR REGISTRO
mostrarRegistro.addEventListener("click", function () {

    paginaLogin.classList.add("registro-activo");

});




// VOLVER AL LOGIN MANUALMENTE
mostrarLogin.addEventListener("click", function () {

    paginaLogin.classList.remove("registro-activo");

});




// ENVIAR FORMULARIO DE REGISTRO
formRegistro.addEventListener("submit", function (e) {

    // evita que el formulario recargue la pagina
    e.preventDefault();


    // verifica los required, email, min, etc.
    if (!formRegistro.checkValidity()) {

        formRegistro.reportValidity();

        return;
    }


    // ocultamos titulo y descripcion:
    // "Registrarse"
    // "Ingresa los datos para completar el registro"
    encabezadoRegistro.hidden = true;


    // ocultamos el formulario
    formRegistro.hidden = true;


    // ocultamos:
    // "¿Ya tienes cuenta? Inicia sesión."
    inicioSesionRegistro.hidden = true;


    // mostramos el mensaje animado de registro exitoso
    registroExitoso.hidden = false;


    // esperamos 2 segundos
    setTimeout(function () {

        // vuelve al panel de inicio de sesion
        paginaLogin.classList.remove("registro-activo");


        // esperamos un poquito para restaurar el registro
        // cuando ya no se esta viendo
        setTimeout(function () {

            encabezadoRegistro.hidden = false;

            formRegistro.hidden = false;

            inicioSesionRegistro.hidden = false;

            registroExitoso.hidden = true;


            // limpia los campos del formulario
            formRegistro.reset();

        }, 500);


    }, 2000);

});



// ENVIAR FORMULARIO DE LOGIN

formLogin.addEventListener("submit", function (e) {

    e.preventDefault();


    // verificamos el formulario
    if (!formLogin.checkValidity()) {

        formLogin.reportValidity();

        return;
    }


    // ocultamos el encabezado
    encabezadoLogin.hidden = true;


    // ocultamos el formulario
    formLogin.hidden = true;


    // ocultamos el enlace al registro
    enlaceRegistroLogin.hidden = true;


    // mostramos la animacion de exito
    loginExitoso.hidden = false;


    // esperamos 2 segundos
    setTimeout(function () {

        // redirigimos al Home
        window.location.href = "home.html";

    }, 2000);

});