/* TechNova Admin Dashboard — Frontend Demo (localStorage) */
"use strict";

// ========================================
// CONFIGURATION
// ========================================

const ADMIN_STATUSES = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
];

const MAX_PRODUCT_IMAGES = 6;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

let selectedProductImages = [];
let pendingImageRead = false;


// ========================================
// COMMON HELPERS
// ========================================

function adminElement(id) {
    return document.getElementById(id);
}

function adminPrice(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function escapeAdmin(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function readAdminStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value === null ? fallback : value;
    } catch (error) {
        console.warn("Invalid saved data:", key, error);
        return fallback;
    }
}

function saveAdminStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// ========================================
// GET DATA
// ========================================

function getAdminOrders() {
    return readAdminStorage("technovaOrders", []);
}

function getAdminUsers() {
    return readAdminStorage("technovaUsers", []);
}

function getCustomProducts() {
    return readAdminStorage("technovaCustomProducts", []);
}

function getProductOverrides() {
    return readAdminStorage("technovaProductOverrides", {});
}

function getDeletedProducts() {
    return readAdminStorage("technovaDeletedProducts", []);
}

function getAdminProducts() {
    return typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];
}


// ========================================
// DASHBOARD
// ========================================

function loadDashboard() {

    const orders = getAdminOrders();
    const users = getAdminUsers();

    const revenue = orders
        .filter(order => order.status !== "Cancelled")
        .reduce((sum, order) => sum + Number(order.total || 0), 0);

    if (adminElement("totalOrders")) {
        adminElement("totalOrders").textContent = orders.length;
    }

    if (adminElement("totalRevenue")) {
        adminElement("totalRevenue").textContent = adminPrice(revenue);
    }

    if (adminElement("totalProducts")) {
        adminElement("totalProducts").textContent =
            getAdminProducts().length;
    }

    if (adminElement("totalCustomers")) {
        adminElement("totalCustomers").textContent = users.length;
    }

    loadRecentOrders();
}


// ========================================
// RECENT ORDERS
// ========================================

function loadRecentOrders() {

    const table = adminElement("recentOrdersTable");

    if (!table) return;

    const orders = [...getAdminOrders()].reverse().slice(0, 5);

    table.innerHTML = orders.length
        ? orders.map(order => `
            <tr>
                <td>${escapeAdmin(order.orderId)}</td>

                <td>
                    ${escapeAdmin(order.customer?.name || "-")}
                </td>

                <td>
                    ${escapeAdmin(
                        order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString("en-IN")
                            : "-"
                    )}
                </td>

                <td>${adminPrice(order.total)}</td>

                <td>
                    <span class="table-status">
                        ${escapeAdmin(order.status)}
                    </span>
                </td>
            </tr>
        `).join("")
        : `
            <tr>
                <td colspan="5" class="empty-table">
                    No orders found.
                </td>
            </tr>
        `;
}


// ========================================
// ALL ORDERS
// ========================================

