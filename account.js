
"use strict";

// ========================================
// STORAGE HELPERS
// ========================================

function getStoredData(key, fallback = []) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return data ?? fallback;
    } catch (error) {
        console.error("Storage error:", key, error);
        return fallback;
    }
}

function saveStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// ========================================
// CURRENT USER
// ========================================

let currentUser = getStoredData("technovaCurrentUser", null);


// ========================================
// CHECK LOGIN
// ========================================

function checkLogin() {

    if (!currentUser || !currentUser.email) {

        alert("Please login to access your account.");

        window.location.replace("login.html");

        return false;
    }

    return true;
}


// ========================================
// INITIALIZE ACCOUNT
// ========================================

function initializeAccount() {

    if (!checkLogin()) return;

    loadProfileDetails();
    displayOrders();
}


// ========================================
// LOAD PROFILE DETAILS
// ========================================

function loadProfileDetails() {

    const name = currentUser.name || "Customer";
    const email = currentUser.email || "";
    const phone = currentUser.phone || "";

    const sidebarName = document.getElementById("sidebarName");
    const sidebarEmail = document.getElementById("sidebarEmail");
    const avatar = document.getElementById("profileAvatar");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");

    if (sidebarName) sidebarName.textContent = name;
    if (sidebarEmail) sidebarEmail.textContent = email;

    if (avatar) {
        avatar.textContent = name.charAt(0).toUpperCase();
    }

    if (profileName) profileName.value = name;
    if (profileEmail) profileEmail.value = email;
    if (profilePhone) profilePhone.value = phone;
}


// ========================================
// TAB SWITCHING
// ========================================

function switchAccountTab(tabName) {

    document.querySelectorAll(".account-tab").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.tab === tabName
        );
    });

    document.querySelectorAll(".account-panel").forEach(panel => {
        panel.classList.remove("active");
    });

    const selectedPanel = document.getElementById(tabName + "Panel");

    if (selectedPanel) {
        selectedPanel.classList.add("active");
    }
}


// ========================================
// PROFILE EDIT
// ========================================

function enableProfileEdit() {

    const name = document.getElementById("profileName");
    const phone = document.getElementById("profilePhone");

    name.disabled = false;
    phone.disabled = false;

    document.getElementById("profileActions").hidden = false;

    name.focus();
}


// ========================================
// CANCEL PROFILE EDIT
// ========================================

function cancelProfileEdit() {

    loadProfileDetails();

    document.getElementById("profileName").disabled = true;
    document.getElementById("profilePhone").disabled = true;

    document.getElementById("profileActions").hidden = true;

    document.getElementById("profileMessage").textContent = "";
}


// ========================================
// SAVE PROFILE
// ========================================

function saveProfile(event) {

    event.preventDefault();

    const name = document.getElementById("profileName").value.trim();

    const phone = document.getElementById("profilePhone").value.trim();

    const message = document.getElementById("profileMessage");

    if (name.length < 2) {
        alert("Please enter a valid name.");
        return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const users = getStoredData("technovaUsers", []);

    const userIndex = users.findIndex(user => {

        if (currentUser.id != null && user.id != null) {
            return String(user.id) === String(currentUser.id);
        }

        return String(user.email || "").toLowerCase() ===
            String(currentUser.email || "").toLowerCase();
    });

    if (userIndex === -1) {

        alert("User account not found. Please register or login again.");

        return;
    }

    const updatedUser = {
        ...users[userIndex],
        name,
        phone
    };

    users[userIndex] = updatedUser;

    try {

        saveStoredData("technovaUsers", users);

        currentUser = {
            ...currentUser,
            name,
            phone
        };

        saveStoredData("technovaCurrentUser", currentUser);

    } catch (error) {

        console.error(error);

        alert("Unable to save profile. Browser storage may be full.");

        return;
    }

    loadProfileDetails();

    document.getElementById("profileName").disabled = true;
    document.getElementById("profilePhone").disabled = true;

    document.getElementById("profileActions").hidden = true;

    message.textContent = "Profile updated successfully!";

    message.style.color = "#16a34a";
}


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders() {

    const ordersList = document.getElementById("ordersList");

    if (!ordersList || !currentUser) return;

    const allOrders = getStoredData("technovaOrders", []);

    const userEmail = String(currentUser.email || "").toLowerCase();

    const userOrders = allOrders.filter(order => {

        const orderEmail = String(
            order.customer?.email || ""
        ).toLowerCase();

        return orderEmail === userEmail;
    });

    if (userOrders.length === 0) {

        ordersList.innerHTML = `
            <div class="no-orders">
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet.</p>
                <a href="shop.html">Start Shopping</a>
            </div>
        `;

        return;
    }

    ordersList.innerHTML = [...userOrders].reverse().map(order => {

        const items = Array.isArray(order.items) ? order.items : [];

        return `
            <div class="order-card">

                <div class="order-header">

                    <strong>
                        Order ID: ${escapeAccountHTML(order.orderId)}
                    </strong>

                    <span class="order-status">
                        ${escapeAccountHTML(order.status || "Order Placed")}
                    </span>

                </div>

                <div class="order-products">

                    ${items.map(item => `

                        <div class="order-product">

                            <img
                                src="${escapeAccountHTML(item.image || "https://placehold.co/100x100?text=Product")}"
                                alt="${escapeAccountHTML(item.name)}"
                                onerror="this.src='https://placehold.co/100x100?text=Product'"
                            >

                            <div>
                                <h4>${escapeAccountHTML(item.name)}</h4>
                                <p>Quantity: ${Number(item.quantity) || 1}</p>
                                <p>${adminAccountPrice(item.price)}</p>
                            </div>

                        </div>

                    `).join("")}

                </div>

                <div class="order-total">
                    Total: ${adminAccountPrice(order.total)}
                </div>

            </div>
        `;

    }).join("");
}


// ========================================
// HTML ESCAPE
// ========================================

function escapeAccountHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


// ========================================
// PRICE FORMAT
// ========================================

function adminAccountPrice(price) {

    return "₹" + Number(price || 0).toLocaleString("en-IN");
}


// ========================================
// LOGOUT
// ========================================

function logoutUser() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("technovaCurrentUser");

    window.location.replace("login.html");
}


// ========================================
// INITIALIZE EVENT LISTENERS
// ========================================

function initializeAccountPage() {

    if (!checkLogin()) return;

    // Profile and account data
    initializeAccount();

    // Tabs
    document.querySelectorAll(".account-tab").forEach(button => {

        button.addEventListener("click", () => {

            switchAccountTab(button.dataset.tab);

        });

    });

    // Edit profile
    document.getElementById("editProfileBtn")
        ?.addEventListener("click", enableProfileEdit);

    // Edit profile from settings
    document.getElementById("settingsEditBtn")
        ?.addEventListener("click", () => {

            switchAccountTab("profile");

            enableProfileEdit();

        });

    // Cancel edit
    document.getElementById("cancelEditBtn")
        ?.addEventListener("click", cancelProfileEdit);

    // Save profile
    document.getElementById("profileForm")
        ?.addEventListener("submit", saveProfile);

    // Logout buttons
    document.getElementById("logoutBtn")
        ?.addEventListener("click", logoutUser);

    document.getElementById("settingsLogoutBtn")
        ?.addEventListener("click", logoutUser);
}


// ========================================
// START ACCOUNT PAGE
// ========================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAccountPage
    );

} else {

    initializeAccountPage();

}
