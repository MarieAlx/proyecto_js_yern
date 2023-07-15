
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let contenedorCarrito = document.querySelector(".carrito");
let contenedor = document.getElementById("misprods");

let boton = document.getElementById("mode");
contenedor = document.getElementById("principal");
boton.onclick =() =>{
	if(localStorage.getItem("mode")=="light"){
		contenedor.classList.replace("light","dark");
		document.body.className="dark";
		localStorage.setItem("mode","dark")
	}else{
		contenedor.classList.replace("dark","light");
		document.body.className="light";
		localStorage.setItem("mode","light")
	}
}
if(localStorage.getItem("mode")=="dark"){
	contenedor.classList.replace("light","dark");
	document.body.className="dark";
}



function renderizarProductos() {
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
} 

const mostrarProductos = (productos) => {
        const contenedorProductos = document.querySelector(".articulos");
        contenedorProductos.innerHTML = "";
        productos.forEach((producto) => {
        const li = document.createElement("li");
        li.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="product-description">${producto.descripcion}</p>
    <p class="product-price">$${producto.precio}</p>
    <button id="agregar-${producto.id}" class="add-to-cart">Agregar al carrito</button>
    `;
        contenedorProductos.appendChild(li);
        const boton = document.getElementById(`agregar-${producto.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        });
    });
};


// FUNCIÓN PARA AGREGAR EL PRODUCTO AL CARRITO

const agregarAlCarrito = (id) => {
    if (!carrito.some((producto) => producto.id === id)) {
        const producto = productos.find((producto) => producto.id === id);
        carrito.push({ ...producto, cantidad: 1 });
        Swal.fire({
            title: '¡Fantástico!',
            text: `Agregaste ${producto.nombre} al carrito ❤️`,
            imageUrl: producto.imagen,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: producto.nombre,
            showConfirmButton: true,
            confirmButtonColor: '#e29f22',
            timer: 2000,
            background: '#f7d7d6',
        });
        
    } else {
		const producto = carrito.find((producto) => producto.id === id);
		producto.cantidad++;
	}
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
};

const mostrarCarrito = () => {
	
	const contenedorCarrito = document.querySelector(".carrito");
	contenedorCarrito.innerHTML = "";
	if (carrito.length > 0) {
		const productsCart = document.createElement("ul");
		productsCart.classList.add("productsCart");
		contenedorCarrito.appendChild(productsCart);
		const contenedorTotal = document.createElement("p");
		actualizarTotal(contenedorTotal);
		contenedorCarrito.appendChild(contenedorTotal);
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
			productsCart.appendChild(li);
			const boton = document.getElementById(`eliminar-${producto.id}`);
			boton.addEventListener("click", () => {
                eliminarProducto(producto.id);
			});

			const decrementar = document.getElementById(`decrementar-${producto.id}`);
			decrementar.addEventListener("click", () => {
				decrementarProducto(producto.id);
			});

			const incrementar = document.getElementById(`incrementar-${producto.id}`);
			incrementar.addEventListener("click", () => {
				incrementarProducto(producto.id);
			});
		});
	} else {
		contenedorCarrito.innerHTML = '<p class="empty">No hay productos</p>';
	}
};

const decrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	if (producto.cantidad === 1) {
		eliminarProducto(producto.id);
	} else {
		producto.cantidad--;
		localStorage.setItem("carrito", JSON.stringify(carrito));
		mostrarCarrito();
	}
};

const incrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	producto.cantidad++;
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
};

const eliminarProducto = (id) => {
	carrito = carrito.filter((producto) => producto.id !== id);
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
};

const actualizarTotal = (contenedor) => {
	const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);
	contenedor.textContent = `Total: $${total}`;
};

//finalizar compra

let finalizarBtn = document.getElementById("finalizar");
finalizarBtn.onclick=()=>{
	if (carrito.length === 0) {
		return; // Si el carrito está vacío, no hace nada
	}
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
    contenedorCarrito.innerHTML = '<p class="empty">No hay productos</p>';
	Swal.fire({
		title: 'Gracias por tu compra',
		color: '#716add',
		showClass: {
			popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		},
		confirmButtonColor: '#e29f22',
		background: '#f7d7d6',
		timer: 2000,
		backdrop: `	rgba(0,0,123,0.4)`
	})

    Toastify({
        text:' ♥ Recibiras tu paquete en las próximas 48 hs ♥',
        duration: 3000,
        gravity:'bottom',
        position:'center',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast(); 
}

fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        const productos = data;
        mostrarProductos(productos);
    })
    .catch(error => {
        console.log('Error al cargar el archivo productos.json:', error);
    });

mostrarProductos(productos);
mostrarCarrito();