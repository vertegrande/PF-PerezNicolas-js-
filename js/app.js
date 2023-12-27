let carrito = [];
let productos = [];

async function cargarProductos() {
  try {
    const response = await fetch('../JSON/productos.json');
    if (!response.ok) {
      throw new Error('Error al cargar los productos, comunícate con tu administrador');
    }
    productos = await response.json();
    mostrarProductos(productos);
    sumarValoresProductos();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

function agregarAlCarrito(nombre, valor) {
  const productoEnCarrito = carrito.find(producto => producto.nombre === nombre);

  if (productoEnCarrito) {
    // Si el producto ya está en el carrito, incrementa la cantidad
    productoEnCarrito.cantidad++;
  } else {
    // Si el producto no está en el carrito, agrégalo con cantidad 1
    carrito.push({ nombre, valor, cantidad: 1 });
  }
  actualizarListaCarrito();
  mostrarModal();
  guardarCarritoEnLocalStorage();
  actualizarTotales();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarListaCarrito();
  guardarCarritoEnLocalStorage();
  actualizarTotales(); // Actualizar totales al eliminar un producto del carrito
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');

  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  } else {
    carrito = [];
  }

  actualizarListaCarrito();
  actualizarTotales();
}

cargarCarritoDesdeLocalStorage();

function mostrarModal() {
  const modalElement = document.getElementById('carritoModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

function actualizarListaCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  listaCarrito.innerHTML = '';

  carrito.forEach(({ nombre, valor, cantidad }, index) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    item.innerHTML = `
       <span class="d-flex justify-content-between align-items-start">
         (Producto) ${nombre} <br>
         (Precio Unitario) $ ${valor} <br> 
         (Cantidad:)    ${cantidad}
         <span class="badge bg-danger rounded-pill p-2">
           <span class="text-end mr-0 fas fa-trash-alt" style="cursor: pointer;" onclick="eliminarDelCarrito(${index})"></span>
         </span>
       </span>`;
    listaCarrito.appendChild(item);
  });
}

function actualizarTotales() {
  const valorTotalCarrito = carrito.reduce((total, { valor, cantidad }) => total + valor * cantidad, 0);
  const cantidadProductosEnCarrito = carrito.reduce((total, { cantidad }) => total + cantidad, 0);

  const valorTotalCarritoElement = document.getElementById('valorTotalCarrito');
  valorTotalCarritoElement.textContent = `$${valorTotalCarrito.toFixed(2)}`;

  const cantidadProductosEnCarritoElement = document.getElementById('cantidadProductosEnCarrito');
  cantidadProductosEnCarritoElement.textContent = cantidadProductosEnCarrito;

  const totalPagar = valorTotalCarrito; // Total a pagar ahora es simplemente el valor total del carrito

  const totalPagarElement = document.getElementById('totalPagar');
  totalPagarElement.textContent = `$${totalPagar.toFixed(2)}`;
}

function mostrarProductos(productosFiltrados) {
  const contenedor = document.getElementById("contenedorProductos");
  contenedor.innerHTML = "";

  const elementosProductos = productosFiltrados.map(({ nombre, descripcion, img, valor }) => {
    const divProducto = document.createElement("div");
    divProducto.classList.add("col-lg-3");
    divProducto.innerHTML = `
    <div class="card-body p-2">  
    <img src="${img}" class="card-img-top" alt="Imagen de ${nombre}">
    <h5 class="card-title">${nombre}
    </h5>
    <div class="precios_producto">
    <div class="precio_nuevo">$ ${valor}</div>
    <div class="precio_descripcion">${descripcion}
  </div>
      </div>

 <div class="d-grid gap-2">
 <button class="btn btn-dark p-3" onclick="agregarAlCarrito('${nombre}', ${valor})"><i class="fa-solid fa-cart-shopping"></i> Agregar a carrito</button>
</div>
 </div> 
    `;
    return divProducto;
  });

  contenedor.append(...elementosProductos);
}

function filtrarProductos() {
  const textoBusqueda = document.getElementById("buscadorProducto").value.toLowerCase();
  const productosFiltrados = productos.filter(({ nombre }) =>
    nombre.toLowerCase().includes(textoBusqueda)
  );
  mostrarProductos(productosFiltrados);
}

document.getElementById("buscadorProducto").addEventListener("input", filtrarProductos);

cargarCarritoDesdeLocalStorage();
cargarProductos();

function mostrarCarrito() {
  actualizarListaCarrito();
  mostrarModal();
}
