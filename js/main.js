/*
========================================
MINI ECOMMERCE - BOILERPLATE
========================================

TECNOLOGÍAS:
- JavaScript
- Fetch API
- LocalStorage
- SessionStorage

FASES:
1. Productos
2. Filtros
3. Carrito
4. EXTRA Persistencia
5. EXTRA Login
6. EXTRA Sesión
7. EXTRA Favoritos

========================================
*/


// ========================================
// SELECTORES DEL DOM
// ========================================

// Contenedor productos
const productsContainer =
  document.getElementById("productsContainer");

// Buscador
const searchInput =
  document.getElementById("searchInput");

// Filtro categorías
const categoryFilter =
  document.getElementById("categoryFilter");

// Ordenación
const sortSelect =
  document.getElementById("sortSelect");




// ========================================
// VARIABLES GLOBALES
// ========================================

// Productos API
let products = [];

// Productos filtrados
let filteredProducts = [];

// Favoritos
let favorites = [];


// ========================================
// FASE 1 - FETCH PRODUCTOS
// ========================================

/*
OBJETIVO:
Obtener productos desde la API.

ENDPOINT:
https://fakestoreapi.com/products

CONCEPTOS:
- fetch()
- promesas
- .then()
- .catch()

TAREAS:
- Hacer petición fetch
- Convertir respuesta a JSON
- Guardar productos
- Pintar productos
- Pintar categorías
*/


/*
========================================
¿QUÉ DEVUELVE LA API?
========================================

La API devuelve un ARRAY de productos.

Ejemplo:

[
  {
    id: 1,
    title: "Fjallraven Backpack",
    price: 109.95,
    description: "Your perfect pack...",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/..."
  }
]

========================================
¿CÓMO ACCEDER A LOS DATOS?
========================================

product.title
product.price
product.category
product.image

========================================
EJEMPLO RECORRIENDO PRODUCTOS
========================================

products.forEach(product => {

  console.log(product.title);

});

*/

const url = "https://fakestoreapi.com/products";

function getProducts() {
  fetch(url).
    then((response) => response.json()).
    then((data) => {
      products = data;

      renderProducts(products);
      renderCategories(products);
    });
}


// ========================================
// FASE 1 - RENDER PRODUCTOS
// ========================================

/*
OBJETIVO:
Pintar productos dinámicamente.

MOSTRAR:
- Imagen
- Título
- Precio
- Categoría
- Botón carrito
- Botón favorito

PISTA:
Usar:
- innerHTML
- createElement
- appendChild
*/


/*
========================================
PISTA RENDERIZADO
========================================

Ejemplo creando una card:

const card = document.createElement("article");

card.innerHTML = `
  <h2>${product.title}</h2>
`;

productsContainer.appendChild(card);

========================================
*/


function renderProducts(productsArray) {

  productsContainer.innerHTML = ""; //vaciar la pantalla antes de filtrar

  productsArray.forEach(producto => {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");
    productCard.id = `product-${producto.id}`;

    const productImageContainer = document.createElement("div");
    productImageContainer.classList.add("product-image");

    const productImage = document.createElement("img");
    productImage.src = producto.image;
    productImage.alt = `Producto ${producto.title}`;

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const productCategory = document.createElement("product-category");
    productCategory.classList.add("product-category");
    productCategory.textContent = producto.category;

    const productTitle = document.createElement("h3");
    productTitle.classList.add("product-title");
    productTitle.textContent = producto.title;

    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = `${producto.price}€`;

    const cardActions = document.createElement("div");
    cardActions.classList.add("card-actions");

    const addBtn = document.createElement("button");
    addBtn.classList.add("add-btn");
    addBtn.textContent = "Añadir";

    addBtn.addEventListener('click', () => addToCart(producto.id));

    const favBtn = document.createElement("button");
    favBtn.textContent = '🤍';
    favBtn.classList.add("fav-btn");

    favBtn.addEventListener('click', () => toggleFavorite(producto.id));


    productImageContainer.append(productImage);
    productCard.append(productImageContainer);

    cardActions.append(addBtn, favBtn);
    productInfo.append(productCategory, productTitle, productPrice, cardActions);
    productCard.append(productInfo);
    productsContainer.append(productCard);
  });
}




// ========================================
// FASE 2 - CATEGORÍAS
// ========================================

