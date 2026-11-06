// CART DATA

function getCheckoutCart() {
    return JSON.parse(localStorage.getItem("technovaCart")) || [];
}

// PRICE FORMAT

function formatCheckoutPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

// GET CART PRODUCTS

function getCheckoutProducts() {

    const cart = getCheckoutCart();

    return cart.map(item => {
        const product = products.find(
            product => product.id === item.id
        );

        return product ? { ...item, product } : null;
    }).filter(Boolean);
}

// DISPLAY ORDER SUMMARY

function displayCheckoutSummary() {

    const items = getCheckoutProducts();

    const container = document.getElementById("checkoutItems");

    let subtotal = 0;
    let discount = 0;

    container.innerHTML = items.map(item => {

        const product = item.product;
        const quantity = Number(item.quantity) || 1;

        subtotal += product.mrp * quantity;

        discount += (product.mrp - product.price) * quantity;

        return `
            <div class="checkout-product">

                <img src="${product.image}" alt="${product.name}">

                <div class="checkout-product-info">
                    <h4>${product.name}</h4>
                    <p>Qty: ${quantity}</p>
                    <p>${item.color || "Black"} / ${item.storage || "Standard"}</p>
                </div>

                <div class="checkout-product-price">
                    ${formatCheckoutPrice(product.price * quantity)}
                </div>

            </div>
        `;

    }).join("");

    document.getElementById("checkoutSubtotal").textContent =
        formatCheckoutPrice(subtotal);

    document.getElementById("checkoutDiscount").textContent =
        "-" + formatCheckoutPrice(discount);

    document.getElementById("checkoutTotal").textContent =
        formatCheckoutPrice(subtotal - discount);
}

// CHECK EMPTY CART

const checkoutCart = getCheckoutProducts();

if (checkoutCart.length === 0) {

    alert("Your cart is empty!");

    window.location.replace("shop.html");

} else {

    displayCheckoutSummary();

}

// PLACE ORDER

document.getElementById("checkoutForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const items = getCheckoutProducts();

    if (items.length === 0) {
        alert("Your cart is empty!");
        window.location.replace("shop.html");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const customerEmail = document.getElementById("customerEmail").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();

    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const landmark = document.getElementById("landmark").value.trim();

    const paymentMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
    ).value;

    let subtotal = 0;
    let discount = 0;

    const orderItems = items.map(item => {

        const product = item.product;
        const quantity = Number(item.quantity) || 1;

        subtotal += product.mrp * quantity;
        discount += (product.mrp - product.price) * quantity;

        return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            color: item.color,
            storage: item.storage,
            image: product.image
        };

    });

    const order = {

        orderId: "TN" + Date.now(),

        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
        },

        address: {
            fullAddress: address,
            city,
            state,
            pincode,
            landmark
        },

        paymentMethod,

        items: orderItems,

        subtotal,
        discount,
        total: subtotal - discount,

        status: "Order Placed",

        orderDate: new Date().toISOString()

    };

    // SAVE ORDER

    const orders = JSON.parse(
        localStorage.getItem("technovaOrders")
    ) || [];

    orders.push(order);

    localStorage.setItem(
        "technovaOrders",
        JSON.stringify(orders)
    );

    // CLEAR CART

    localStorage.removeItem("technovaCart");

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    // SHOW SUCCESS

    document.getElementById("checkoutForm").hidden = true;

    document.querySelector(".checkout-summary").hidden = true;

    document.querySelector(".checkout-heading").hidden = true;

    const successBox = document.getElementById("orderSuccess");

    successBox.hidden = false;

    document.getElementById("successMessage").textContent =
        `Thank you, ${customerName}! Your order ${order.orderId} has been placed successfully.`;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});