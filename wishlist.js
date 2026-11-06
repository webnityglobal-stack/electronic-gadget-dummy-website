// GET WISHLIST

function getWishlist() {

    return JSON.parse(
        localStorage.getItem("technovaWishlist")
    ) || [];

}

// SAVE WISHLIST

function saveWishlist(wishlist) {

    localStorage.setItem(
        "technovaWishlist",
        JSON.stringify(wishlist)
    );

}

// FORMAT PRICE

function formatWishlistPrice(price) {

    return "₹" + Number(price).toLocaleString("en-IN");

}

// DISPLAY WISHLIST

function displayWishlist() {

    const wishlist = getWishlist();

    const wishlistProducts = document.getElementById("wishlistProducts");

    const wishlistCount = document.getElementById("wishlistCount");

    const clearButton = document.getElementById("clearWishlistBtn");

    const savedProducts = wishlist
        .map(id => products.find(product => product.id === id))
        .filter(Boolean);

    wishlistCount.textContent = `(${savedProducts.length})`;

    clearButton.style.display =
        savedProducts.length ? "block" : "none";

    if (savedProducts.length === 0) {

        wishlistProducts.innerHTML = `
            <div class="empty-wishlist">

                <div class="empty-icon">❤️</div>

                <h3>Your Wishlist Is Empty</h3>

                <p>
                    Save your favourite products and find them here.
                </p>

                <a href="shop.html">Explore Products</a>

            </div>
        `;

        return;

    }

    wishlistProducts.innerHTML = savedProducts.map(product => `

        <div class="wishlist-card">

            <div class="wishlist-image"
                onclick="window.location.href='product.html?id=${product.id}'">

                <span class="wishlist-discount">
                    ${product.discount}% OFF
                </span>

                <button
                    class="remove-wishlist"
                    onclick="event.stopPropagation(); removeWishlist(${product.id})"
                    aria-label="Remove from wishlist"
                >
                    ♥
                </button>

                <img src="${product.image}" alt="${product.name}">

            </div>

            <div class="wishlist-info">

                <span class="wishlist-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="wishlist-rating">
                    ★★★★★ ${product.rating}
                </div>

                <div class="wishlist-price">

                    <strong>
                        ${formatWishlistPrice(product.price)}
                    </strong>

                    <del>
                        ${formatWishlistPrice(product.mrp)}
                    </del>

                </div>

                <div class="wishlist-actions">

                    <button
                        class="wishlist-add-cart"
                        onclick="addWishlistToCart(${product.id})"
                    >
                        Add To Cart
                    </button>

                    <button
                        class="wishlist-view"
                        onclick="window.location.href='product.html?id=${product.id}'"
                    >
                        View
                    </button>

                </div>

            </div>

        </div>

    `).join("");

}

// REMOVE PRODUCT

function removeWishlist(productId) {

    let wishlist = getWishlist();

    wishlist = wishlist.filter(id => id !== productId);

    saveWishlist(wishlist);

    displayWishlist();

}

// ADD TO CART

function addWishlistToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    let cart = JSON.parse(
        localStorage.getItem("technovaCart")
    ) || [];

    const existing = cart.find(item =>
        item.id === productId &&
        item.color === "Black" &&
        item.storage === "Standard"
    );

    if (existing) {

        if (existing.quantity >= 10) {
            alert("Maximum 10 quantity allowed.");
            return;
        }

        existing.quantity++;

    } else {

        cart.push({
            id: productId,
            quantity: 1,
            color: "Black",
            storage: "Standard"
        });

    }

    localStorage.setItem(
        "technovaCart",
        JSON.stringify(cart)
    );

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    alert("Product added to cart successfully!");

}

// CLEAR WISHLIST

document.getElementById("clearWishlistBtn").addEventListener("click", () => {

    const wishlist = getWishlist();

    if (wishlist.length === 0) return;

    const confirmClear = confirm(
        "Are you sure you want to clear your wishlist?"
    );

    if (!confirmClear) return;

    saveWishlist([]);

    displayWishlist();

});

// INITIALIZE

displayWishlist();