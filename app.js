let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let contenedor = document.getElementById("misprods");

/* function renderizarProductos() {
    for (const producto of productos) {
        contenedor.innerHTML += `
            <div class="card col-sm-6 col-md-4 col-lg-3">
                <img src="${producto.imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    
                    <p class="card-text negrita">${producto.nombre}</p>
                    <p class="card-text"> ${producto.descripcion}</p>
                    <p class="card-text negrita">$ ${producto.precio}</p>
                    <button id="btn${producto.id}" class="btn btn-primary">Comprar</button>
                </div>
            </div>
        `;
    }
} */

// Renderizar los elementos del carrito en la tabla
/* for (const producto of carrito) {
	document.getElementById('tablabody').innerHTML += `
		<tr>
			<td>${producto.id}</td>
			<td>${producto.nombre}</td>
			<td>${producto.descripcion}</td>
			<td>$${producto.precio}</td>
		</tr>
	`;
} */
const mostrarProductos = (productos) => {
    // Capturo el contenedor donde voy a renderizar los productos
    const contenedorProductos = document.querySelector(".articulos");
    // Limpio el contenedor por si había algo anteriormente
    contenedorProductos.innerHTML = "";
    // Recorro el array y por cada uno creo una card para mostrar en pantalla
    productos.forEach((producto) => {
        const li = document.createElement("li");
        li.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="product-description">${producto.descripcion}</p>
    <p class="product-price">$${producto.precio}</p>
    <button id="agregar-${producto.id}" class="add-to-cart">Agregar al carrito</button>
    `;
        // Agrego la card al contenedor
        contenedorProductos.appendChild(li);
        // Ahora la card está en el DOM. El botón ya existe, por lo tanto lo capturo
        const boton = document.getElementById(`agregar-${producto.id}`);
        // Agrego evento al botón capturado.
        boton.addEventListener("click", () => {
            // Si hacemos clic en el botón, se agrega al carrito
            agregarAlCarrito(producto.id);
        });
    });
};


// FUNCIÓN PARA AGREGAR EL PRODUCTO AL CARRITO

const agregarAlCarrito = (id) => {
    // Si el producto no está en el carrito, lo agregamos
    if (!carrito.some((producto) => producto.id === id)) {
        // Buscamos el producto en el array de productos
        const producto = productos.find((producto) => producto.id === id);
        carrito.push({ ...producto, cantidad: 1 });
        Swal.fire({
            /* icon: 'success', */
            title: '¡Fantástico!',
            text: `Agregaste ${producto.nombre} al carrito ❤️`,
            imageUrl: producto.imagen,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: producto.nombre,
            showConfirmButton: false,
            timer: 2000,
            background: '#f7d7d6',
            
        });
        
    } else {
        // Si el producto está en el carrito, lo buscamos y le incrementamos las unidades
		const producto = carrito.find((producto) => producto.id === id);
		producto.cantidad++;
	}
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const mostrarCarrito = () => {
	// Capturo el contenedor donde voy a renderizar los productos
	const contenedorCarrito = document.querySelector(".carrito");
	// Limpio el contenedor por si había algo anteriormente
	contenedorCarrito.innerHTML = "";
	// Sólo agregaremos un contenedor con productos si el carrito no está vacío
	if (carrito.length > 0) {
		// Creo el contenedor donde colocaré los productos y lo agrego al DOM
		const productsCart = document.createElement("ul");
		productsCart.classList.add("productsCart");
		contenedorCarrito.appendChild(productsCart);
		// Creo el contenedor donde colocaré el total, lo calculo y lo agrego al DOM
		const contenedorTotal = document.createElement("p");
		actualizarTotal(contenedorTotal);
		contenedorCarrito.appendChild(contenedorTotal);
		// Recorro el array y por cada uno creo una card para mostrar en pantalla
		carrito.forEach((producto) => {
			const li = document.createElement("li");
			li.innerHTML = `
			<img src="${producto.imagen}" alt="${producto.nombre}" />
			<div class="productContent">
				<h3>${producto.nombre}</h3>
				<p class="product-description">${producto.descripcion}</p>
				<p class="product-price">$${producto.precio}</p>
				<div class="counter">
				<button id="decrementar-${producto.id}" class="button">-</button>
				<span class="product-price">${producto.cantidad}u.</span>
				<button id="incrementar-${producto.id}" class="button">+</button>
				</div>
			</div>
			<button id="eliminar-${producto.id}" class="remove">Eliminar</button>
		`;
			// Agrego la card al contenedor
			productsCart.appendChild(li);
			// Ahora la card está en el DOM. El botón ya existe, por lo tanto lo capturo
			const boton = document.getElementById(`eliminar-${producto.id}`);
			// Agrego evento al botón capturado.
			boton.addEventListener("click", () => {
				// Si hacemos clic en el botón, se elimina del carrito
				eliminarProducto(producto.id);
			});

			// Agrego evento al botón decrementar.
			const decrementar = document.getElementById(`decrementar-${producto.id}`);
			decrementar.addEventListener("click", () => {
				decrementarProducto(producto.id);
			});

			// Agrego evento al botón incrementar.
			const incrementar = document.getElementById(`incrementar-${producto.id}`);
			incrementar.addEventListener("click", () => {
				incrementarProducto(producto.id);
			});
		});
	} else {
		// Si el carrito está vacío, muestro un texto
		contenedorCarrito.innerHTML = '<p class="empty">No hay productos</p>';
	}
};

const decrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	// Si es 1, hay que eliminarlo porque no podemos tener cantidad cero
	if (producto.cantidad === 1) {
		eliminarProducto(producto.id);
	} else {
		producto.cantidad--;
		// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
		localStorage.setItem("carrito", JSON.stringify(carrito));
		// Actualizamos la vista del carrito porque hemos hecho cambios
		mostrarCarrito();
	}
};

const incrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	producto.cantidad++;
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const eliminarProducto = (id) => {
	// Genero un nuevo carrito con todos los productos menos el que hemos seleccionado
	carrito = carrito.filter((producto) => producto.id !== id);
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const actualizarTotal = (contenedor) => {
	const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);
	contenedor.textContent = `Total: $${total}`;
};

//finalizar compra

let finalizarBtn = document.getElementById('finalizar');

finalizarBtn.onclick=()=>{
    Toastify({
        text:'Gracias por tu compra, recibiras tu paquete en las prox 48 hs',
        duration: 2000,
        gravity:'bottom',
        position:'left',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
    

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let contenedor = document.getElementById("misprods");

/* function renderizarProductos() {
    for (const producto of productos) {
        contenedor.innerHTML += `
            <div class="card col-sm-6 col-md-4 col-lg-3">
                <img src="${producto.imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    
                    <p class="card-text negrita">${producto.nombre}</p>
                    <p class="card-text"> ${producto.descripcion}</p>
                    <p class="card-text negrita">$ ${producto.precio}</p>
                    <button id="btn${producto.id}" class="btn btn-primary">Comprar</button>
                </div>
            </div>
        `;
    }
} */

// Renderizar los elementos del carrito en la tabla
/* for (const producto of carrito) {
	document.getElementById('tablabody').innerHTML += `
		<tr>
			<td>${producto.id}</td>
			<td>${producto.nombre}</td>
			<td>${producto.descripcion}</td>
			<td>$${producto.precio}</td>
		</tr>
	`;
} */
const mostrarProductos = (productos) => {
    // Capturo el contenedor donde voy a renderizar los productos
    const contenedorProductos = document.querySelector(".articulos");
    // Limpio el contenedor por si había algo anteriormente
    contenedorProductos.innerHTML = "";
    // Recorro el array y por cada uno creo una card para mostrar en pantalla
    productos.forEach((producto) => {
        const li = document.createElement("li");
        li.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="product-description">${producto.descripcion}</p>
    <p class="product-price">$${producto.precio}</p>
    <button id="agregar-${producto.id}" class="add-to-cart">Agregar al carrito</button>
    `;
        // Agrego la card al contenedor
        contenedorProductos.appendChild(li);
        // Ahora la card está en el DOM. El botón ya existe, por lo tanto lo capturo
        const boton = document.getElementById(`agregar-${producto.id}`);
        // Agrego evento al botón capturado.
        boton.addEventListener("click", () => {
            // Si hacemos clic en el botón, se agrega al carrito
            agregarAlCarrito(producto.id);
        });
    });
};


