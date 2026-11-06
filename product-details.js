// GET PRODUCT ID FROM URL

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const product = products.find(item => item.id === productId);

let quantity = 1;
let selectedColor = "Black";
let selectedStorage = "Standard";

// PRODUCT COLORS

const colors = [
    { name: "Black", code: "#171717" },
    { name: "Silver", code: "#C0C0C0" },
    { name: "Blue", code: "#2563EB" },
    { name: "White", code: "#FFFFFF" }
];

// PRODUCT VARIANTS

const storageOptions = [
    "Standard",
    "128 GB",
    "256 GB",
    "512 GB"
];

// CATEGORY SPECIFICATIONS

const specifications = {
    Smartphones: {
        "Product Type": "Smartphone",
        "Display": "AMOLED Display",
        "Connectivity": "5G / Wi-Fi / Bluetooth",
        "Operating System": "Android / iOS",
        "Warranty": "1 Year"
    },

    Laptops: {
        "Product Type": "Laptop",
        "Processor": "Multi-Core Processor",
        "RAM": "8 GB / 16 GB",
        "Storage": "SSD",
        "Connectivity": "Wi-Fi / Bluetooth",
        "Warranty": "1 Year"
    },

    Headphones: {
        "Product Type": "Wireless Audio",
        "Connectivity": "Bluetooth",
        "Battery": "Up to 30 Hours (sample)",
        "Audio": "Stereo Sound",
        "Warranty": "1 Year"
    },

    Smartwatches: {
        "Product Type": "Smart Watch",
        "Display": "Digital Display",
        "Connectivity": "Bluetooth",
        "Features": "Fitness Tracking",
        "Warranty": "1 Year"
    },

    Gaming: {
        "Product Type": "Gaming Accessory",
        "Connectivity": "USB / Wireless",
        "Compatibility": "PC / Laptop",
        "Usage": "Gaming",
        "Warranty": "1 Year"
    },

    Speakers: {
        "Product Type": "Bluetooth Speaker",
        "Connectivity": "Bluetooth",
        "Audio": "Stereo Sound",
        "Usage": "Indoor / Outdoor",
        "Warranty": "1 Year"
    }
};

// CHECK PRODUCT

if (!product) {
    alert("Product not found!");
    window.location.replace("shop.html");
} else {
    initializeProduct();
}

// INITIALIZE PRODUCT

function initializeProduct() {

    document.title = `${product.name} | TechNova`;

    document.getElementById("breadcrumbName").textContent =
        product.name;

    document.getElementById("productCategory").textContent =
        product.category;

    document.getElementById("productName").textContent =
        product.name;

    document.getElementById("productRating").textContent =
        product.rating + " / 5";

    document.getElementById("reviewAverage").textContent =
        product.rating;

    document.getElementById("productPrice").textContent =
        "₹" + product.price.toLocaleString("en-IN");

    document.getElementById("productMRP").textContent =
        "₹" + product.mrp.toLocaleString("en-IN");

    document.getElementById("productDiscount").textContent =
        product.discount + "% OFF";

    document.getElementById("discountBadge").textContent =
        product.discount + "% OFF";

    document.getElementById("productDescription").textContent =
        `Experience premium technology with the ${product.name}.
        Designed for modern lifestyles, this ${product.category.toLowerCase()}
        product brings style, convenience and performance together.`;

    document.getElementById("mainProductImage").src =
        product.image;

    // IMAGE GALLERY

    const galleryImages = product.gallery?.length
        ? product.gallery
        : [product.image];

    const thumbnailGallery =
        document.getElementById("thumbnailGallery");

    thumbnailGallery.innerHTML = galleryImages.map(
        (image, index) => `
            <button
                class="thumbnail ${index === 0 ? "active" : ""}"
                onclick="changeImage(${index})"
                aria-label="View image ${index + 1}"
            >
                <img src="${image}" alt="${product.name} image ${index + 1}">
            </button>
        `
    ).join("");

    // COLORS

    document.getElementById("colorOptions").innerHTML =
        colors.map((color, index) => `
            <button
                class="color-choice ${index === 0 ? "active" : ""}"
                style="background:${color.code}"
                onclick="selectColor('${color.name}', this)"
                title="${color.name}"
                aria-label="${color.name}"
            ></button>
        `).join("");

    document.getElementById("selectedColor").textContent =
        "Selected Color: " + selectedColor;

    // STORAGE OPTIONS

    document.getElementById("storageOptions").innerHTML =
        storageOptions.map((storage, index) => `
            <button
                class="storage-choice ${index === 0 ? "active" : ""}"
                onclick="selectStorage('${storage}', this)"
            >
                ${storage}
            </button>
        `).join("");

    // SPECIFICATIONS

    const specs =
        specifications[product.category] || {
            "Product": product.name,
            "Brand": product.brand,
            "Category": product.category,
            "Warranty": "Check product packaging"
        };

    const table = document.getElementById("specificationTable");

    table.innerHTML = Object.entries({
        "Product Name": product.name,
        "Brand": product.brand,
        "Category": product.category,
        ...specs
    }).map(([key, value]) => `
        <div class="spec-row">
            <span>${key}</span>
            <span>${value}</span>
        </div>
    `).join("");

    // RELATED PRODUCTS

    const related = products
        .filter(item =>
            item.category === product.category &&
            item.id !== product.id
        )
        .slice(0, 4);

    const relatedGrid = document.getElementById("relatedProducts");

    if (related.length) {

        relatedGrid.innerHTML = related.map(item => `
            <div class="product-card">

                <div class="product-image"
                    onclick="window.location.href='product.html?id=${item.id}'">

                    <span class="discount">
                        ${item.discount}% OFF
                    </span>

                    <img src="${item.image}" alt="${item.name}">

                </div>

                <div class="product-info">
                    <span class="product-category">${item.category}</span>
                    <h3>${item.name}</h3>

                    <div class="product-rating">
                        ★★★★★ ${item.rating}
                    </div>

                    <div class="product-bottom">
                        <div class="product-price">
                            ₹${item.price.toLocaleString("en-IN")}
                        </div>

                        <button
                            class="add-cart"
                            onclick="addToCart(${item.id})"
                            aria-label="Add to cart"
                        >
                            <i data-lucide="shopping-cart"></i>
                        </button>
                    </div>
                </div>

            </div>
        `).join("");

    } else {
        relatedGrid.innerHTML = `
            <p style="color:#94a3b8">
                More products coming soon.
            </p>
        `;
    }

    updateWishlistButton();

    if (window.lucide) lucide.createIcons();
}

