// E-commerce Website JavaScript

// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        category: "audio",
        rating: 4.5,
        reviews: 128,
        inStock: true
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        category: "wearables",
        rating: 4.8,
        reviews: 256,
        inStock: true
    },
    {
        id: 3,
        name: "Smartphone",
        price: 699.99,
        originalPrice: 799.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
        category: "electronics",
        rating: 4.6,
        reviews: 512,
        inStock: false
    },
    {
        id: 4,
        name: "Digital Camera",
        price: 899.99,
        originalPrice: 1099.99,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop",
        category: "photography",
        rating: 4.7,
        reviews: 89,
        inStock: true
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
        category: "audio",
        rating: 4.3,
        reviews: 203,
        inStock: true
    },
    {
        id: 6,
        name: "Laptop",
        price: 1299.99,
        originalPrice: 1499.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
        category: "electronics",
        rating: 4.9,
        reviews: 445,
        inStock: true
    }
];

// Global state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let filteredProducts = [...products];
let currentView = 'grid';

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');
const overlay = document.getElementById('overlay');
const checkoutModal = document.getElementById('checkoutModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderProducts();
    updateCartUI();
    updateWishlistUI();
});

function initializeApp() {
    // Set initial filter values
    document.getElementById('priceRange').value = 1500;
    document.getElementById('priceValue').textContent = '$0 - $1500';
}