// FUNCIÓN PARA AGREGAR EL PRODUCTO AL CARRITO

const agregarAlCarrito = (id) => {
    // Si el producto no está en el carrito, lo agregamos
    if (!carrito.some((producto) => producto.id === id)) {
        // Buscamos el producto en el array de productos
        const producto = productos.find((producto) => producto.id === id);
        carrito.push({ ...producto, cantidad: 1 });
        Swal.fire({
            /* icon: 'success', */
            title: '¡Fantástico!',
            text: `Agregaste ${producto.nombre} al carrito ❤️`,
            imageUrl: producto.imagen,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: producto.nombre,
            showConfirmButton: false,
            timer: 2000,
            background: '#f7d7d6',
            
        });
        
    } else {
        // Si el producto está en el carrito, lo buscamos y le incrementamos las unidades
		const producto = carrito.find((producto) => producto.id === id);
		producto.cantidad++;
	}
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const mostrarCarrito = () => {
	// Capturo el contenedor donde voy a renderizar los productos
	const contenedorCarrito = document.querySelector(".carrito");
	// Limpio el contenedor por si había algo anteriormente
	contenedorCarrito.innerHTML = "";
	// Sólo agregaremos un contenedor con productos si el carrito no está vacío
	if (carrito.length > 0) {
		// Creo el contenedor donde colocaré los productos y lo agrego al DOM
		const productsCart = document.createElement("ul");
		productsCart.classList.add("productsCart");
		contenedorCarrito.appendChild(productsCart);
		// Creo el contenedor donde colocaré el total, lo calculo y lo agrego al DOM
		const contenedorTotal = document.createElement("p");
		actualizarTotal(contenedorTotal);
		contenedorCarrito.appendChild(contenedorTotal);
		// Recorro el array y por cada uno creo una card para mostrar en pantalla
		carrito.forEach((producto) => {
			const li = document.createElement("li");
			li.innerHTML = `
			<img src="${producto.imagen}" alt="${producto.nombre}" />
			<div class="productContent">
				<h3>${producto.nombre}</h3>
				<p class="product-description">${producto.descripcion}</p>
				<p class="product-price">$${producto.precio}</p>
				<div class="counter">
				<button id="decrementar-${producto.id}" class="button">-</button>
				<span class="product-price">${producto.cantidad}u.</span>
				<button id="incrementar-${producto.id}" class="button">+</button>
				</div>
			</div>
			<button id="eliminar-${producto.id}" class="remove">Eliminar</button>
		`;
			// Agrego la card al contenedor
			productsCart.appendChild(li);
			// Ahora la card está en el DOM. El botón ya existe, por lo tanto lo capturo
			const boton = document.getElementById(`eliminar-${producto.id}`);
			// Agrego evento al botón capturado.
			boton.addEventListener("click", () => {
				// Si hacemos clic en el botón, se elimina del carrito
				eliminarProducto(producto.id);
			});

			// Agrego evento al botón decrementar.
			const decrementar = document.getElementById(`decrementar-${producto.id}`);
			decrementar.addEventListener("click", () => {
				decrementarProducto(producto.id);
			});

			// Agrego evento al botón incrementar.
			const incrementar = document.getElementById(`incrementar-${producto.id}`);
			incrementar.addEventListener("click", () => {
				incrementarProducto(producto.id);
			});
		});
	} else {
		// Si el carrito está vacío, muestro un texto
		contenedorCarrito.innerHTML = '<p class="empty">No hay productos</p>';
	}
};

const decrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	// Si es 1, hay que eliminarlo porque no podemos tener cantidad cero
	if (producto.cantidad === 1) {
		eliminarProducto(producto.id);
	} else {
		producto.cantidad--;
		// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
		localStorage.setItem("carrito", JSON.stringify(carrito));
		// Actualizamos la vista del carrito porque hemos hecho cambios
		mostrarCarrito();
	}
};

const incrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	producto.cantidad++;
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const eliminarProducto = (id) => {
	// Genero un nuevo carrito con todos los productos menos el que hemos seleccionado
	carrito = carrito.filter((producto) => producto.id !== id);
	// Guardamos el carrito en el localStorage para tenerlo actualizado si recargamos la página porque hicimos cambios
	localStorage.setItem("carrito", JSON.stringify(carrito));
	// Actualizamos la vista del carrito porque hemos hecho cambios
	mostrarCarrito();
};

const actualizarTotal = (contenedor) => {
	const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);
	contenedor.textContent = `Total: $${total}`;
};

//finalizar compra

let finalizarBtn = document.getElementById('finalizar');

finalizarBtn.onclick=()=>{
    Toastify({
        text:'Gracias por tu compra, recibiras tu paquete en las prox 48 hs',
        duration: 2000,
        gravity:'bottom',
        position:'left',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    carrito = [];
    mostrarCarrito();

    localStorage.removeItem("carrito");

    const contenedorTotal = document.querySelector(".carrito p");
    contenedorTotal.textContent = "Total: $";
    


}
    /* 

/* --------------------------------- LÓGICA --------------------------------- */

mostrarProductos(productos);
mostrarCarrito();
}
    /* 

/* --------------------------------- LÓGICA --------------------------------- */

mostrarProductos(productos);
mostrarCarrito();