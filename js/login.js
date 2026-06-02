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
/*
OBJETIVO:
Mantener sesión iniciada.

TAREAS:
- Detectar token
- Mostrar login si no existe
*/


function checkSession() {
  // TODO
  const isLogin = sessionStorage.getItem('token');

  if (isLogin) {
    // Ocultar boton de login
    loginBtn.setAttribute("hidden", true);
    logoutBtn.removeAttribute("hidden");
    // mostrar boton mi cuenta
    accountBtn.removeAttribute("hidden");
  } else {
    // Mostrar login si no existe
    loginBtn.removeAttribute("hidden");
    logoutBtn.setAttribute("hidden", true);
    // ocultar boton mi cuenta
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
  // TODO
  sessionStorage.removeItem('token');
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

    // TODO
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
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;

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
