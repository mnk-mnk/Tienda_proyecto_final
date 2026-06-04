// =========================
// SELECTORES
// =========================

const cartContainer =
  document.getElementById(
    "cartContainer"
  );

const cartTotal =
  document.getElementById(
    "cartTotal"
  );

const checkoutBtn =
  document.getElementById(
    "checkoutBtn"
  );

const buyBtn =
  document.getElementById(
    "buyBtn"
  );

const successMessage =
  document.getElementById(
    "successMessage"
  );

const checkoutForm = document.getElementById("checkoutForm");

// =========================
// VARIABLES
// =========================

let cart = [];



// =========================
// FUNCIONES CARRITO
// =========================


/*
OBJETIVO:
Añadir productos al carrito.

TAREAS:
- Buscar producto por ID
- Añadir al array carrito
- Incrementar cantidad si ya existe
- Guardar carrito
- Renderizar carrito
*/

let totalPriceCart = 0;

function updateCart() {
  // Calcular costo
  totalPriceCart = cart.reduce((total, item) => total + (item.cantidad * item.producto.price), 0).toFixed(2);
  //
  cartTotal.textContent = `${totalPriceCart}€`;
}

function addToCart(id) {
  // Buscar producto por ID
  const producto = products.find((p) => p.id === id);

  const productoEnCarrito = cart.find((p) => p.producto.id === id);

  if (!productoEnCarrito) {
    // Añadir al array carrito
    cart.push({ producto: producto, cantidad: 1 });
  } else {
    // Incrementar cantidad si ya existe
    productoEnCarrito.cantidad++;
  }

  //Guardar carrito
  localStorage.setItem("carrito", JSON.stringify(cart));

  //Renderizar carrito
  renderCart();
  updateCart();
}

/*
OBJETIVO:
Eliminar producto del carrito.

*/

function removeFromCart(id) {
  // Filtramos el array 'cart' comparando con el id dentro de 'item.producto'
  cart = cart.filter(item => item.producto.id !== id);

  // Guardamos en LocalStorage para que persista y volvemos a pintar
  localStorage.setItem("carrito", JSON.stringify(cart));
  renderCart();
}

/*
OBJETIVO:
Pintar carrito dinámicamente.

MOSTRAR:
- Nombre
- Cantidad
- Precio
- Total carrito
*/

function renderCart() {
  cartContainer.innerHTML = '';

  if (cart.length < 1) {
    const notProductsText = document.createElement("p");
    notProductsText.textContent = "Agrega un producto a tu lista de compra";
    cartContainer.append(notProductsText)

    //  cartTotal lo ponemos a 0
    if (cartTotal) cartTotal.textContent = "0.00€";
    return;
  }


  cart.map((item) => {
    const producto = item.producto;
    // calculo del subtotal y suma carrito
    const precioSubtotal = producto.price * item.cantidad;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const cardItemInfo = document.createElement("div");
    cardItemInfo.classList.add("cart-item-info");

    const cartItemTitle = document.createElement("p");
    cartItemTitle.classList.add("cart-item-title");
    cartItemTitle.textContent = producto.title;

    // Contenedor para los controles de cantidad (+ / -)
    const quantityControls = document.createElement("div");
    quantityControls.classList.add("quantity-controls");

    const btnDecrement = document.createElement("button");
    btnDecrement.classList.add("btn-qty");
    btnDecrement.textContent = "-";
    btnDecrement.addEventListener("click", () => updateQuantity(producto.id, "decrement"));

    const quantitySpan = document.createElement("span");
    quantitySpan.classList.add("qty-number");
    quantitySpan.textContent = ` ${item.cantidad} `;

    const btnIncrement = document.createElement("button");
    btnIncrement.classList.add("btn-qty");
    btnIncrement.textContent = "+";
    btnIncrement.addEventListener("click", () => updateQuantity(producto.id, "increment"));

    quantityControls.append(btnDecrement, quantitySpan, btnIncrement);

    const cartItemPrice = document.createElement("p");
    cartItemPrice.classList.add("cart-item-price");

    cartItemPrice.textContent = `${item.cantidad} x ${producto.price}€ (${precioSubtotal.toFixed(2)}€)`;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = 'X';

    // Conectamos función de eliminar
    removeBtn.addEventListener("click", () => removeFromCart(producto.id));

    cardItemInfo.append(cartItemTitle, quantityControls, cartItemPrice);
    cartItem.append(cardItemInfo, removeBtn);
    cartContainer.append(cartItem);
  });

  // Actualizar carrito
  updateCart();

  // Creamos la sección final del carrito para el botón "Vaciar Carrito"
  const cartActionsContainer = document.createElement("div");
  cartActionsContainer.classList.add("cart-menu-actions");


  const clearCartBtn = document.createElement("button");
  clearCartBtn.id = "clear-cart-btn";
  clearCartBtn.textContent = "Vaciar Carrito";
  clearCartBtn.addEventListener("click", clearCart);

  cartActionsContainer.append(clearCartBtn);
  cartContainer.append(cartActionsContainer);
}

