// =========================
// VARIABLES GLOBALES
// =========================
let currentProduct = null;

const urlBase = "https://fakestoreapi.com/products";

// Captura el id de la URL (?id=1)
const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id");

// =========================
// OBTENER PRODUCTO
// =========================
function getProduct() {
    if (!idProducto) {
        alert("No has seleccionado ningún producto");
        window.location.href = "index.html";
        return;
    }


    fetch(urlBase + "/" + idProducto)
        .then(response => response.json())
        .then(data => {
            currentProduct = data;

            // Llamamos a pintar el producto
            renderProduct(currentProduct);

            // Llamamos a buscar los relacionados pasando la categoría
            getRelatedProducts(currentProduct.category);
        })
        .catch(error => {
            console.log("Error al traer el producto:", error);
        });
}

// =========================
// RENDER PRODUCTO
// =========================
function renderProduct(producto) {
    // Selectores del HTML
    const imgElement = document.getElementById("productImage");
    const catElement = document.getElementById("productCategory");
    const titleElement = document.getElementById("productTitle");
    const descElement = document.getElementById("productDescription");
    const priceElement = document.getElementById("productPrice");
    const reviewElement = document.getElementById("productReviews");
    const breadcrumbElement = document.querySelector(".breadcrumb");
    const skuElement = document.getElementById("productSKU");


    // Nuevos selectores 

    const brandElement = document.getElementById("productBrand");
    const stockElement = document.getElementById("productStock");
    const shippingElement = document.getElementById("productShipping");

    // Meto los datos dentro del DOM
    imgElement.src = producto.image;
    imgElement.alt = producto.title;
    catElement.textContent = producto.category;
    titleElement.textContent = producto.title;
    descElement.textContent = producto.description;
    priceElement.textContent = producto.price + "€";

    // Modifico el SKU + el id 
    //skuElement.textContent = producto.id;

    // Pongo el número de reviews si viene en la API
    if (producto.rating) {
        reviewElement.textContent = " (" + producto.rating.count + " reviews)";
    }

    // Mapea exactamente como Home / Categoría / Product
    breadcrumbElement.textContent = "Home / " + producto.category + " / Product";

    // En todos los articulos va lo mismo porque no hay esos datos en la API
    // 2. SOLUCIÓN CARACTERÍSTICAS: Usamos los datos directos de la respuesta de la API
    
     // 1. Marca: Primera palabra del title

    brandElement.style.whiteSpace = "pre-line"; // Permite procesar los saltos de línea
    stockElement.style.whiteSpace = "pre-line";
    shippingElement.style.whiteSpace = "pre-line";
    skuElement.style.whiteSpace = "pre-line";

    brandElement.textContent = "Marca\n " + "NovaWear";
    stockElement.textContent = "Stock\n " + producto.id + " unidades"; // El ID actúa como stock
    shippingElement.textContent = "Envío\n 24h Gratis";
    skuElement.textContent = "SKU\n " + "NS-2026"


    // 3. SOLUCIÓN COMPROBACIÓN FAVORITOS: Revisar ANTES de pintar el corazón
    const favBtnElement = document.getElementById("favoriteBtn");

    // Comprobar si el producto ya está guardado en favoritos para pintar el corazón adecuado
    let favoritosGuardados = [];
    if (localStorage.getItem("favoritos")) {
        favoritosGuardados = JSON.parse(localStorage.getItem("favoritos"));
    }

    // Buscamos si este ID específico ya está guardado en el array de LocalStorage
    let encontrado = favoritosGuardados.find(item => item.id === producto.id);

    if (encontrado) {
        favBtnElement.textContent = "❤️";
    } else {
        favBtnElement.textContent = "🤍";
    }
}


// =========================
// RELACIONADOS
// =========================


function getRelatedProducts(categoria) {
    fetch(urlBase)
        .then(response => response.json())
        .then(data => {
            // Filtramos los de la misma categoría, excluyendo el artículo actual
            let filtrados = data.filter(producto => producto.category === categoria && producto.id !== currentProduct.id);

            // Enviamos la lista filtrada a renderizar
            renderRelatedProducts(filtrados);
        })
        .catch(error => {
            console.log("Error al traer los relacionados:", error);
        });
}

function renderRelatedProducts(productosFiltrados) {
    const relatedGrid = document.getElementById("relatedGrid");
    relatedGrid.innerHTML = ""; // Limpieza preventiva del contenedor

    // Fijamos un tope máximo de 4 tarjetas en la grilla inferior
    let maximo = 4;
    if (productosFiltrados.length < maximo) {
        maximo = productosFiltrados.length;
    }

    // Bucle for clásico para crear los elementos de forma controlada
    for (let i = 0; i < maximo; i++) {
        let prod = productosFiltrados[i];

        // Creamos la tarjeta del artículo relacionado
        const card = document.createElement("article");
        card.classList.add("related-card");

        // Construimos su esqueleto interno usando template strings simples
        card.innerHTML = `
      <img src="${prod.image}" alt="${prod.title}">
      <h3>${prod.title}</h3>
      <p>${prod.price}€</p>
    `;

        // Navegación al hacer click sobre el producto relacionado
        card.addEventListener("click", function () {
            window.location.href = "detalle.html?id=" + prod.id;
        });

        relatedGrid.appendChild(card);
    }
}


// =========================
// CARRITO
// =========================

function addToCart() {

    if (!currentProduct) return;

    // Creamos o recuperamos el array del carrito de LocalStorage
    let carrito = [];
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
    }

    // Buscamos si este producto ya estaba en el carrito
    let productoEnCarrito = carrito.find(item => item.producto.id === currentProduct.id);

    if (!productoEnCarrito) {
        // Si no está, lo añadimos con cantidad 1
        carrito.push({ producto: currentProduct, cantidad: 1 });
    } else {
        // Si ya existe, sumamos una unidad
        productoEnCarrito.cantidad++;
    }

    // Guardamos el carrito actualizado
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("¡Producto añadido al carrito!");
}


// =========================
// FAVORITOS
// =========================

function addToFavorites() {

    if (!currentProduct) return;

    // recupero la lista de favoritos de LocalStorage
    let favoritos = [];
    if (localStorage.getItem("favoritos")) {
        favoritos = JSON.parse(localStorage.getItem("favoritos"));
    }

    // compruebo si ya es favorito
    let estaFavorito = favoritos.find(item => item.id === currentProduct.id);
    const favButton = document.getElementById("favoriteBtn");

    if (!estaFavorito) {
        // si no está, lo sumamos a la lista
        favoritos.push(currentProduct);
        favButton.textContent = "❤️"; // Cambiamos el icono a relleno
        alert("Añadido a tus favoritos");
    } else {
        // si ya estaba, lo quitamos de la lista
        favoritos = favoritos.filter(item => item.id !== currentProduct.id);
        favButton.textContent = "🤍"; // Cambiamos el icono a vacío
        alert("Eliminado de tus favoritos");
    }

    // guardo los cambios
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}


// =========================
// EVENTOS
// =========================

function initEvents() {

    const addToCartBtn = document.getElementById("addToCartBtn");
    const favoriteBtn = document.getElementById("favoriteBtn");

    // Escuchamos los clicks de los botones
    addToCartBtn.addEventListener("click", addToCart);
    favoriteBtn.addEventListener("click", addToFavorites);

}

// =========================
// INIT
// =========================

function init() {

    getProduct();

    initEvents();

}

init();