// CHANGE PRODUCT IMAGE

function changeImage(index) {

    const images = product.gallery?.length
        ? product.gallery
        : [product.image];

    const mainImage = document.getElementById("mainProductImage");

    mainImage.src = images[index];

    document.querySelectorAll(".thumbnail").forEach(
        (thumb, i) => {
            thumb.classList.toggle("active", i === index);
        }
    );
}

// SELECT COLOR

function selectColor(color, element) {

    selectedColor = color;

    document.querySelectorAll(".color-choice").forEach(
        item => item.classList.remove("active")
    );

    element.classList.add("active");

    document.getElementById("selectedColor").textContent =
        "Selected Color: " + color;
}

// SELECT STORAGE

function selectStorage(storage, element) {

    selectedStorage = storage;

    document.querySelectorAll(".storage-choice").forEach(
        item => item.classList.remove("active")
    );

    element.classList.add("active");
}

// QUANTITY

document.getElementById("decreaseQty").addEventListener("click", () => {

    if (quantity > 1) {
        quantity--;
        updateQuantity();
    }

});

document.getElementById("increaseQty").addEventListener("click", () => {

    if (quantity < 10) {
        quantity++;
        updateQuantity();
    }

});

function updateQuantity() {

    document.getElementById("quantity").textContent = quantity;

}

// ADD TO CART

document.getElementById("addToCartBtn").addEventListener("click", () => {

    if (!product) return;

    let cart = JSON.parse(
        localStorage.getItem("technovaCart")
    ) || [];

    const existing = cart.find(item =>
        item.id === product.id &&
        item.color === selectedColor &&
        item.storage === selectedStorage
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            quantity,
            color: selectedColor,
            storage: selectedStorage
        });
    }

    localStorage.setItem(
        "technovaCart",
        JSON.stringify(cart)
    );

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    alert("Product successfully added to cart!");
});

// BUY NOW

document.getElementById("buyNowBtn").addEventListener("click", () => {

    if (!product) return;

    let cart = JSON.parse(
        localStorage.getItem("technovaCart")
    ) || [];

    const existing = cart.find(item =>
        item.id === product.id &&
        item.color === selectedColor &&
        item.storage === selectedStorage
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            quantity,
            color: selectedColor,
            storage: selectedStorage
        });
    }

    localStorage.setItem(
        "technovaCart",
        JSON.stringify(cart)
    );

    window.location.href = "cart.html";

});

// WISHLIST

function updateWishlistButton() {

    const wishlist = JSON.parse(
        localStorage.getItem("technovaWishlist")
    ) || [];

    const button = document.getElementById("wishlistBtn");

    const active = wishlist.includes(product.id);

    button.classList.toggle("active", active);

    button.innerHTML = active
        ? '<i data-lucide="heart"></i> Added To Wishlist'
        : '<i data-lucide="heart"></i> Add To Wishlist';

    if (window.lucide) lucide.createIcons();
}

document.getElementById("wishlistBtn").addEventListener("click", () => {

    let wishlist = JSON.parse(
        localStorage.getItem("technovaWishlist")
    ) || [];

    if (wishlist.includes(product.id)) {
        wishlist = wishlist.filter(id => id !== product.id);
    } else {
        wishlist.push(product.id);
    }

    localStorage.setItem(
        "technovaWishlist",
        JSON.stringify(wishlist)
    );

    updateWishlistButton();

});

// IMAGE ZOOM

document.getElementById("zoomButton").addEventListener("click", () => {

    const modal = document.getElementById("imageModal");

    document.getElementById("zoomedImage").src =
        document.getElementById("mainProductImage").src;

    modal.classList.add("show");

});

document.getElementById("closeZoom").addEventListener("click", () => {
    document.getElementById("imageModal").classList.remove("show");
});

document.getElementById("imageModal").addEventListener("click", event => {

    if (event.target.id === "imageModal") {
        event.currentTarget.classList.remove("show");
    }

});const galleryImages = product.gallery?.length
    ? product.gallery
    : [product.image];