/*
OBJETIVO:
Generar categorías dinámicamente.

TAREAS:
- Obtener categorías únicas
- Crear options
- Añadir al select

PISTA:
new Set()
*/

function renderCategories(productsArray) {
  // categorías únicas
  const todasLasCategorias = productsArray.map(producto => producto.category);
  const categoriasUnicas = [...new Set(todasLasCategorias)];

  categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';

  // opciones y Añadir al select

  categoriasUnicas.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    categoryFilter.appendChild(option);
  });

}


// ========================================
// FASE 2 - FILTROS
// ========================================

/*
OBJETIVO:
Filtrar productos dinámicamente.

REQUISITOS:
- Buscar por nombre
- Filtrar por categoría
- Ordenar:
  - precio ascendente
  - precio descendente
  - A-Z
  - Z-A

PISTA:
- filter()
- sort()
- localeCompare()
*/

function filterProducts() {

  const textoBusqueda = document.getElementById("searchInput").value.toLowerCase();
  const categoriaSeleccionada = document.getElementById("categoryFilter").value;
  const ordenSeleccionado = document.getElementById("sortSelect").value;


  // Buscar por nombre y filtrar por categoría
  filteredProducts = products.filter(producto => {
    const coincideNombre = producto.title.toLowerCase().includes(textoBusqueda);

    const coincideCategoria = (categoriaSeleccionada === "all") || (producto.category === categoriaSeleccionada);

    return coincideNombre && coincideCategoria;
  });

  // Ordenar

  if (ordenSeleccionado === "priceAsc") filteredProducts.sort((a, b) => a.price - b.price);
  if (ordenSeleccionado === "priceDesc") filteredProducts.sort((a, b) => b.price - a.price);
  if (ordenSeleccionado === "az") filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  if (ordenSeleccionado === "za") filteredProducts.sort((a, b) => b.title.localeCompare(a.title));

  // Volvemos a pintar los productos filtrados en el contenedor
  renderProducts(filteredProducts);
}


// ========================================
// EVENTOS FILTROS
// ========================================

searchInput.addEventListener(
  "input",
  filterProducts
);

categoryFilter.addEventListener(
  "change",
  filterProducts
);

sortSelect.addEventListener(
  "change",
  filterProducts
);

/*
========================================
EXTRA
========================================
*/



// ========================================
// FASE 7 - FAVORITOS
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Guardar productos favoritos.

TAREAS:
- Añadir favoritos
- Eliminar favoritos
- Guardar en localStorage
- Recuperar favoritos
*/

function toggleFavorite(id) {
  console.log(id);
  const producto = products.find((producto) => producto.id === id);

  const estaFavorito = favorites.find((f) => f.id === id)

  if (!estaFavorito) {
    favorites.push(producto);
  } else {
    favorites = favorites.filter((favorito) => favorito.id !== id);
  }

  localStorage.setItem('favoritos', JSON.stringify(favorites));
  pintarFavoritos();
}

function loadFavorites() {
  if (localStorage.getItem('favoritos')) {
    favorites = JSON.parse(localStorage.getItem('favoritos'));
  }

  pintarFavoritos();

}

// EXTRA: PINTAR FAVORITOS

function pintarFavoritos() {
  let favoritesIds = favorites.map((f) => f.id);

  Array.from(productsContainer.children).forEach((card) => {
    const idCard = parseInt(card.id.split("-", 10)[1]);
    const favButton = card.querySelector(".fav-btn");

    let estaFavorito = favoritesIds.find((id) => id === idCard);

    if (estaFavorito) {
      favButton.classList.add("haveFavorite");
    } else {
      favButton.classList.remove("haveFavorite");
    }

  });
}

// ========================================
// FASE 6 - SESIÓN
// ========================================

/*
========================================
EXTRA
========================================
*/

// SE ENCUENTRA EN LOGIN.JS

function finalizarCompra(e){
  e.preventDefault();

  window.location.replace("/carrito.html")
}

// ========================================
// INIT APP
// ========================================

/*
OBJETIVO:
Inicializar la aplicación.

TAREAS:
- Obtener productos
- Cargar carrito
- Cargar favoritos
- Comprobar sesión
*/

function init() {
  // Obtener productos
  getProducts();
  // Cargar carrito & Renderizado
  loadCart();
  renderCart();
  // Cargar favoritos
  setTimeout(() => loadFavorites(), 100);
  // Comprobar sesión
  checkSession();
}


// Iniciar aplicación
init();