// Public - js - products.js
const socket = io();

// Actualizar la lista de productos
const renderProductos = (productos) => {
    const productosDiv = document.getElementById("productos");
    productosDiv.innerHTML = '';
    productos.forEach(prod => {
        const item = document.createElement("li");
        item.innerText = `${prod.nombre} - $${prod.precio} (ID: ${prod.id})`; // Mostrar ID
        productosDiv.appendChild(item);
    });
};

// Recibir lista inicial de productos
socket.on("productosActuales", (productos) => {
    renderProductos(productos);
});

// Agregar producto
document.getElementById("formAgregar").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreProducto").value;
    const precio = document.getElementById("precioProducto").value;
    const id = Date.now().toString(); // Generar un ID único para el producto

    // Enviar evento a través de Socket.io para agregar producto
    socket.emit("nuevoProducto", { id, nombre, precio });

    // Limpiar campos
    document.getElementById("nombreProducto").value = ''; 
    document.getElementById("precioProducto").value = ''; 
});

// Eliminar producto
document.getElementById("formEliminar").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("idProductoEliminar").value;

    // Enviar evento a través de Socket.io para eliminar producto
    socket.emit("eliminarProducto", id);

    // Limpiar campo
    document.getElementById("idProductoEliminar").value = ''; 
});
