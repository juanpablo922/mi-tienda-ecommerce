const productos = [
  { id: 1, nombre: "COMPUTADORES DE MESA", precio: 3000.00 },
  { id: 2, nombre: "PORTATILES", precio: 500.00 },
  { id: 3, nombre: "AUDIFONOS", precio: 80.00 },
  { id: 4, nombre: "TECLADOS", precio: 30.00 },
  { id: 5, nombre: "CPU", precio: 600.00 },
];

const carrito = [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const paypalContainer = document.getElementById("paypal-button-container");

function mostrarProductos() {
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
    listaCarrito.appendChild(li);
    total += item.precio;
  });
  totalCarrito.textContent = total.toFixed(2);
  paypalContainer.innerHTML = ""; // Limpia el botón de PayPal si se actualiza
}

function vaciarCarrito() {
  carrito.length = 0;
  actualizarCarrito();
  paypalContainer.innerHTML = ""; // Quitar botón de PayPal al vaciar
}

function mostrarBotonPaypal() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de pagar.");
    return;
  }

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: total.toFixed(2)
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Pago completado por ' + details.payer.name.given_name);
        vaciarCarrito();
      });
    }
  }).render('#paypal-button-container');
}

window.onload = mostrarProductos;
