// script1.js
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
                        <button class="add-to-cart-btn" data-id="${value.id}">Add to Cart</button>
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

const cartSidebar=document.getElementById("cartSidebar")
const cartbtn = document.getElementById("cartBtn");
cartbtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("open");
  document.getElementById("overlay").classList.toggle("active");
});

const overlay=document.getElementById("overlay")
const closeCart = document.getElementById("closeCart");
closeCart.addEventListener("click",()=>{
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
})