function loadOrders() {

    const table = adminElement("ordersTable");

    if (!table) return;

    const orders = [...getAdminOrders()].reverse();

    if (!orders.length) {
        table.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">
                    No orders available.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = orders.map(order => `

        <tr>

            <td>${escapeAdmin(order.orderId)}</td>

            <td>
                ${escapeAdmin(order.customer?.name || "-")}
                <br>
                <small>
                    ${escapeAdmin(order.customer?.email || "-")}
                </small>
            </td>

            <td>
                ${Array.isArray(order.items) ? order.items.length : 0}
                item(s)
            </td>

            <td>${adminPrice(order.total)}</td>

            <td>${escapeAdmin(order.paymentMethod || "-")}</td>

            <td>
                <select
                    class="status-select"
                    data-order-id="${escapeAdmin(order.orderId)}"
                >
                    ${ADMIN_STATUSES.map(status => `
                        <option
                            value="${escapeAdmin(status)}"
                            ${order.status === status ? "selected" : ""}
                        >
                            ${escapeAdmin(status)}
                        </option>
                    `).join("")}
                </select>
            </td>

            <td>
                <button
                    type="button"
                    class="update-status-btn"
                    data-update-order="${escapeAdmin(order.orderId)}"
                >
                    Update
                </button>
            </td>

        </tr>

    `).join("");
}


// ========================================
// UPDATE ORDER STATUS
// ========================================

function updateOrderStatus(orderId) {

    const select = [...document.querySelectorAll(".status-select")]
        .find(element => element.dataset.orderId === String(orderId));

    if (!select || !ADMIN_STATUSES.includes(select.value)) return;

    const orders = getAdminOrders();

    const order = orders.find(
        item => String(item.orderId) === String(orderId)
    );

    if (!order) {
        alert("Order not found!");
        return;
    }

    order.status = select.value;

    try {
        saveAdminStorage("technovaOrders", orders);
    } catch (error) {
        console.error(error);
        alert("Unable to update order.");
        return;
    }

    alert("Order status updated successfully!");

    loadOrders();
    loadDashboard();
}


// ========================================
// PRODUCT MANAGEMENT
// ========================================


// LOAD PRODUCTS TABLE

function loadProducts() {

    const table = adminElement("adminProductsTable");

    if (!table) return;

    const allProducts = getAdminProducts();

    if (!allProducts.length) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">
                    No products found.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = allProducts.map(product => `

        <tr>

            <td>
                <img
                    src="${escapeAdmin(product.image || "")}"
                    class="product-admin-image"
                    alt=""
                >
                ${escapeAdmin(product.name)}
            </td>

            <td>${escapeAdmin(product.category)}</td>

            <td>${escapeAdmin(product.brand)}</td>

            <td>${adminPrice(product.price)}</td>

            <td>${adminPrice(product.mrp)}</td>

            <td>

                <button
                    type="button"
                    class="product-action-btn edit-product-btn"
                    data-edit-product="${escapeAdmin(product.id)}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="product-action-btn delete-product-btn"
                    data-delete-product="${escapeAdmin(product.id)}"
                >
                    Delete
                </button>

            </td>

        </tr>

    `).join("");
}


// ========================================
// IMAGE PREVIEW
// ========================================

function renderProductImages(images) {

    const preview = adminElement("productImagePreview");

    if (!preview) return;

    preview.innerHTML = "";

    images.forEach((src, index) => {

        const box = document.createElement("div");
        box.className = "preview-image-box";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `Product image ${index + 1}`;

        const label = document.createElement("span");

        label.textContent = index === 0
            ? "Main Image"
            : `Image ${index + 1}`;

        box.append(img, label);

        preview.appendChild(box);
    });
}


// ========================================
// OPEN PRODUCT MODAL
// ========================================

function openProductModal() {

    const form = adminElement("productForm");

    if (!form) {
        alert("Product form not found in admin.html");
        return;
    }

    form.reset();

    adminElement("editProductId").value = "";

    adminElement("productModalTitle").textContent =
        "Add New Product";

    selectedProductImages = [];
    pendingImageRead = false;

    renderProductImages([]);

    adminElement("productModal")?.classList.add("active");
}


// ========================================
// CLOSE PRODUCT MODAL
// ========================================

function closeProductModal() {

    adminElement("productModal")?.classList.remove("active");
}


// ========================================
// EDIT PRODUCT
// ========================================

function editProduct(id) {

    const product = getAdminProducts().find(
        item => String(item.id) === String(id)
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const fields = {

        editProductId: product.id,

        productNameInput: product.name,

        productCategoryInput: product.category,

        productBrandInput: product.brand,

        productPriceInput: product.price,

        productMrpInput: product.mrp,

        productRatingInput: product.rating ?? 4.5

    };

    for (const [key, value] of Object.entries(fields)) {

        if (adminElement(key)) {
            adminElement(key).value = value;
        }
    }

    if (adminElement("productImagesInput")) {
        adminElement("productImagesInput").value = "";
    }

    selectedProductImages = [];
    pendingImageRead = false;

    const gallery = Array.isArray(product.gallery) && product.gallery.length
        ? product.gallery
        : (product.image ? [product.image] : []);

    renderProductImages(gallery);

    adminElement("productModalTitle").textContent =
        "Edit Product";

    adminElement("productModal")?.classList.add("active");
}


// ========================================
// READ IMAGE FILE
// ========================================

function readProductFile(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = () => {
            reject(new Error("Could not read image."));
        };

        reader.readAsDataURL(file);
    });
}


// ========================================
// HANDLE MULTIPLE IMAGE UPLOAD
// ========================================

