const container = document.getElementById("productos");
const tbody = document.querySelector(".tbody");
const comprar = document.getElementById("comprar");

let carrito = [];

fetch("./productos.json").then((response) => {
  response.json().then((data) => renderCards(data));
});

function renderCards(data) {
  data.forEach((item) => {
    // console.log(item);
    const card = `<div class="col d-flex justify-content-center mb-4">
                            <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
                            <img src=${item.image} class="card-img-top h-50" alt=${item.title}>
                            <div class="card-body text-white-50">
                                <h5 class="card-title pt-2 text-center ">${item.title}</h5>
                                <p class="card-text">${item.description}</p>
                                <h5 class="text-primary">Precio: $ <span class="precio">${item.price}</span></h5>
                                <div class="d-grid gap-2">
                                <button class="btn btn-primary botonAdd">Añadir al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    container.innerHTML += card;
    return card;
  });

  const botonAdd = document.querySelectorAll(".botonAdd");
  botonAdd.forEach((btn) => {
    btn.addEventListener("click", addToCarritoItem);
  });
}
function addToCarritoItem(e) {
  const button = e.target;
  const item = button.closest(".card");
  const itemTitle = item.querySelector(".card-title").textContent;
  const itemPrice = item.querySelector(".precio").textContent;
  const itemImg = item.querySelector(".card-img-top").src;

  const newItem = {
    title: itemTitle,
    price: itemPrice,
    image: itemImg,
    cantidad: 1,
  };

  addItemCarrito(newItem);
}

function addItemCarrito(newItem) {
  Toastify({
    text: "Producto Agregado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "left",
  }).showToast();

  const inputElemnto = tbody.getElementsByClassName("input__elemento");
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newItem.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = inputElemnto[i];
      inputValue.value++;
      CarritoTotal();
      addLocalStorage();
      return null;
    }
  }

  carrito.push(newItem);

  renderCarrito();
}

function renderCarrito() {
  tbody.innerHTML = "";
  carrito.map((item) => {
    const tr = document.createElement("tr");
    tr.classList.add("itemCarrito");
    const Content = `<th scope="row" id=${item.id}>1</th>
                    <td class="table__productos">
                            <img class="table__img" src=${item.image}  alt="">
                            <h6 class="title">${item.title}</h6>
                        </td>
                        <td class="table__price"><p>${item.price}</p></td>
                        <td class="table__cantidad">
                            <input type="number" min="1" value=${item.cantidad} class="input__elemento">
                            <button class="delete btn btn-danger" id=${item.id}>x</button>
                        </td>
    `;
    tr.innerHTML = Content;
    tbody.append(tr);

    tr.querySelector(".delete").addEventListener("click", removeItemCarrito);
    tr.querySelector(".input__elemento").addEventListener(
      "change",
      sumaCantidad
    );
  });
  CarritoTotal();
}

function CarritoTotal() {
  let total = 0;
  const itemCartTotal = document.querySelector(".total");
  carrito.forEach((item) => {
    const precio = Number(item.price);
    total = total + precio * item.cantidad;
  });

  itemCartTotal.innerHTML = `${total}`;
  addLocalStorage();
}

function removeItemCarrito(e) {
  e.preventDefault();
  const tr = e.target.parentNode.parentNode;
  const title = document.querySelector(".title").textContent;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === title.trim()) {
      carrito.splice(i, 1);
    }
  }
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    close: false,
    gravity: "top",
    position: "left",
  }).showToast();
  tr.remove();
  CarritoTotal();
}

function sumaCantidad(e) {
  const sumaInput = e.target;
  tr = e.target.parentNode.parentNode;
  const title = document.querySelector(".title").textContent;
  carrito.forEach((item) => {
    if (item.title.trim() === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = parseInt(sumaInput.value);
    }
    CarritoTotal();
    addLocalStorage();
  });
}

function addLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

const inicio = (window.onload = function () {
  const storage = JSON.parse(localStorage.getItem("carrito"));
  if (storage) {
    carrito = storage;
    renderCarrito();
  }
});

comprar.addEventListener("click", (e) => {
  carrito = [];
  addLocalStorage();
  renderCarrito();
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Compra realizada con éxito!",
    showConfirmButton: false,
    timer: 1500,
  });
});
