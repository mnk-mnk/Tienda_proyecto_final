// Modal login
const loginModal =
  document.getElementById("loginModal");

// Botón abrir login
const loginBtn =
  document.querySelector("#login-btn");

// Botón cerrar login
const closeLogin =
  document.getElementById("closeLogin");

// Formulario login
const loginForm =
  document.getElementById("loginForm");


// Botón Mi cuenta
const accountBtn = document.getElementById("account-btn");


// Botón Panel Admin
//const adminBtn = document.getElementById("admin-btn");

// Credenciales únicas del Administrador
const adminUser = "admin";
const adminPass = "ADMIN";


/*
OBJETIVO:
Mantener sesión iniciada.

TAREAS:
- Detectar token
- Mostrar login si no existe
*/

/*
function checkSession() {
  // TODO
  const isLogin = sessionStorage.getItem('token');
  const isAdmin = sessionStorage.getItem('isAdmin');

  const adminBtnActivo = document.getElementById("admin-btn");

  if (isLogin) {
    // Ocultar boton de login
    loginBtn.setAttribute("hidden", true);
    logoutBtn.removeAttribute("hidden");

    if (isAdmin === "true") {
      if (adminBtnActivo) adminBtnActivo.removeAttribute("hidden"); // Muestra engranaje al admin
      accountBtn.setAttribute("hidden", true);         // Oculta "Mi cuenta" al admin
    } else {
      if (adminBtnActivo) adminBtnActivo.setAttribute("hidden", true); // Oculta engranaje al cliente
      accountBtn.removeAttribute("hidden");               // Muestra "Mi cuenta" al cliente
    }
  } else {
    // Mostrar login si no existe
    loginBtn.removeAttribute("hidden");
    logoutBtn.setAttribute("hidden", true);
    // ocultar boton mi cuenta
    accountBtn.setAttribute("hidden", true);
    if (adminBtnActivo) adminBtnActivo.setAttribute("hidden", true);
  }
}
*/

function checkSession() {
  const isLogin = sessionStorage.getItem('token');

  if (isLogin) {
    // Ocultar botón de login y mostrar cerrar sesión
    loginBtn.setAttribute("hidden", true);
    logoutBtn.removeAttribute("hidden");
    accountBtn.removeAttribute("hidden"); // Muestra siempre "Mi cuenta" si hay sesión
  } else {
    // Si no hay sesión, mostramos login y ocultamos el resto
    loginBtn.removeAttribute("hidden");
    logoutBtn.setAttribute("hidden", true);
    accountBtn.setAttribute("hidden", true);
  }
}



/*
OBJETIVO:
Cerrar sesión.

TAREAS:
- Eliminar token
- Cerrar modal
*/

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", logout);


function logout() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('isAdmin');
  cerrarModal();
  checkSession();
}


// ========================================
// MODAL LOGIN
// ========================================

/*
========================================
EXTRA
========================================
*/

function cerrarModal() {
  loginModal.classList.add("hidden");
}

function abrirModal() {
  loginModal.classList.remove("hidden");
}

/*
OBJETIVO:
Abrir modal login.
*/

loginBtn.addEventListener("click", abrirModal);


/*
OBJETIVO:
Cerrar modal login.
*/

closeLogin.addEventListener("click", cerrarModal);


/*
OBJETIVO:
Cerrar modal clicando fuera.
*/

loginModal.addEventListener(
  "click",
  (e) => {

    if (e.target === loginModal) {
      cerrarModal();
    }
  }
);


// ========================================
// FASE 5 - LOGIN
// ========================================

// Abrir modal al pulsar "Mi cuenta"
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    if (loginModal) {
      loginModal.classList.remove("hidden");
    }
  });
}

// Cerrar modal al pulsar la equis (✕)
if (closeLogin) {
  closeLogin.addEventListener("click", () => {
    if (loginModal) {
      loginModal.classList.add("hidden");
    }
  });
}

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Simular login con FakeStoreAPI.

ENDPOINT:
https://fakestoreapi.com/auth/login

USUARIO TEST:
mor_2314
83r5^_

CONCEPTOS:
- fetch POST
- JSON.stringify()
- sessionStorage

TAREAS:
- Capturar formulario
- Enviar datos
- Guardar token
- Cerrar modal
*/

loginForm.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();

    // Capturar formulario
    const usernameValue = document.getElementById("username").value.trim();
    const passwordValue = document.getElementById("password").value;

    // 1. COMPROBACIÓN RESTRITA: ¿Es el Administrador con tus variables?
    if (usernameValue === adminUser && passwordValue === adminPass) {
      sessionStorage.setItem("token", "admin-token-simulado-12345");
      sessionStorage.setItem("isAdmin", "true"); // Registramos que es admin

      if (loginModal) {
        loginModal.classList.add("hidden");
      }

      alert("¡Acceso concedido! Entrando al panel de administración.");
      checkSession();

      // Redirección inmediata al panel de control
      window.location.href = "panelAdmin.html";
      return; // Detiene el código aquí para que no ejecute el fetch de la API
    }

    // 2. enviar datos
    fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Credenciales inválidas");
        }
        return response.json();
      })
      .then((data) => {
        // 3. Guardar token
        if (data.token) {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("isAdmin", "false"); // No es administrador, es cliente

          // 4 Cerrar modal
          if (loginModal) {
            loginModal.classList.add("hidden");
          }
          alert("¡Login correcto!");
          checkSession();
        }
      })
      .catch((error) => {
        console.error("Error en el login:", error);
        alert("Usuario o contraseña incorrectos.");
      });

  }
);

// =========================
// INIT
// =========================

checkSession();

// ========================================
// ENLAZAR CON LA PÁGINA DE PERFIL (FASE 2)
// ========================================
var botonMiCuenta = document.getElementById("account-btn");

if (botonMiCuenta) {
  botonMiCuenta.addEventListener("click", function () {
    window.location.href = "perfil.html";
  });
}


// ========================================
// CONTROL DE ACCESO AL PANEL DESDE TUERCA 
// ========================================
var botonTuercaAdmin = document.getElementById("admin-btn");

if (botonTuercaAdmin) {
  botonTuercaAdmin.addEventListener("click", function() {
    var adminLogueado = sessionStorage.getItem('isAdmin');

    if (adminLogueado === "true") {
      // Si la sesión de admin ya existe en la memoria, viaja directo al panel
      window.location.href = "panelAdmin.html";
    } else {
      // Si no, exige la autenticación abriendo el modal en la pantalla actual
      alert("Por favor, inicia sesión con tus credenciales de Administrador.");
      abrirModal();
    }
  });
}
