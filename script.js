/* ===============================
   Eden's Greenery – script.js
   =============================== */

// -------------------------------
// Product Data
// -------------------------------
const products = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        price: 59.99,
        img: "images/monstera.jpg",
        url: "products/monstera-deliciosa.html",
        alt: "Monstera Deliciosa large plant in ceramic pot",
        dateAdded: "2025-08-01"
    },
    {
        id: 2,
        name: "Fiddle Leaf Fig",
        price: 89.99,
        img: "images/fiddle-leaf-fig.jpg",
        url: "products/fiddle-leaf-fig.html",
        alt: "Tall Fiddle Leaf Fig in woven basket",
        dateAdded: "2025-08-01"
    },
    {
        id: 3,
        name: "Snake Plant",
        price: 34.99,
        img: "images/snake-plant.jpg",
        url: "products/snake-plant.html",
        alt: "Snake Plant in white ceramic pot",
        dateAdded: "2025-08-01"
    },
    {
        id: 4,
        name: "ZZ Plant",
        price: 39.99,
        img: "images/zz-plant.jpg",
        url: "products/zz-plant.html",
        alt: "ZZ Plant on wooden side table",
        dateAdded: "2025-08-01"
    },
    {
        id: 5,
        name: "Peace Lily",
        price: 29.99,
        img: "images/peace-lily.jpg",
        url: "products/peace-lily.html",
        alt: "Peace Lily with white flowers in ceramic pot",
        dateAdded: "2025-08-01"
    }
];

// -------------------------------
// Cart Logic
// -------------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    document.querySelectorAll('.cart-count').forEach(span => {
        span.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    });
}
updateCartCount();

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(
