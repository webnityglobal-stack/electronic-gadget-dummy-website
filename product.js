const products = [
    {
        id: 1,
        name: "Pro Wireless Headphones",
        category: "Headphones",
        brand: "Sony",
        price: 3999,
        mrp: 5999,
        rating: 4.8,
        discount: 33,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700"
    },
    {
        id: 2,
        name: "Premium Smart Watch",
        category: "Smartwatches",
        brand: "Samsung",
        price: 5499,
        mrp: 7999,
        rating: 4.7,
        discount: 31,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
    },
    {
        id: 3,
        name: "Wireless Gaming Mouse",
        category: "Gaming",
        brand: "Logitech",
        price: 1999,
        mrp: 2999,
        rating: 4.6,
        discount: 33,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=700"
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        category: "Speakers",
        brand: "JBL",
        price: 2499,
        mrp: 3999,
        rating: 4.9,
        discount: 38,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700"
    },
    {
        id: 5,
        name: "Premium Smartphone",
        category: "Smartphones",
        brand: "Apple",
        price: 69999,
        mrp: 79999,
        rating: 4.9,
        discount: 12,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700"
    },
    {
        id: 6,
        name: "Ultra Slim Laptop",
        category: "Laptops",
        brand: "Apple",
        price: 89999,
        mrp: 99999,
        rating: 4.8,
        discount: 10,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700"
    },
    {
        id: 7,
        name: "Wireless Earbuds",
        category: "Headphones",
        brand: "Samsung",
        price: 2999,
        mrp: 4999,
        rating: 4.5,
        discount: 40,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700"
    },
    {
        id: 8,
        name: "Mechanical Gaming Keyboard",
        category: "Gaming",
        brand: "Logitech",
        price: 3499,
        mrp: 4999,
        rating: 4.7,
        discount: 30,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700"
    },
    {
        id: 9,
        name: "Digital Smart Watch",
        category: "Smartwatches",
        brand: "Noise",
        price: 1999,
        mrp: 3499,
        rating: 4.4,
        discount: 43,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700"
    },
    {
        id: 10,
        name: "Portable Bluetooth Speaker",
        category: "Speakers",
        brand: "JBL",
        price: 1799,
        mrp: 2499,
        rating: 4.6,
        discount: 28,
        image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=700"
    },
    {
        id: 11,
        name: "Premium Gaming Headset",
        category: "Headphones",
        brand: "Logitech",
        price: 4599,
        mrp: 5999,
        rating: 4.7,
        discount: 23,
        image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=700"
    },
    {
        id: 12,
        name: "Modern Laptop",
        category: "Laptops",
        brand: "Dell",
        price: 62999,
        mrp: 74999,
        rating: 4.8,
        discount: 16,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700"
    }
];// ========================================
// LOAD SAVED PRODUCT CHANGES
// ========================================

const savedProductOverrides = JSON.parse(
    localStorage.getItem("technovaProductOverrides") || "{}"
);

const savedCustomProducts = JSON.parse(
    localStorage.getItem("technovaCustomProducts") || "[]"
);

const deletedProductIds = JSON.parse(
    localStorage.getItem("technovaDeletedProducts") || "[]"
);

// Apply edits to existing products
products.forEach(product => {
    const override = savedProductOverrides[product.id];

    if (override) {
        Object.assign(product, override);
    }
});

// Add newly created products
savedCustomProducts.forEach(customProduct => {
    if (!products.some(product => product.id === customProduct.id)) {
        products.push(customProduct);
    }
});

// Remove deleted products
for (let i = products.length - 1; i >= 0; i--) {
    if (deletedProductIds.includes(products[i].id)) {
        products.splice(i, 1);
    }
}