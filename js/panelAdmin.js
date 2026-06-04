// Contenedor de la tabla
var tablaCuerpo = document.getElementById("adminProductsBody");

// Cargar la lista al abrir la pantalla
obtenerProductosAdmin();

function obtenerProductosAdmin() {
    fetch("https://fakestoreapi.com/products")
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (productos) {
            tablaCuerpo.innerHTML = ""; // Limpiamos

            // Recorremos los productos de la tienda con un bucle for clásico
            for (var i = 0; i < productos.length; i++) {
                var prod = productos[i];

                // Creamos una fila de tabla <tr>
                var fila = document.createElement("tr");

                // Metemos las celdas calcando las columnas del diseño
                fila.innerHTML = `
                    <td><img src="${prod.image}" class="product-img"></td>
                    <td>${prod.title}</td>
                    <td><strong>${prod.price}€</strong></td>
                    <td>${prod.category}</td>
                    <td class="celda-acciones">
                        <button class="btn-editar">Editar</button>
                        <button class="btn-eliminar">Eliminar</button>
                    </td>
                `;

                // Metemos la fila dentro de la tabla
                tablaCuerpo.appendChild(fila);
            }
        })
        .catch(function (error) {
            console.log("Error al cargar el panel de admin:", error);
        });
}
