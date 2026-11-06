
const shopGrid = document.getElementById("shopProductGrid");

const searchInput = document.getElementById("productSearch");
const sortSelect = document.getElementById("sortProducts");

const resultCount = document.getElementById("resultCount");
const noProducts = document.getElementById("noProducts");

const sidebar = document.getElementById("filterSidebar");
const filterToggle = document.getElementById("filterToggle");

let minPrice = null;
let maxPrice = null;

// ==============================
// GET SELECTED FILTERS
// ==============================

function getSelectedValues(name) {
    return [...document.querySelectorAll(
        `input[name="${name}"]:checked`
    )].map(input => input.value);
}

// ==============================
// WISHLIST STORAGE
// ==============================

function getWishlist() {
    try {
        const wishlist = JSON.parse(
            localStorage.getItem("technovaWishlist") || "[]"
        );

        return Array.isArray(wishlist)
            ? wishlist.map(Number)
            : [];

    } catch (error) {
        return [];
    }
}

// ==============================
// TOGGLE WISHLIST
// ==============================

function toggleWishlist(id) {

    id = Number(id);

    let wishlist = getWishlist();

    if (wishlist.includes(id)) {

        wishlist = wishlist.filter(item => item !== id);

    } else {

        wishlist.push(id);

    }

    localStorage.setItem(
        "technovaWishlist",
        JSON.stringify(wishlist)
    );

    // Refresh product cards and heart state
    renderShopProducts();
}

// ==============================
// FILTER PRODUCTS
// ==============================

function getFilteredProducts() {

    const search = searchInput.value.trim().toLowerCase();

    const categories = getSelectedValues("category");
    const brands = getSelectedValues("brand");

    const rating = Number(
        document.querySelector('input[name="rating"]:checked')?.value || 0
    );

    let filtered = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            product.brand.toLowerCase().includes(search);

        const matchesCategory =
            categories.length === 0 ||
            categories.includes(product.category);

        const matchesBrand =
            brands.length === 0 ||
            brands.includes(product.brand);

        const matchesMin =
            minPrice === null || product.price >= minPrice;

        const matchesMax =
            maxPrice === null || product.price <= maxPrice;

        const matchesRating =
            product.rating >= rating;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesBrand &&
            matchesMin &&
            matchesMax &&
            matchesRating
        );
    });

    // SORTING

    const sortValue = sortSelect.value;

    if (sortValue === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    if (sortValue === "discount") {
        filtered.sort((a, b) => b.discount - a.discount);
    }

    return filtered;
}

// ==============================
// DISPLAY PRODUCTS
// ==============================

function renderShopProducts() {

    const filtered = getFilteredProducts();

    const wishlist = getWishlist();

    resultCount.textContent =
        `Showing ${filtered.length} of ${products.length} products`;

    noProducts.hidden = filtered.length !== 0;

    shopGrid.style.display = filtered.length ? "grid" : "none";

    shopGrid.innerHTML = filtered.map(product => {

        const isWishlisted = wishlist.includes(Number(product.id));

        return `
            <div class="product-card">

                <div class="product-image"
                    onclick="openProduct(${product.id})">

                    <span class="discount">
                        ${product.discount}% OFF
                    </span>

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>

                <div class="product-actions">

                    <button
                        class="wishlist-btn ${isWishlisted ? "wish-active" : ""}"
                        onclick="toggleWishlist(${product.id})"
                        aria-label="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
                        aria-pressed="${isWishlisted}"
                        title="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
                    >
                        <i data-lucide="heart"></i>
                    </button>

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

                        <button
                            class="add-cart"
                            onclick="addToCart(${product.id})"
                            aria-label="Add to cart"
                        >
                            <i data-lucide="shopping-cart"></i>
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ==============================
// PRODUCT DETAILS NAVIGATION
// ==============================

function openProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// ==============================
// SEARCH EVENT
// ==============================

searchInput.addEventListener("input", renderShopProducts);

// ==============================
// SORT EVENT
// ==============================

sortSelect.addEventListener("change", renderShopProducts);

// ==============================
// CATEGORY & BRAND EVENTS
// ==============================

document.querySelectorAll(
    'input[name="category"], input[name="brand"], input[name="rating"]'
).forEach(input => {

    input.addEventListener("change", renderShopProducts);

});

// ==============================
// PRICE FILTER
// ==============================

document.getElementById("applyPrice").addEventListener("click", () => {

    const min = document.getElementById("minPrice").value;
    const max = document.getElementById("maxPrice").value;

    minPrice = min === "" ? null : Number(min);
    maxPrice = max === "" ? null : Number(max);

    if (
        (minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) ||
        (maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
        (minPrice !== null && maxPrice !== null && minPrice > maxPrice)
    ) {
        alert("Please enter a valid price range.");
        return;
    }

    renderShopProducts();

});

// ==============================
// CLEAR FILTERS
// ==============================

function clearAllFilters() {

    document.querySelectorAll(
        'input[name="category"], input[name="brand"], input[name="rating"]'
    ).forEach(input => {

        input.checked = false;

    });

    searchInput.value = "";
    sortSelect.value = "default";

    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";

    minPrice = null;
    maxPrice = null;

    renderShopProducts();
}

document.getElementById("clearFilters")
    .addEventListener("click", clearAllFilters);

document.getElementById("resetSearch")
    .addEventListener("click", clearAllFilters);

// ==============================
// MOBILE FILTER
// ==============================

filterToggle.addEventListener("click", () => {

    sidebar.classList.toggle("show");

});

// ==============================
// URL CATEGORY FILTER
// ==============================

const urlParams = new URLSearchParams(window.location.search);

const selectedCategory = urlParams.get("category");

if (selectedCategory) {

    const matchingCategory = [
        ...document.querySelectorAll('input[name="category"]')
    ].find(input =>
        input.value.toLowerCase() === selectedCategory.toLowerCase()
    );

    if (matchingCategory) {
        matchingCategory.checked = true;
    }
}

// ==============================
// INITIALIZE
// ==============================

renderShopProducts();
