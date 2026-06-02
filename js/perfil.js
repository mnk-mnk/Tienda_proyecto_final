// Obtener el usuario guardado en el login
var usuarioActivo = localStorage.getItem("activeUsername");

if (!usuarioActivo) {
    usuarioActivo = "mor_2314";
}
// Cargar los datos al abrir la pantalla
//obtenerDatosUsuario();
rellenarDatosMorticia();
mostrarFavoritos();
configurarBotonSalir();

// ========================================
// TRAER USUARIO DE LA API
// ========================================
function rellenarDatosMorticia() {

    
       // Rellena las cajas de texto (inputs)
    document.getElementById("profileFirstname").value = "Morticia";
    document.getElementById("profileLastname").value = "Addams";
    document.getElementById("profileUser").value = "mor_2314";
    document.getElementById("profileEmail").value = "mor_2314@gmail.com";
    document.getElementById("profilePhone").value = "666 666 666";
    document.getElementById("profileCity").value = "Westfield, Nueva York";
}

// ========================================
// PINTAR LOS FAVORITOS EN LA PARTE INFERIOR
// ========================================
function mostrarFavoritos() {
    var contenedorGrid = document.getElementById("profileFavoritesGrid");
    if (!contenedorGrid) return;

    var listaFavoritos = [];
    if (localStorage.getItem("favoritos")) {
        listaFavoritos = JSON.parse(localStorage.getItem("favoritos"));
    }

    contenedorGrid.innerHTML = ""; // Limpiamos

    if (listaFavoritos.length === 0) {
        contenedorGrid.innerHTML = "<p>No tienes favoritos añadidos.</p>";
        return;
    }

    // Recorremos los productos guardados con un bucle for tradicional
    for (var i = 0; i < listaFavoritos.length; i++) {
        var producto = listaFavoritos[i];

        // Creamos la tarjeta a mano
        var tarjeta = document.createElement("div");
        tarjeta.className = "fav-card";

        tarjeta.innerHTML = `
            <img src="${producto.image}">
            <h3>${producto.title}</h3>
            <p>${producto.price}€</p>
        `;

        // Guardamos su ID en una propiedad para saber cuál es al pinchar
        tarjeta.id = producto.id;

        // Al pulsar va a la pantalla de detalle.html pasando su id
        tarjeta.addEventListener("click", function () {
            window.location.href = "detalle.html?id=" + this.id;
        });

        contenedorGrid.appendChild(tarjeta);
    }
}

// ========================================
// BOTÓN LOGOUT
// ========================================
function configurarBotonSalir() {
    var botonSalir = document.getElementById("logoutBtn");
    if (!botonSalir) return;

    botonSalir.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("activeUsername");
        alert("Has cerrado sesión");
        window.location.href = "index.html";
    });
}
