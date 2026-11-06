const productGrid = document.getElementById("productGrid");

function displayProducts() {

    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `

        <div class="product-card">

            <div class="product-image">

                <span class="discount">
                    ${product.discount}% OFF
                </span>

                <img src="${product.image}" alt="${product.name}">

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="product-rating">
                    ★★★★★ ${product.rating}
                </div>

                <div class="product-bottom">

                    <div>
                        <div class="product-price">
                            ₹${product.price.toLocaleString("en-IN")}
                        </div>

                        <div class="old-price">
                            ₹${product.mrp.toLocaleString("en-IN")}
                        </div>
                    </div>

                    <button class="add-cart" onclick="addToCart(${product.id})">
                        <i data-lucide="shopping-cart"></i>
                    </button>

                </div>

            </div>

        </div>

    `).join("");

    if (window.lucide) lucide.createIcons();
}

function addToCart(id) {

    let cart = JSON.parse(localStorage.getItem("technovaCart")) || [];

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, quantity: 1 });
    }

    localStorage.setItem("technovaCart", JSON.stringify(cart));

    updateCartCount();

   
}

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("technovaCart")) || [];

    const count = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}

displayProducts();
updateCartCount();

if (window.lucide) lucide.createIcons();

// ==============================
// WISHLIST COUNT UPDATE
// ==============================

function updateWishlistCount() {
    const wishlistCount = document.getElementById("wishlistCount");

    if (!wishlistCount) return;

    try {
        const wishlist = JSON.parse(
            localStorage.getItem("technovaWishlist") || "[]"
        );

        wishlistCount.textContent = Array.isArray(wishlist)
            ? wishlist.length
            : 0;

    } catch (error) {
        wishlistCount.textContent = "0";
    }
}

// Update when page loads
document.addEventListener("DOMContentLoaded", updateWishlistCount);

// Update when wishlist changes in another tab
window.addEventListener("storage", updateWishlistCount);
