// GET CART DATA

function getCart() {
    return JSON.parse(localStorage.getItem("technovaCart")) || [];
}

// SAVE CART DATA

function saveCart(cart) {
    localStorage.setItem("technovaCart", JSON.stringify(cart));

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
}

// FORMAT PRICE

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

// DISPLAY CART

function displayCart() {

    const cart = getCart();

    const cartItems = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("totalAmount");
    const itemCount = document.getElementById("itemCount");
    const checkoutBtn = document.getElementById("checkoutBtn");

    let subtotal = 0;
    let discount = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Your Cart Is Empty</h3>
                <p>Looks like you haven't added anything yet.</p>
                <a href="shop.html">Explore Products</a>
            </div>
        `;

        subtotalElement.textContent = formatPrice(0);
        discountElement.textContent = formatPrice(0);
        totalElement.textContent = formatPrice(0);
        itemCount.textContent = "(0)";
        checkoutBtn.disabled = true;

        return;
    }

    checkoutBtn.disabled = false;

    cartItems.innerHTML = cart.map((item, index) => {

        const product = products.find(
            product => product.id === item.id
        );

        if (!product) return "";

        const quantity = Math.max(1, Number(item.quantity) || 1);

        const itemTotal = product.price * quantity;
        const itemDiscount = (product.mrp - product.price) * quantity;

        subtotal += product.mrp * quantity;
        discount += itemDiscount;
        totalQuantity += quantity;

        return `
            <div class="cart-item">

                <div class="cart-item-image">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                </div>

                <div class="cart-item-info">

                    <h3>${product.name}</h3>

                    <p>Brand: ${product.brand}</p>
                    <p>Color: ${item.color || "Black"}</p>
                    <p>Storage: ${item.storage || "Standard"}</p>

                    <div class="cart-item-actions">

                        <div class="quantity-control">

                            <button onclick="changeQuantity(${index}, -1)">
                                −
                            </button>

                            <span>${quantity}</span>

                            <button onclick="changeQuantity(${index}, 1)">
                                +
                            </button>

                        </div>

                        <button
                            class="remove-item"
                            onclick="removeItem(${index})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

                <div class="cart-item-price">
                    ${formatPrice(itemTotal)}
                </div>

            </div>
        `;

    }).join("");

    const finalTotal = subtotal - discount;

    subtotalElement.textContent = formatPrice(subtotal);
    discountElement.textContent = "-" + formatPrice(discount);
    totalElement.textContent = formatPrice(finalTotal);
    itemCount.textContent = `(${totalQuantity})`;

}

// CHANGE QUANTITY

function changeQuantity(index, change) {

    const cart = getCart();

    if (!cart[index]) return;

    const newQuantity = Number(cart[index].quantity) + change;

    if (newQuantity < 1) return;

    if (newQuantity > 10) {
        alert("Maximum 10 quantity allowed.");
        return;
    }

    cart[index].quantity = newQuantity;

    saveCart(cart);
    displayCart();
}

// REMOVE ITEM

function removeItem(index) {

    const cart = getCart();

    if (!cart[index]) return;

    const confirmRemove = confirm(
        "Are you sure you want to remove this product?"
    );

    if (!confirmRemove) return;

    cart.splice(index, 1);

    saveCart(cart);
    displayCart();

}

// CLEAR CART

document.getElementById("clearCartBtn").addEventListener("click", () => {

    const cart = getCart();

    if (cart.length === 0) return;

    const confirmClear = confirm(
        "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) return;

    saveCart([]);
    displayCart();

});

// CHECKOUT BUTTON

document.getElementById("checkoutBtn").addEventListener("click", () => {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Checkout page will be created in the next step.
    window.location.href = "checkout.html";

});

// INITIALIZE CART

displayCart();