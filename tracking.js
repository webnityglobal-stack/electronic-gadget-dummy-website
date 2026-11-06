// PRICE FORMAT

function formatTrackingPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

// GET ORDERS

function getTrackingOrders() {

    return JSON.parse(
        localStorage.getItem("technovaOrders")
    ) || [];

}

// STATUS STEPS

const statusSteps = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered"
];

// TRACK ORDER

document.getElementById("trackingForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const orderId = document.getElementById("orderId")
            .value.trim().toUpperCase();

        const message = document.getElementById("trackingMessage");
        const result = document.getElementById("trackingResult");

        message.textContent = "";
        result.hidden = true;

        const orders = getTrackingOrders();

        const order = orders.find(item =>
            item.orderId.toUpperCase() === orderId
        );

        if (!order) {

            message.textContent =
                "Order not found. Please check your Order ID.";

            return;

        }

        displayTrackingDetails(order);

    }
);

// DISPLAY DETAILS

function displayTrackingDetails(order) {

    const result = document.getElementById("trackingResult");

    result.hidden = false;

    document.getElementById("resultOrderId").textContent =
        order.orderId;

    document.getElementById("orderStatusBadge").textContent =
        order.status;

    document.getElementById("orderDate").textContent =
        new Date(order.orderDate).toLocaleDateString("en-IN");

    document.getElementById("paymentMethod").textContent =
        order.paymentMethod;

    document.getElementById("orderTotal").textContent =
        formatTrackingPrice(order.total);

    document.getElementById("deliveryName").textContent =
        order.customer.name;

    document.getElementById("deliveryAddress").textContent =
        `${order.address.fullAddress}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`;

    document.getElementById("deliveryPhone").textContent =
        "Mobile: " + order.customer.phone;

    // PRODUCTS

    document.getElementById("trackingProducts").innerHTML =
        order.items.map(item => `

            <div class="tracking-product">

                <img src="${item.image}" alt="${item.name}">

                <div class="tracking-product-info">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Color: ${item.color || "Black"}</p>
                </div>

                <div class="tracking-product-price">
                    ${formatTrackingPrice(item.price * item.quantity)}
                </div>

            </div>

        `).join("");

    // TIMELINE

    displayTimeline(order.status);

    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

// DISPLAY TIMELINE

function displayTimeline(status) {

    const timeline = document.getElementById("trackingTimeline");

    if (status === "Cancelled") {

        timeline.innerHTML = `
            <div class="timeline-step cancelled">
                <div class="timeline-icon">✕</div>
                <div>
                    <h4>Order Cancelled</h4>
                    <p>This order has been cancelled.</p>
                </div>
            </div>
        `;

        return;
    }

    const currentIndex = statusSteps.indexOf(status);

    timeline.innerHTML = statusSteps.map((step, index) => {

        const completed = index <= currentIndex;

        return `
            <div class="timeline-step ${completed ? "completed" : ""}">

                <div class="timeline-icon">
                    ${completed ? "✓" : index + 1}
                </div>

                <div>
                    <h4>${step}</h4>
                    <p>
                        ${completed
                            ? "Completed"
                            : "Waiting for update"
                        }
                    </p>
                </div>

            </div>
        `;

    }).join("");

}