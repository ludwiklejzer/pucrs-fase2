let items = document.querySelectorAll(".carousel .carousel-item");

items.forEach((el) => {
  const minPerSlide = 3;
  let next = el.nextElementSibling;
  for (var i = 1; i < minPerSlide; i++) {
    if (!next) {
      next = items[0];
    }
    let cloneChild = next.cloneNode(true);
    el.appendChild(cloneChild.children[0]);
    next = next.nextElementSibling;
  }
});

const shippingMethods = document.querySelectorAll("input[name=shippingMethod]");
shippingMethods.forEach((element) => {
  element.addEventListener("change", () => toggleShippingMethod(element));
});

function toggleShippingMethod(element) {
  if (element.value === "tele-entrega") {
    document.querySelector("#endereco").style.display = "block";
    document.querySelector("#retirada").style.display = "none";
  } else {
    document.querySelector("#retirada").style.display = "flex";
    document.querySelector("#endereco").style.display = "none";
  }
}

const cartProducts = new Map(
  JSON.parse(localStorage.getItem("cartProducts")) || [],
);
console.log(cartProducts);

document.querySelectorAll(".add-cart").forEach((button) => {
  button.addEventListener("click", () => addToCart(button));
});

function addToCart(button) {
  const { title, price } = getProductData(button);

  cartProducts.set(title, {
    price,
    quantity: cartProducts.has(title)
      ? cartProducts.get(title).quantity + 1
      : 1,
  });

  saveCart();
}

function getProductData(button) {
  const parent = button.parentElement;
  const price = parseFloat(
    parent.querySelector(".card-price").innerText.slice(2).replace(",", "."),
  );
  const title = parent.querySelector(".card-title").innerText.trim();
  return { price, title };
}

function saveCart() {
  localStorage.setItem(
    "cartProducts",
    JSON.stringify([...cartProducts.entries()]),
  );
  updateCounterNavCart();
  refreshCartProdList();
}

function calculateTotal() {
  let total = 0;
  for (const [, product] of cartProducts) {
    total += product.price * product.quantity;
  }
  return total;
}

function refreshCartProdList() {
  const cartProdList = document.querySelector("#cart-prod-list");
  cartProdList.innerHTML = "";

  for (const [title, product] of cartProducts) {
    const item = document.createElement("li");
    item.className = "list-group-item justify-content-between lh-condensed";
    item.innerHTML = `
      <div class="row">
        <h6 class="col-8 ms-auto">${title}</h6>
				<span class="col-4 text-end text-muted">R$${(product.price * product.quantity).toFixed(2)}</span>

        <div class="col-12 text-muted">
					<div class="btn-group" role="group">
						<button class="btn btn-sm btn-secondary decrement">-</button>
						<button class="btn btn-sm btn-outline-secondary">${product.quantity}</button>
						<button class="btn btn-sm btn-secondary increment">+</button>
					</div>
        </div>

      </div>
    `;

    cartProdList.appendChild(item);

    item
      .querySelector(".increment")
      .addEventListener("click", () => incrementProdCart(title));
    item
      .querySelector(".decrement")
      .addEventListener("click", () => decrementProdCart(title));
  }

  const totalBtn = document.createElement("li");
  totalBtn.className = "list-group-item d-flex justify-content-between";
  totalBtn.innerHTML = `
    <span>Total</span>
    <strong>R$${calculateTotal().toFixed(2)}</strong>
  `;

  cartProdList.appendChild(totalBtn);
}

function incrementProdCart(title) {
  if (cartProducts.has(title)) {
    const product = cartProducts.get(title);
    product.quantity += 1;
    cartProducts.set(title, product);
    saveCart();
  }
}

function decrementProdCart(title) {
  if (cartProducts.has(title)) {
    const product = cartProducts.get(title);
    if (product.quantity > 1) {
      product.quantity -= 1;
      cartProducts.set(title, product);
    } else {
      cartProducts.delete(title);
    }
    saveCart();
  }
}

function updateCounterNavCart() {
  const counter = document.querySelector("#cart-counter");
  counter.innerHTML = Array.from(cartProducts.values()).reduce(
    (sum, product) => sum + product.quantity,
    0,
  );
}

updateCounterNavCart();
refreshCartProdList();
