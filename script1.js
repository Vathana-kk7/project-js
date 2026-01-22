// script1.js
// import { products } from "./pro.js";
import { products } from "./pro.js";
const productsGrid = document.getElementById("productsGrid");
let carts = JSON.parse(localStorage.getItem("carts")) || [];

const showproducts = (productData) => {
  let cards = "";
  productData.forEach((value) => {
    cards += `
            <div class="product-card">
                    <div class="product-image">
                        <img src="${value.image}" alt="${value.name}" style="object-fit:contain">
                        <div class="product-badge sale">Sale</div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${value.name}</h3>
                        <p class="product-description">${value.description}</p>
                        <div class="product-rating">
                            <div class="stars">
                                <span class="star filled">★</span>
                                <span class="star filled">★</span>
                                <span class="star filled">★</span>
                                <span class="star filled">★</span>
                                <span class="star">★</span>
                            </div>
                            <span>${value.rate}</span>
                        </div>
                        <div class="product-price">
                            <span class="current">$${value.price}</span>
                            <span class="original">$${value.price}</span>
                        </div>
                        <div class="product-actions">
                        
                        </div>
                        <button class="add-to-cart-btn" data-id="" onclick="addtocart(${value.id})">Add to Cart</button>
                    </div>
                </div>
        `;
  });
  productsGrid.innerHTML = cards;
};

showproducts(products);

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  const searchAlready = products.filter((pro) =>
    pro.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  showproducts(searchAlready);
});

const cartSidebar = document.getElementById("cartSidebar");
const overla = document.getElementById("overlay");
const cartbtn = document.getElementById("cartBtn");
cartbtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("open");
  overla.classList.toggle("active");
});

const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
closeCart.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
});
const cartItems = document.getElementById("cartItems");
localStorage.setItem("carts", JSON.stringify(carts));

const showcarts = (cartsarrey) => {
  let cartlist = "";
  cartsarrey.forEach((value) => {
    cartlist += `
        <div class="cart-item">
                <img src="${value.image}" alt="${
      value.name
    }" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${value.name}</div>
                    <div class="cart-item-price">$${value.price.toFixed(
                      2
                    )}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQTY(${
                          value.id
                        })">
                          <i class="fas fa-minus"></i>
                      </button>
                      <span class="quantity">${value.quantity}</span>
                      <button class="quantity-btn" onclick="increaseQTY(${
                        value.id
                      })">
                          <i class="fas fa-plus"></i>
                      </button>
                      <button class="remove-btn" onclick="remove(${value.id})">
                          <i class="fas fa-trash"></i>
                      </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    $${(value.price * value.quantity).toFixed(2)}
                </div>
            </div>
        
    `;
  });
  cartItems.innerHTML = cartlist;
};
showcarts(carts);

localStorage.setItem("carts", JSON.stringify(carts));
window.addtocart = (id) => {
  const product = products.find((value) => value.id == id);
  const checkifAlreadyExist = carts.find((value) => value.id == id);
  if (checkifAlreadyExist == undefined) {
    carts.push({ ...product, quantity: 1 });
    localStorage.setItem("carts", JSON.stringify(carts));
  } else {
    const cartAfterUpdateQTY = carts.map((value) =>
      value.id == id ? { ...value, quantity: value.quantity + 1 } : value
    );
    carts = cartAfterUpdateQTY;
    localStorage.setItem("carts", JSON.stringify(carts));
  }
  showcarts(carts);
};

window.increaseQTY = (id) => {
  const cartAfterUpdateQTY = carts.map((value) =>
    value.id == id ? { ...value, quantity: value.quantity + 1 } : value
  );
  carts = cartAfterUpdateQTY;
  localStorage.setItem("carts", JSON.stringify(carts));
  showproducts(products);
  showcarts(carts);
  calculateAll();
};

window.decreaseQTY = (id) => {
  const cartAfterUpdateQTY = carts.map((value) =>
    value.id == id ? { ...value, quantity: value.quantity - 1 } : value
  );
  carts = cartAfterUpdateQTY;
  localStorage.setItem("carts", JSON.stringify(carts));
  showproducts(products);
  showcarts(carts);
  calculateAll();
};
window.remove = (id) => {
  const removecarts = carts.filter((value) => value.id !== id);
  carts = removecarts;
  localStorage.setItem("carts", JSON.stringify(carts));
  showproducts(products);
  showcarts(carts);
  calculateAll();
};

// const checkoutBtn = document.getElementById("checkoutBtn");
// checkoutBtn.addEventListener("click", () => {
//   carts = [];
//   localStorage.setItem("carts", JSON.stringify(carts));
//   showproducts(products);
//   showcarts(carts);
//   calculateAll();
// });
const Subtotal = document.getElementById("cartSubtotal");
const shopping = document.getElementById("cartShipping");
const total = document.getElementById("cartTotal");

const calculateAll = () => {
   let totalamount = 0;
  carts.forEach(
    (value) => (totalamount += parseFloat(value.quantity) * value.price)
  );
  Subtotal.textContent = `${totalamount.toFixed(2)}`;
  shopping.textContent = `${totalamount.toFixed(2)}`;
  total.textContent= `${totalamount.toFixed(2)}`;
};
calculateAll();
const checkoutForm = document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload

  // ✅ Clear cart
  carts = [];
  localStorage.setItem("carts", JSON.stringify(carts));
  showcarts(carts);
  updateCartCount();
  calculateAll();

  // ✅ Close modal
  checkoutModal.classList.remove("open");
  overlay.classList.remove("active");

  // ✅ Optional: Show alert or redirect
  alert("Your order has been placed successfully!");
});