/*
OBJETIVO:
Incrementar o decrementar la cantidad de un artículo.
*/

function updateQuantity(id, action) {
  const itemEnCarrito = cart.find(item => item.producto.id === id);

  if (!itemEnCarrito) return;

  if (action === "increment") {
    itemEnCarrito.cantidad++;
  } else if (action === "decrement") {
    itemEnCarrito.cantidad--;

    // Si la cantidad baja de 1, eliminamos el artículo por completo
    if (itemEnCarrito.cantidad < 1) {
      removeFromCart(id);
      return; // Salimos de la función para evitar doble renderizado
    }
  }

  // Guardamos el estado y actualizamos la interfaz
  localStorage.setItem("carrito", JSON.stringify(cart));
  renderCart();
}


/*
OBJETIVO:
Vaciar todo el carrito de golpe.
*/

function clearCart() {
  cart = [];
  localStorage.setItem("carrito", JSON.stringify(cart));
  renderCart();
}

/*
OBJETIVO:
Guardar carrito en localStorage.

PISTA:
JSON.stringify()
*/

function saveCart() {
  // Convierte el array 'cart' a texto JSON y lo guarda con la clave 'carrito'
  localStorage.setItem("carrito", JSON.stringify(cart));
}

/*
OBJETIVO:
Recuperar carrito guardado.

PISTA:
JSON.parse()
*/

function loadCart() {

  const carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    // Convierte el texto JSON de vuelta a un array de objetos
    cart = JSON.parse(carritoGuardado);
    // Vuelve a pintar el carrito en la pantalla para que se vean los productos cargados
    renderCart();
  }
}


function checkout(e) {
  e.preventDefault();

  if (cart.length < 1) { alert("No tienes nada en el carrito"); return; }

  window.location.href = "carrito.html";

}

function validateCheckout(e) {
  e.preventDefault();

  // No comprar si no tienes articulo
  if (cart.length < 1) {
    alert("Añade un producto para continuar con la compra");
    return;
  }

  showSuccessMessage();

  // Vacia el carrito despues de comprar
  clearCart();
}

function showSuccessMessage() {
  successMessage.classList.remove("hidden");
}

function formatPrice() {

}

function generateCartItem() {

}

// ========================================================
// AUTORELLENAR DATOS DE ENVÍO CON LA SESIÓN DE MORTICIA (NUEVO)
// ========================================================
function autorellenarDatosEnvioMorticia() {
  // Comprobamos si el cliente inició sesión leyendo el token
  const tokenCliente = sessionStorage.getItem("token");
  const esAdmin = sessionStorage.getItem("isAdmin");

  // Si no está logueado o si es el usuario "admin", dejamos el formulario limpio
  if (!tokenCliente || esAdmin === "true") return;

  // Si es un cliente activo, inyectamos los datos de Morticia en los inputs
  if (document.getElementById("nameInput")) {
    document.getElementById("nameInput").value = "Morticia";
  }
  if (document.getElementById("lastnameInput")) {
    document.getElementById("lastnameInput").value = "Addams";
  }
  if (document.getElementById("addressInput")) {
    document.getElementById("addressInput").value = "Cementerio de Westfield, Calle del Horror 13";
  }
  if (document.getElementById("cityInput")) {
    document.getElementById("cityInput").value = "Westfield, Nueva York";
  }
  if (document.getElementById("postalInput")) {
    document.getElementById("postalInput").value = "10001";
  }
  if (document.getElementById("phoneInput")) {
    document.getElementById("phoneInput").value = "666 666 666";
  }
  if (document.getElementById("emailInput")) {
    document.getElementById("emailInput").value = "mor_2314@gmail.com";
  }
}


// =========================
// EVENTOS
// =========================

checkoutBtn?.addEventListener(
  "click",
  checkout
);

checkoutForm?.addEventListener(
  "submit",
  validateCheckout
);



// =========================
// INIT
// =========================

loadCart();

renderCart();

// Ejecutamos el autorelleno tras cargar el carrito
autorellenarDatosEnvioMorticia();