async function handleProductImages(event) {

    const input = event.target;

    const files = Array.from(input.files || []);

    if (!files.length) {
        selectedProductImages = [];
        return;
    }

    if (files.length > MAX_PRODUCT_IMAGES) {

        alert(`Maximum ${MAX_PRODUCT_IMAGES} images allowed.`);

        input.value = "";

        return;
    }

    for (const file of files) {

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {

            alert("Only JPG, PNG and WEBP images are allowed.");

            input.value = "";

            return;
        }

        if (file.size > MAX_IMAGE_BYTES) {

            alert("Each image must be smaller than 2MB.");

            input.value = "";

            return;
        }
    }

    pendingImageRead = true;

    try {

        // First selected image becomes main image.
        selectedProductImages = await Promise.all(
            files.map(readProductFile)
        );

        renderProductImages(selectedProductImages);

    } catch (error) {

        console.error(error);

        selectedProductImages = [];

        alert("Unable to preview selected images.");

    } finally {

        pendingImageRead = false;
    }
}


// ========================================
// SAVE / UPDATE PRODUCT
// ========================================

function saveProduct(event) {

    event.preventDefault();

    if (pendingImageRead) {
        alert("Please wait until image previews are ready.");
        return;
    }

    const editId = adminElement("editProductId")?.value || "";

    const existing = editId
        ? getAdminProducts().find(p => String(p.id) === editId)
        : null;

    if (editId && !existing) {
        alert("Product not found.");
        return;
    }

    const price = Number(
        adminElement("productPriceInput")?.value
    );

    const mrp = Number(
        adminElement("productMrpInput")?.value
    );

    const rating = Number(
        adminElement("productRatingInput")?.value
    );

    if (
        !Number.isFinite(price) ||
        !Number.isFinite(mrp) ||
        price <= 0 ||
        mrp < price
    ) {
        alert(
            "Enter valid prices. MRP must be equal to or greater than selling price."
        );
        return;
    }

    if (
        !Number.isFinite(rating) ||
        rating < 0 ||
        rating > 5
    ) {
        alert("Rating must be between 0 and 5.");
        return;
    }

    const gallery = selectedProductImages.length
        ? [...selectedProductImages]
        : existing
            ? (
                Array.isArray(existing.gallery) && existing.gallery.length
                    ? [...existing.gallery]
                    : existing.image
                        ? [existing.image]
                        : []
            )
            : [];

    if (!gallery.length) {
        alert("Please select at least one product image.");
        return;
    }

    const productData = {

        name: adminElement("productNameInput")?.value.trim() || "",

        category: adminElement("productCategoryInput")?.value.trim() || "",

        brand: adminElement("productBrandInput")?.value.trim() || "",

        price,

        mrp,

        rating,

        discount: Math.round((mrp - price) / mrp * 100),

        image: gallery[0],

        gallery

    };

    if (
        !productData.name ||
        !productData.category ||
        !productData.brand
    ) {
        alert("Please fill in name, category and brand.");
        return;
    }

    try {

        if (editId) {

            const custom = getCustomProducts();

            const customIndex = custom.findIndex(
                p => String(p.id) === editId
            );

            if (customIndex !== -1) {

                // Update custom product directly.

                custom[customIndex] = {
                    ...custom[customIndex],
                    ...productData
                };

                saveAdminStorage(
                    "technovaCustomProducts",
                    custom
                );

                const overrides = getProductOverrides();

                if (Object.hasOwn(overrides, editId)) {

                    delete overrides[editId];

                    saveAdminStorage(
                        "technovaProductOverrides",
                        overrides
                    );
                }

            } else {

                // Update original product using overrides.

                const overrides = getProductOverrides();

                overrides[editId] = {
                    ...overrides[editId],
                    ...productData
                };

                saveAdminStorage(
                    "technovaProductOverrides",
                    overrides
                );
            }

        } else {

            // Add new product.

            const custom = getCustomProducts();

            const id = Math.max(
                Date.now(),
                ...getAdminProducts().map(p => Number(p.id) || 0),
                0
            ) + 1;

            custom.push({
                id,
                ...productData
            });

            saveAdminStorage(
                "technovaCustomProducts",
                custom
            );
        }

    } catch (error) {

        console.error("Product save error:", error);

        alert(
            "Product could not be saved. Browser storage may be full. Use smaller images or a backend image upload service."
        );

        return;
    }

    alert(
        editId
            ? "Product updated successfully!"
            : "Product added successfully!"
    );

    window.location.reload();
}


// ========================================
// DELETE PRODUCT
// ========================================