function setupEventListeners() {
    // Header actions
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('priceRange').addEventListener('input', handlePriceRange);
    document.getElementById('inStockOnly').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', handleSort);
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentView = e.target.dataset.view;
            renderProducts();
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            document.getElementById('categoryFilter').value = category;
            applyFilters();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
    document.getElementById('closeCheckout').addEventListener('click', closeCheckout);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    
    // Overlay
    overlay.addEventListener('click', closeModals);
    
    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Product rendering
function renderProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    productsGrid.className = `products-grid ${currentView === 'list' ? 'list-view' : ''}`;
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search" style="font-size: 3rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                <p style="color: #6b7280; font-size: 1.1rem;">No products found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = `product-card ${currentView === 'list' ? 'list-view' : ''} fade-in`;
    
    const discount = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    const stars = generateStars(product.rating);
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${discount > 0 ? `<div class="product-badge">${discount}% OFF</div>` : ''}
            ${!product.inStock ? `<div class="product-badge out-of-stock">Out of Stock</div>` : ''}
            <div class="product-actions">
                <button class="action-btn-small" onclick="quickView(${product.id})" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn-small ${isInWishlist ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                    <i class="fas fa-heart" style="color: ${isInWishlist ? '#ef4444' : 'inherit'}"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="reviews-count">(${product.reviews})</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${capitalizeFirst(product.category)}</p>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i>
                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `;
    
    return card;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        } else {
            stars += '<i class="fas fa-star star empty"></i>';
        }
    }
    return stars;
}

// Filtering and sorting
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const inStockOnly = document.getElementById('inStockOnly').checked;
    
    filteredProducts = products.filter(product => {
        const categoryMatch = category === 'all' || product.category === category;
        const priceMatch = product.price <= maxPrice;
        const stockMatch = !inStockOnly || product.inStock;
        
        return categoryMatch && priceMatch && stockMatch;
    });
    
    renderProducts();
}

function handlePriceRange(e) {
    const value = e.target.value;
    document.getElementById('priceValue').textContent = `$0 - $${value}`;
    applyFilters();
}

function handleSort(e) {
    const sortBy = e.target.value;
    
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });
    
    renderProducts();
}

function handleSearch(e) {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    if (query.trim() === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    renderProducts();
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showMessage('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showMessage('Product removed from cart!', 'info');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart items
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
    }
    
    // Update totals
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;
    
    const elements = {
        cartSubtotal: document.getElementById('cartSubtotal'),
        cartShipping: document.getElementById('cartShipping'),
        cartTotal: document.getElementById('cartTotal')
    };
    
    if (elements.cartSubtotal) elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.cartShipping) elements.cartShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (elements.cartTotal) elements.cartTotal.textContent = `$${total.toFixed(2)}`;
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Wishlist functionality
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showMessage('Removed from wishlist!', 'info');
    } else {
        wishlist.push(product);
        showMessage('Added to wishlist!', 'success');
    }
    
    saveWishlist();
    updateWishlistUI();
    renderProducts(); // Re-render to update heart icons
}

function updateWishlistUI() {
    wishlistCount.textContent = wishlist.length;
    wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Checkout functionality
function openCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateCheckoutSummary();
}

function closeCheckout() {
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
}

function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    if (checkoutItems) {
        checkoutItems.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
                    <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 0.9rem; color: #6b7280;">Qty: ${item.quantity}</div>
                    </div>
                </div>
                <div style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    // Update checkout totals
    const elements = {
        checkoutSubtotal: document.getElementById('checkoutSubtotal'),
        checkoutShipping: document.getElementById('checkoutShipping'),
        checkoutTax: document.getElementById('checkoutTax'),
        checkoutTotal: document.getElementById('checkoutTotal')
    };
    
    if (elements.checkoutSubtotal) elements.checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.checkoutShipping) elements.checkoutShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (elements.checkoutTax) elements.checkoutTax.textContent = `$${tax.toFixed(2)}`;
    if (elements.checkoutTotal) elements.checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

function handleCheckout(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const orderData = Object.fromEntries(formData.entries());
    
    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'cardName', 'cardNumber', 'expiryDate', 'cvv'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
        showMessage('Please fill in all required fields!', 'error');
        return;
    }
    
    // Simulate order processing
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<div class="spinner"></div>Processing...';
    
    setTimeout(() => {
        // Clear cart and close modal
        cart = [];
        saveCart();
        updateCartUI();
        closeCheckout();
        
        // Show success message
        showMessage('Order placed successfully! Thank you for your purchase.', 'success');
        
        // Reset form
        form.reset();
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Utility functions
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Create quick view modal (simplified implementation)
    const quickViewHTML = `
        <div class="modal open" id="quickViewModal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>${product.name}</h2>
                    <button class="close-btn" onclick="closeQuickView()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                        <div>
                            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px;">
                        </div>
                        <div>
                            <div class="product-rating" style="margin-bottom: 1rem;">
                                <div class="stars">${generateStars(product.rating)}</div>
                                <span class="reviews-count">(${product.reviews} reviews)</span>
                            </div>
                            <p style="color: #6b7280; margin-bottom: 1rem;">${capitalizeFirst(product.category)}</p>
                            <div class="product-price" style="margin-bottom: 1.5rem;">
                                <span class="current-price" style="font-size: 1.5rem;">$${product.price.toFixed(2)}</span>
                                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <p style="color: #4b5563; margin-bottom: 1.5rem; line-height: 1.6;">
                                High-quality ${product.name.toLowerCase()} with premium features and excellent performance. 
                                Perfect for everyday use with outstanding durability and design.
                            </p>
                            <div style="display: flex; gap: 1rem;">
                                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeQuickView();" 
                                        ${!product.inStock ? 'disabled' : ''} style="flex: 1;">
                                    <i class="fas fa-shopping-cart"></i>
                                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button class="action-btn" onclick="toggleWishlist(${product.id})" 
                                        style="padding: 12px; border-radius: 8px;">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', quickViewHTML);
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const quickViewModal = document.getElementById('quickViewModal');
    if (quickViewModal) {
        quickViewModal.remove();
        document.body.style.overflow = '';
    }
}

function closeModals() {
    closeCart();
    closeCheckout();
    closeQuickView();
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${text}
    `;
    
    // Add to top of page
    document.body.insertAdjacentElement('afterbegin', message);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Form validation helpers
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Add input formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => formatCardNumber(e.target));
        cardNumberInput.setAttribute('maxlength', '19');
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', (e) => formatExpiryDate(e.target));
        expiryDateInput.setAttribute('maxlength', '5');
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
        cvvInput.setAttribute('maxlength', '4');
    }
});

// Smooth scroll behavior for better UX
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Add to cart animation
function addToCartAnimation(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showMessage('Something went wrong. Please try again.', 'error');
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}