function deleteProduct(id) {

    const product = getAdminProducts().find(
        p => String(p.id) === String(id)
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const confirmDelete = confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmDelete) return;

    const key = String(id);

    try {

        const custom = getCustomProducts();

        if (
            custom.some(p => String(p.id) === key)
        ) {

            saveAdminStorage(
                "technovaCustomProducts",
                custom.filter(p => String(p.id) !== key)
            );

        } else {

            const deleted = getDeletedProducts();

            if (
                !deleted.some(item => String(item) === key)
            ) {

                deleted.push(product.id);

                saveAdminStorage(
                    "technovaDeletedProducts",
                    deleted
                );
            }
        }

        const overrides = getProductOverrides();

        delete overrides[key];

        saveAdminStorage(
            "technovaProductOverrides",
            overrides
        );

    } catch (error) {

        console.error(error);

        alert("Unable to delete product.");

        return;
    }

    alert("Product deleted successfully!");

    window.location.reload();
}


// ========================================
// CUSTOMERS
// ========================================

function loadCustomers() {

    const table = adminElement("customersTable");

    if (!table) return;

    const users = getAdminUsers();

    const orders = getAdminOrders();

    if (!users.length) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">
                    No customers registered.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = users.map(user => {

        const count = orders.filter(order =>

            String(order.customer?.email || "").toLowerCase() ===

            String(user.email || "").toLowerCase()

        ).length;

        return `
            <tr>

                <td>${escapeAdmin(user.name)}</td>

                <td>${escapeAdmin(user.email)}</td>

                <td>${escapeAdmin(user.phone || "-")}</td>

                <td>${count}</td>

            </tr>
        `;

    }).join("");
}


// ========================================
// ADMIN TAB NAVIGATION
// ========================================

function openAdminTab(tabName) {

    const panel = adminElement(tabName + "Panel");

    const button = [...document.querySelectorAll(".admin-nav-link")]
        .find(item => item.dataset.tab === tabName);

    if (!panel || !button) return;

    document.querySelectorAll(".admin-panel").forEach(item => {
        item.classList.remove("active");
    });

    document.querySelectorAll(".admin-nav-link").forEach(item => {
        item.classList.remove("active");
    });

    panel.classList.add("active");

    button.classList.add("active");

    const titles = {
        dashboard: "Dashboard",
        orders: "Orders",
        products: "Products",
        customers: "Customers"
    };

    if (adminElement("pageTitle")) {
        adminElement("pageTitle").textContent =
            titles[tabName] || tabName;
    }

    if (tabName === "dashboard") loadDashboard();

    if (tabName === "orders") loadOrders();

    if (tabName === "products") loadProducts();

    if (tabName === "customers") loadCustomers();

    adminElement("adminSidebar")?.classList.remove("open");
}


// ========================================
// INITIALIZE ADMIN DASHBOARD
// ========================================

function initializeAdmin() {

    // Current date

    if (adminElement("currentDate")) {

        adminElement("currentDate").textContent =
            new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
    }

    // Sidebar navigation

    document.querySelectorAll(".admin-nav-link").forEach(button => {

        button.addEventListener("click", () => {

            openAdminTab(button.dataset.tab);

        });

    });

    // View all buttons

    document.querySelectorAll("[data-open-tab]").forEach(button => {

        button.addEventListener("click", () => {

            openAdminTab(button.dataset.openTab);

        });

    });

    // Mobile sidebar

    adminElement("sidebarToggle")?.addEventListener("click", () => {

        adminElement("adminSidebar")?.classList.toggle("open");

    });

    // Image upload

    adminElement("productImagesInput")?.addEventListener(
        "change",
        handleProductImages
    );

    // Product form

    adminElement("productForm")?.addEventListener(
        "submit",
        saveProduct
    );

    // Close modal on background click

    adminElement("productModal")?.addEventListener("click", event => {

        if (event.target === adminElement("productModal")) {

            closeProductModal();

        }

    });

    // Close modal with Escape key

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeProductModal();

        }

    });

    // Dynamic button actions

    document.addEventListener("click", event => {

        const update = event.target.closest("[data-update-order]");

        if (update) {
            updateOrderStatus(update.dataset.updateOrder);
        }

        const edit = event.target.closest("[data-edit-product]");

        if (edit) {
            editProduct(edit.dataset.editProduct);
        }

        const remove = event.target.closest("[data-delete-product]");

        if (remove) {
            deleteProduct(remove.dataset.deleteProduct);
        }

    });

    // Initial data loading

    loadDashboard();

    loadProducts();
}


// ========================================
// START ADMIN
// ========================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAdmin
    );

} else {

    initializeAdmin();

}